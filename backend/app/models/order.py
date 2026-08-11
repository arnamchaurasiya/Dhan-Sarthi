"""
Dhan Sarthi — Order & OrderEvent Models
TDD Section 9.3 — Order Data Model
Idempotency key enforced at DB level via UNIQUE constraint.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
try:
    from sqlalchemy import JSON
except ImportError:
    from sqlalchemy.dialects.sqlite import JSON
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class Order(Base):
    """
    An investment order created after a successful authorization gateway check.
    idempotency_key: UNIQUE — prevents duplicate orders on retry.
    status lifecycle: INTENT → SUBMITTED → EXECUTED / FAILED / CANCELLED
    """
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    instrument_id = Column(String, nullable=True)              # FK to instruments (nullable for hackathon)
    authorization_id = Column(String, nullable=False, index=True)  # FK to suitability_assessments
    order_type = Column(String, default="BUY")                 # BUY / SELL
    amount = Column(Float, nullable=False)
    units = Column(Float, nullable=True)
    # Status: INTENT / SUBMITTED / EXECUTED / FAILED / CANCELLED
    status = Column(String, default="INTENT", index=True)
    idempotency_key = Column(String, unique=True, nullable=False)  # UNIQUE — prevents duplicates
    broker_ref_id = Column(String, nullable=True)              # Populated post-execution (future)
    created_at = Column(DateTime, default=datetime.utcnow)
    executed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="orders")
    events = relationship("OrderEvent", back_populates="order", cascade="all, delete-orphan")


class OrderEvent(Base):
    """
    Immutable event log for every order state transition.
    Enables full audit trail for each order lifecycle event.
    """
    __tablename__ = "order_events"

    id = Column(String, primary_key=True, default=_uuid)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False, index=True)
    # Event type: CREATED / SUBMITTED / EXECUTED / FAILED / CANCELLED
    event_type = Column(String, nullable=False)
    payload = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="events")
