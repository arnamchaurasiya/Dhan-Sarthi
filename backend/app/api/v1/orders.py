"""
Dhan Sarthi — Order Router (Idempotent)
TDD Section 9 — Execution & Order Router Layer

POST /api/v1/orders/create   → idempotent order creation (requires valid authorization)
GET  /api/v1/orders/{id}     → order status + event history
GET  /api/v1/orders/user/{user_id} → all orders for a user

Idempotency: same Idempotency-Key header returns original order without duplication.
Authorization check: order must reference a valid, unexpired, authorized assessment.
Execution: hackathon simulates broker submission; production routes to broker APIs.
"""
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.audit import publish_event
from app.models.order import Order, OrderEvent
from app.models.suitability import SuitabilityAssessment

router = APIRouter(prefix="/api/v1/orders", tags=["order-router"])


class OrderRequest(BaseModel):
    user_id: str
    asset_id: str
    authorization_id: str = Field(..., description="Must reference a valid INVESTMENT_AUTHORIZED assessment")
    amount: float = Field(..., gt=0, description="Investment amount in INR")
    units: Optional[float] = Field(None, description="Number of units (optional, computed by backend)")
    order_type: str = Field("BUY", description="BUY or SELL")


@router.post("/create")
def create_order(
    request: OrderRequest,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
    db: Session = Depends(get_db),
):
    """
    Create an investment order. Requires a valid Investment Authorization ID.

    Idempotency: include 'Idempotency-Key: <uuid>' header.
    If the same key is re-submitted, the original order is returned without duplication.

    Hackathon: status is set to SUBMITTED (simulated confirmation).
    Production: routes to regulated broker API (Zerodha Kite / Groww Direct).
    """
    # Auto-generate idempotency key if not provided
    if not idempotency_key:
        idempotency_key = str(uuid.uuid4())

    # ── Idempotency check ───────────────────────────────────────────────────────
    existing = db.query(Order).filter(Order.idempotency_key == idempotency_key).first()
    if existing:
        return {
            "order_id": existing.id,
            "status": existing.status,
            "amount": existing.amount,
            "asset_id": existing.instrument_id,
            "idempotency_key": idempotency_key,
            "duplicate_request": True,
            "message": "Order already exists for this idempotency key. Returning original.",
        }

    # ── Authorization validation ────────────────────────────────────────────────
    auth = db.query(SuitabilityAssessment).filter(
        SuitabilityAssessment.id == request.authorization_id,
        SuitabilityAssessment.investment_authorized == True,
    ).first()

    if not auth:
        raise HTTPException(
            status_code=403,
            detail=(
                "Investment not authorized. Complete the authorization gateway "
                "(POST /api/v1/gateway/authorize) before placing an order."
            ),
        )

    # Check authorization expiry
    if auth.expires_at and datetime.utcnow() > auth.expires_at:
        raise HTTPException(
            status_code=403,
            detail=(
                f"Authorization expired at {auth.expires_at.isoformat()}Z. "
                "Re-run the authorization gateway to get a fresh authorization."
            ),
        )

    # Validate asset matches authorization
    if auth.instrument_id != request.asset_id:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Authorization is for asset '{auth.instrument_id}' "
                f"but order is for '{request.asset_id}'. Authorization is asset-specific."
            ),
        )

    # ── Create order ────────────────────────────────────────────────────────────
    order = Order(
        user_id=request.user_id,
        instrument_id=request.asset_id,
        authorization_id=request.authorization_id,
        order_type=request.order_type,
        amount=request.amount,
        units=request.units,
        status="SUBMITTED",        # Hackathon: simulate immediate submission
        idempotency_key=idempotency_key,
    )
    db.add(order)
    db.flush()  # Get order.id before adding events

    # ── Create order event ──────────────────────────────────────────────────────
    event = OrderEvent(
        order_id=order.id,
        event_type="CREATED",
        payload={
            "amount": request.amount,
            "asset_id": request.asset_id,
            "order_type": request.order_type,
            "authorization_id": request.authorization_id,
        },
    )
    db.add(event)

    # ── Simulate submission event (hackathon) ────────────────────────────────────
    sub_event = OrderEvent(
        order_id=order.id,
        event_type="SUBMITTED",
        payload={
            "note": "Simulated broker submission (hackathon). Production: Zerodha Kite / Groww Direct API.",
            "simulated_broker_ref": f"SIM-{uuid.uuid4().hex[:8].upper()}",
        },
    )
    db.add(sub_event)
    db.commit()
    db.refresh(order)

    # ── Publish audit event ─────────────────────────────────────────────────────
    publish_event(
        "ORDER_CREATED", request.user_id, "order_router",
        {
            "order_id": order.id,
            "asset_id": request.asset_id,
            "amount": request.amount,
            "authorization_id": request.authorization_id,
            "idempotency_key": idempotency_key,
        },
        severity="HIGH",
    )

    return {
        "order_id": order.id,
        "status": order.status,
        "user_id": request.user_id,
        "asset_id": request.asset_id,
        "amount": request.amount,
        "units": request.units,
        "order_type": request.order_type,
        "authorization_id": request.authorization_id,
        "idempotency_key": idempotency_key,
        "created_at": order.created_at.isoformat() + "Z",
        "duplicate_request": False,
        "execution_note": (
            "Order submitted (simulated — hackathon). "
            "Production will route to regulated broker API and update portfolio on confirmation."
        ),
    }


@router.get("/user/{user_id}")
def get_user_orders(user_id: str, db: Session = Depends(get_db)):
    """Get all orders for a user."""
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    return {
        "user_id": user_id,
        "orders": [
            {
                "order_id": o.id,
                "asset_id": o.instrument_id,
                "amount": o.amount,
                "status": o.status,
                "created_at": o.created_at.isoformat() + "Z",
            }
            for o in orders
        ],
        "total": len(orders),
    }


@router.get("/{order_id}")
def get_order(order_id: str, db: Session = Depends(get_db)):
    """Get order details and full event history."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return {
        "order_id": order.id,
        "user_id": order.user_id,
        "asset_id": order.instrument_id,
        "amount": order.amount,
        "units": order.units,
        "order_type": order.order_type,
        "status": order.status,
        "authorization_id": order.authorization_id,
        "idempotency_key": order.idempotency_key,
        "broker_ref_id": order.broker_ref_id,
        "created_at": order.created_at.isoformat() + "Z",
        "executed_at": order.executed_at.isoformat() + "Z" if order.executed_at else None,
        "events": [
            {"type": e.event_type, "payload": e.payload, "timestamp": e.timestamp.isoformat() + "Z"}
            for e in order.events
        ],
    }
