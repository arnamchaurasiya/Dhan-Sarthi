"""
Dhan Sarthi — Portfolio Intelligence API
TDD Section 11 — Portfolio Intelligence Engine

POST /api/v1/portfolio/analyze — analyze portfolio risk against user's profile
POST /api/v1/portfolio/impact  — calculate portfolio allocation impact before investing
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import List, Dict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.audit import publish_event
from app.services.portfolio_service import analyze_portfolio, calculate_portfolio_impact

router = APIRouter(prefix="/api/v1/portfolio", tags=["portfolio-intelligence"])


class HoldingItem(BaseModel):
    name: str
    asset_class: str
    amount: float = Field(..., gt=0)


class InvestorProfileInput(BaseModel):
    risk_profile: str = "Moderate"
    primary_goal: str = "Wealth Creation"
    investment_horizon: str = "5–10 years"


class PortfolioAnalysisRequest(BaseModel):
    user_id: str
    holdings: List[HoldingItem]
    investor_profile: InvestorProfileInput = InvestorProfileInput()


class PortfolioImpactRequest(BaseModel):
    user_id: str
    current_portfolio_value: float = Field(..., gt=0)
    current_asset_pcts: Dict[str, float]
    invest_amount: float = Field(..., gt=0)
    invest_asset_class: str


@router.post("/analyze")
def analyze(request: PortfolioAnalysisRequest, db: Session = Depends(get_db)):
    """Personalized portfolio risk analysis (relative to investor's risk profile)."""
    holdings_dicts = [h.dict() for h in request.holdings]
    profile_dict = request.investor_profile.dict()

    result = analyze_portfolio(holdings_dicts, profile_dict)

    publish_event(
        "PORTFOLIO_SYNCHRONIZED", request.user_id, "portfolio_engine",
        {
            "holdings_count": len(request.holdings),
            "total_value": result.get("total_portfolio_value"),
            "health": result.get("overall_health"),
        },
        severity="MEDIUM",
    )

    return result


@router.post("/impact")
def impact(request: PortfolioImpactRequest):
    """Calculate exact asset allocation impact before committing capital."""
    return calculate_portfolio_impact(
        current_portfolio_value=request.current_portfolio_value,
        current_asset_pcts=request.current_asset_pcts,
        invest_amount=request.invest_amount,
        invest_asset_class=request.invest_asset_class,
    )
