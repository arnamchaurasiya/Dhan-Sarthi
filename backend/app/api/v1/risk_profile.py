"""
Dhan Sarthi — Risk Profile API
Persist risk questionnaire responses and return risk classification.
TDD Section 5.3 — Dhan Marg Navigation Flow
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.audit import publish_event
from app.models.suitability import RiskProfile
from app.models.user import InvestorProfile

router = APIRouter(prefix="/api/v1/risk", tags=["risk-profile"])

# SEBI-aligned 4-question questionnaire score → risk classification
# Score range: 4 (all conservative) to 12 (all aggressive)
RISK_THRESHOLDS = {
    (4, 5): "Conservative",
    (6, 8): "Moderate",
    (9, 12): "Aggressive",
}


class RiskProfileRequest(BaseModel):
    user_id: str
    responses: dict = Field(
        default_factory=dict,
        description="Questionnaire responses: {q1: 'sell_all', q2: 'balanced', ...}"
    )
    total_score: int = Field(..., ge=4, le=12, description="Sum of questionnaire scores (4-12)")
    investment_horizon: Optional[str] = "5–10 years"
    primary_goal: Optional[str] = "Wealth Creation"
    liquidity_need: Optional[str] = "Medium"


class InvestorProfileRequest(BaseModel):
    user_id: str
    risk_profile: str
    investment_horizon: str = "5–10 years"
    primary_goal: str = "Wealth Creation"
    liquidity_need: str = "Medium"
    target_amount: Optional[float] = None
    target_timeframe_years: Optional[int] = None


def classify_risk(score: int) -> str:
    for (low, high), classification in RISK_THRESHOLDS.items():
        if low <= score <= high:
            return classification
    return "Moderate"


@router.post("/profile")
def submit_risk_profile(request: RiskProfileRequest, db: Session = Depends(get_db)):
    """Submit questionnaire responses and persist risk classification."""
    classification = classify_risk(request.total_score)

    profile = RiskProfile(
        user_id=request.user_id,
        questionnaire_version="v1",
        responses=request.responses,
        total_score=request.total_score,
        risk_classification=classification,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    publish_event(
        "RISK_PROFILE_SET", request.user_id, "risk_service",
        {
            "profile_id": profile.id,
            "classification": classification,
            "total_score": request.total_score,
        },
        severity="MEDIUM",
    )

    return {
        "profile_id": profile.id,
        "risk_classification": classification,
        "total_score": request.total_score,
        "description": _risk_description(classification),
        "message": f"Risk profile set to {classification}.",
    }


@router.get("/profile/{user_id}")
def get_risk_profile(user_id: str, db: Session = Depends(get_db)):
    """Retrieve the most recent risk profile for a user."""
    profile = db.query(RiskProfile).filter(
        RiskProfile.user_id == user_id
    ).order_by(RiskProfile.assessed_at.desc()).first()

    if not profile:
        return {
            "user_id": user_id,
            "risk_classification": None,
            "message": "No risk profile found. Complete the risk questionnaire in Dhan Marg.",
        }
    return {
        "profile_id": profile.id,
        "risk_classification": profile.risk_classification,
        "total_score": profile.total_score,
        "description": _risk_description(profile.risk_classification),
        "assessed_at": profile.assessed_at.isoformat() + "Z",
    }


@router.post("/investor-profile")
def save_investor_profile(request: InvestorProfileRequest, db: Session = Depends(get_db)):
    """Persist full investor profile (risk + horizon + goal + liquidity)."""
    existing = db.query(InvestorProfile).filter(
        InvestorProfile.user_id == request.user_id
    ).first()

    if existing:
        existing.risk_profile = request.risk_profile
        existing.investment_horizon = request.investment_horizon
        existing.primary_goal = request.primary_goal
        existing.liquidity_need = request.liquidity_need
        existing.target_amount = request.target_amount
        existing.target_timeframe_years = request.target_timeframe_years
        existing.is_complete = True
        db.commit()
        db.refresh(existing)
        profile_id = existing.id
    else:
        profile = InvestorProfile(
            user_id=request.user_id,
            risk_profile=request.risk_profile,
            investment_horizon=request.investment_horizon,
            primary_goal=request.primary_goal,
            liquidity_need=request.liquidity_need,
            target_amount=request.target_amount,
            target_timeframe_years=request.target_timeframe_years,
            is_complete=True,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        profile_id = profile.id

    return {
        "profile_id": profile_id,
        "user_id": request.user_id,
        "risk_profile": request.risk_profile,
        "investment_horizon": request.investment_horizon,
        "primary_goal": request.primary_goal,
        "liquidity_need": request.liquidity_need,
        "is_complete": True,
        "message": "Investor profile saved successfully.",
    }


def _risk_description(classification: str) -> str:
    descriptions = {
        "Conservative": "Prefers capital preservation. Suitable products: Bonds, Gold, FDs.",
        "Moderate": "Balanced growth and stability. Suitable: Mutual Funds, REITs, InvITs.",
        "Aggressive": "Comfortable with volatility for higher returns. Suitable: Equity, F&O.",
    }
    return descriptions.get(classification, "")
