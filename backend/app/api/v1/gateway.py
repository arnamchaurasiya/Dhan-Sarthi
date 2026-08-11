"""
Dhan Sarthi — Investment Authorization Gateway API
TDD Section 3 — Safety & Decision Gateway

POST /api/v1/gateway/authorize  → runs all 8 gates, returns authorization object
GET  /api/v1/gateway/status/{id} → check an existing authorization
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.authorization_service import run_authorization_gateway

router = APIRouter(prefix="/api/v1/gateway", tags=["investment-authorization"])


# ─── Request Model ─────────────────────────────────────────────────────────────

class InvestorProfileInput(BaseModel):
    risk_profile: str = Field("Moderate", description="Conservative / Moderate / Aggressive")
    investment_horizon: str = Field("5–10 years", description="e.g. '5–10 years'")
    primary_goal: str = Field("Wealth Creation", description="e.g. 'Wealth Creation'")
    liquidity_need: str = Field("Medium", description="High / Medium / Low")
    equity_pct: float = Field(50.0, description="Current equity % in portfolio")


class InstrumentInput(BaseModel):
    risk_level: str = Field("Moderate", description="Low / LowToModerate / Moderate / High / VeryHigh")
    liquidity_level: str = Field("Medium", description="High / Medium / Low")
    horizon_req: str = Field("5+ years", description="e.g. '5+ years'")
    asset_class: str = Field("REIT", description="Equity / MutualFund / REIT / Bond / Gold / InvIT")
    name: str = Field("", description="Instrument name for display")


class PortfolioImpactInput(BaseModel):
    new_asset_pct: float = Field(0.0, description="New % of this asset class after investment")


class AuthorizationRequest(BaseModel):
    user_id: str
    asset_id: str
    investor_profile: InvestorProfileInput
    instrument: InstrumentInput
    knowledge_score: int = Field(0, ge=0, le=100, description="Score from /smart-checkpoint, 0-100")
    portfolio_impact: PortfolioImpactInput = PortfolioImpactInput()
    entity_verified: bool = Field(False, description="True if Rakshak entity verification passed")
    scam_scan_clean: bool = Field(True, description="True if Rakshak scam scan found no indicators")
    disclosures_acknowledged: bool = Field(False, description="True if investor confirmed risk disclosures")


# ─── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/authorize")
def authorize_investment(request: AuthorizationRequest, db: Session = Depends(get_db)):
    """
    Backend-enforced Investment Authorization Gateway.

    Runs all 8 gates server-side:
      1. Eligibility (KYC + AA consent)
      2. Risk Assessment
      3. Suitability Score (multi-factor)
      4. Knowledge Check
      5. Portfolio Impact / Concentration
      6. Rakshak Safety Check
      7. Mandatory Disclosures
      8. Final Authorization Decision

    Returns the structured authorization object (TDD Section 3.2).
    `investment_authorized` is True ONLY when every gate passes.
    """
    result = run_authorization_gateway(
        db=db,
        user_id=request.user_id,
        asset_id=request.asset_id,
        investor_profile=request.investor_profile.dict(),
        instrument=request.instrument.dict(),
        knowledge_score=request.knowledge_score,
        portfolio_impact=request.portfolio_impact.dict(),
        entity_verified=request.entity_verified,
        scam_scan_clean=request.scam_scan_clean,
        disclosures_acknowledged=request.disclosures_acknowledged,
    )
    return result


@router.get("/status/{authorization_id}")
def get_authorization_status(authorization_id: str, db: Session = Depends(get_db)):
    """Look up a previously issued authorization by its ID."""
    from app.models.suitability import SuitabilityAssessment
    assessment = db.query(SuitabilityAssessment).filter(
        SuitabilityAssessment.id == authorization_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Authorization not found.")
    from datetime import datetime
    expired = (
        assessment.expires_at is not None
        and datetime.utcnow() > assessment.expires_at
        and assessment.investment_authorized
    )
    return {
        "authorization_id": authorization_id,
        "user_id": assessment.user_id,
        "asset_id": assessment.instrument_id,
        "investment_authorized": assessment.investment_authorized,
        "suitability_score": assessment.suitability_score,
        "all_gates_result": assessment.all_gates_result,
        "denial_reasons": assessment.denial_reasons,
        "authorized_at": assessment.authorized_at.isoformat() + "Z" if assessment.authorized_at else None,
        "expires_at": assessment.expires_at.isoformat() + "Z" if assessment.expires_at else None,
        "is_expired": expired,
    }
