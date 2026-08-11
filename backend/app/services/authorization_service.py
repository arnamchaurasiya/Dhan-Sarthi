"""
Dhan Sarthi — Investment Authorization Gateway Service (Backend-Enforced)
TDD Section 3 — Safety & Decision Gateway
TDD Section 3.2 — Investment Authorization Decision Object

This is the core safety engine. ALL 8 gates must PASS before
investment_authorized is set to True. No UI bypass is possible —
the authorization decision is computed entirely server-side.

Gates (in order):
  1. Eligibility Check   — KYC completed + AA consent active
  2. Risk Assessment     — Product risk ≤ investor's risk profile
  3. Suitability Score   — Multi-factor score ≥ 60/100
  4. Knowledge Check     — Quiz score ≥ 50/100
  5. Portfolio Impact    — New concentration ≤ profile-based threshold
  6. Rakshak Safety      — Entity verified + scam scan clean
  7. Mandatory Disclosures — Investor acknowledged risk disclosures
  8. Final Authorization — Structured decision object emitted
"""
import uuid
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session

from app.models.suitability import SuitabilityAssessment, SuitabilityFactor, RiskProfile
from app.models.consent import Consent
from app.models.user import KYCRecord
from app.core.audit import publish_event
from app.core.config import settings

# ─── Risk compatibility matrix ─────────────────────────────────────────────────
# Which product risk levels are acceptable for each investor risk profile
RISK_COMPATIBILITY = {
    "Conservative":  ["Low"],
    "Moderate":      ["Low", "LowToModerate", "Moderate"],
    "Aggressive":    ["Low", "LowToModerate", "Moderate", "ModerateToHigh", "High"],
}

# ─── Concentration thresholds by risk profile ──────────────────────────────────
CONCENTRATION_LIMITS = {
    "Conservative": 20.0,   # Max 20% in any single asset class
    "Moderate":     35.0,
    "Aggressive":   50.0,
}

# ─── Goal → acceptable asset class mapping ─────────────────────────────────────
GOAL_ASSET_MAP = {
    "Capital Preservation": ["Bond", "Gold"],
    "Regular Income":       ["Bond", "REIT", "InvIT"],
    "Wealth Creation":      ["Equity", "MutualFund", "REIT", "InvIT"],
    "Retirement":           ["MutualFund", "Bond", "REIT"],
    "Child Education":      ["MutualFund", "Equity"],
}

# ─── Liquidity compatibility ───────────────────────────────────────────────────
LIQUIDITY_RANK = {"High": 3, "Medium": 2, "Low": 1}


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN GATEWAY FUNCTION
# ═══════════════════════════════════════════════════════════════════════════════

def run_authorization_gateway(
    db: Session,
    user_id: str,
    asset_id: str,
    investor_profile: dict,
    instrument: dict,
    knowledge_score: int,
    portfolio_impact: dict,
    entity_verified: bool,
    scam_scan_clean: bool,
    disclosures_acknowledged: bool,
    session_id: Optional[str] = None,
) -> dict:
    """
    Run all 8 authorization gates and return the structured authorization object.

    Args:
        user_id:                  Investor's user ID
        asset_id:                 Asset/instrument symbol or ID being authorized
        investor_profile:         Dict with keys: risk_profile, investment_horizon,
                                  primary_goal, liquidity_need, equity_pct
        instrument:               Dict with keys: risk_level, liquidity_level,
                                  horizon_req, asset_class, name
        knowledge_score:          0-100 from /api/v1/ai/smart-checkpoint
        portfolio_impact:         Dict with key: new_asset_pct (float)
        entity_verified:          Boolean from Rakshak entity verification
        scam_scan_clean:          Boolean from Rakshak scam scan
        disclosures_acknowledged: Boolean — investor acknowledged risk disclosures

    Returns:
        Full TDD 3.2 authorization object with gates, decision, and denial_reasons.
    """
    authorization_id = str(uuid.uuid4())
    denial_reasons = []
    gates = {}
    factors = []

    # ── GATE 1: Eligibility — KYC + Consent ───────────────────────────────────
    kyc = db.query(KYCRecord).filter(
        KYCRecord.user_id == user_id,
        KYCRecord.status == "COMPLETED",
    ).first()
    gates["kyc_verified"] = bool(kyc)

    active_consent = db.query(Consent).filter(
        Consent.user_id == user_id,
        Consent.status == "ACTIVE",
    ).first()
    gates["aa_consent_active"] = bool(active_consent)

    eligibility_pass = gates["kyc_verified"] and gates["aa_consent_active"]
    gates["eligibility_check"] = "PASS" if eligibility_pass else "FAIL"
    if not gates["kyc_verified"]:
        denial_reasons.append("KYC not completed. Complete eKYC verification before investing.")
    if not gates["aa_consent_active"]:
        denial_reasons.append("AA consent not active. Grant portfolio access consent in Dhan Darpan.")

    # ── GATE 2: Risk Assessment ────────────────────────────────────────────────
    user_risk = investor_profile.get("risk_profile", "Conservative")
    product_risk = instrument.get("risk_level", "VeryHigh")
    compatible_risks = RISK_COMPATIBILITY.get(user_risk, [])
    risk_pass = product_risk in compatible_risks
    gates["risk_profile"] = user_risk
    gates["risk_check"] = "PASS" if risk_pass else "FAIL"
    if not risk_pass:
        denial_reasons.append(
            f"Product risk '{product_risk}' exceeds your '{user_risk}' risk profile. "
            "Consider a lower-risk alternative or updating your risk profile."
        )

    # ── GATE 3: Suitability Score ─────────────────────────────────────────────
    score, factor_records = _compute_suitability_score(investor_profile, instrument)
    factors = factor_records
    gates["suitability_score"] = score
    suitability_pass = score >= settings.MIN_SUITABILITY_SCORE
    gates["suitability_check"] = "PASS" if suitability_pass else "FAIL"
    if not suitability_pass:
        denial_reasons.append(
            f"Suitability score {score}/100 is below the minimum threshold of "
            f"{settings.MIN_SUITABILITY_SCORE}. "
            "Review the explainability matrix for mismatched factors."
        )

    # ── GATE 4: Knowledge Check ───────────────────────────────────────────────
    gates["knowledge_score"] = knowledge_score
    knowledge_pass = knowledge_score >= settings.MIN_KNOWLEDGE_SCORE
    gates["knowledge_check"] = "PASS" if knowledge_pass else "FAIL"
    if not knowledge_pass:
        denial_reasons.append(
            f"Knowledge check score {knowledge_score}/100 is below the minimum "
            f"of {settings.MIN_KNOWLEDGE_SCORE}. "
            "Complete the asset-specific quiz in Dhan Gyaan before proceeding."
        )

    # ── GATE 5: Portfolio Impact / Concentration ───────────────────────────────
    new_concentration = float(portfolio_impact.get("new_asset_pct", 0))
    concentration_limit = CONCENTRATION_LIMITS.get(user_risk, 35.0)
    impact_pass = new_concentration <= concentration_limit
    gates["portfolio_impact"] = "ACCEPTABLE" if impact_pass else "CONCENTRATION_WARNING"
    gates["portfolio_concentration_after"] = f"{new_concentration:.1f}%"
    gates["portfolio_concentration_limit"] = f"{concentration_limit:.0f}%"
    if not impact_pass:
        denial_reasons.append(
            f"This investment would bring {instrument.get('asset_class', 'asset')} "
            f"concentration to {new_concentration:.1f}%, which exceeds the "
            f"{concentration_limit:.0f}% guideline for a {user_risk} investor. "
            "Consider diversifying or investing a smaller amount."
        )

    # ── GATE 6: Rakshak Safety Check ─────────────────────────────────────────
    gates["entity_verified"] = entity_verified
    gates["scam_scan"] = "CLEAN" if scam_scan_clean else "FLAGGED"
    safety_pass = entity_verified and scam_scan_clean
    gates["safety_check"] = "PASS" if safety_pass else "FAIL"
    if not entity_verified:
        denial_reasons.append(
            "Issuer entity could not be verified in the SEBI intermediary registry. "
            "Use Rakshak → Entity Verification before proceeding."
        )
    if not scam_scan_clean:
        denial_reasons.append(
            "Scam indicators were detected in the content associated with this investment. "
            "Rakshak has flagged this for your protection. Do not proceed."
        )

    # ── GATE 7: Mandatory Disclosures ─────────────────────────────────────────
    gates["risk_disclosures_acknowledged"] = disclosures_acknowledged
    if not disclosures_acknowledged:
        denial_reasons.append(
            "Risk disclosures have not been acknowledged. "
            "Please read and confirm the investment risk notice before proceeding."
        )

    # ── Final Decision ─────────────────────────────────────────────────────────
    investment_authorized = len(denial_reasons) == 0
    now = datetime.utcnow()
    expiry = now + timedelta(minutes=settings.AUTHORIZATION_EXPIRY_MINUTES)

    # ── Persist Assessment ─────────────────────────────────────────────────────
    assessment = SuitabilityAssessment(
        id=authorization_id,
        user_id=user_id,
        instrument_id=asset_id,
        suitability_score=score,
        all_gates_result=gates,
        investment_authorized=investment_authorized,
        authorized_at=now if investment_authorized else None,
        expires_at=expiry if investment_authorized else None,
        denial_reasons=denial_reasons,
    )
    db.add(assessment)

    # ── Persist Per-Factor Explainability ──────────────────────────────────────
    for f in factors:
        factor_record = SuitabilityFactor(
            assessment_id=authorization_id,
            factor_name=f["factor"],
            user_value=f["user_value"],
            product_value=f["product_value"],
            matched=f["matched"],
            result_tag=f["result_tag"],
            points_awarded=f["points"],
        )
        db.add(factor_record)

    db.commit()

    # ── Emit Audit Event ───────────────────────────────────────────────────────
    event_type = "INVESTMENT_AUTHORIZED" if investment_authorized else "INVESTMENT_DENIED"
    publish_event(
        event_type, user_id, "investment_gateway",
        {
            "authorization_id": authorization_id,
            "asset_id": asset_id,
            "suitability_score": score,
            "all_gates_pass": investment_authorized,
            "denial_count": len(denial_reasons),
            "denial_reasons": denial_reasons,
        },
        severity="HIGH",
        session_id=session_id,
    )

    return {
        "authorization_id": authorization_id,
        "user_id": user_id,
        "asset_id": asset_id,
        "asset_name": instrument.get("name", asset_id),
        "timestamp": now.isoformat() + "Z",
        "gates": gates,
        "explainability_factors": [
            {
                "factor": f["factor"],
                "your_profile": f["user_value"],
                "product_param": f["product_value"],
                "matched": f["matched"],
                "result_tag": f["result_tag"],
            }
            for f in factors
        ],
        "investment_authorized": investment_authorized,
        "authorization_expiry": expiry.isoformat() + "Z" if investment_authorized else None,
        "denial_reasons": denial_reasons,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# SUITABILITY SCORING ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

def _compute_suitability_score(investor_profile: dict, instrument: dict):
    """
    Multi-factor suitability scoring — mirrors getExplainabilityMatrix() in margData.ts.
    5 factors × 20 points each = 100 maximum.
    Returns (total_score: int, factors: list[dict]).
    """
    total = 0
    factors = []

    user_risk = investor_profile.get("risk_profile", "Conservative")
    product_risk = instrument.get("risk_level", "VeryHigh")
    compatible = product_risk in RISK_COMPATIBILITY.get(user_risk, [])
    pts = 20 if compatible else 0
    total += pts
    factors.append({
        "factor": "Risk Alignment",
        "user_value": user_risk,
        "product_value": product_risk,
        "matched": compatible,
        "result_tag": "✅ Risk Profile Aligned" if compatible else "❌ Product Too Risky",
        "points": pts,
    })

    # Factor 2: Investment Horizon
    user_horizon = investor_profile.get("investment_horizon", "< 1 year")
    product_horizon = instrument.get("horizon_req", "10+ years")
    horizon_pts = _score_horizon(user_horizon, product_horizon)
    horizon_match = horizon_pts == 20
    total += horizon_pts
    factors.append({
        "factor": "Investment Horizon",
        "user_value": user_horizon,
        "product_value": product_horizon,
        "matched": horizon_match,
        "result_tag": "✅ Horizon Compatible" if horizon_match else "⚠️ Short Horizon for This Product",
        "points": horizon_pts,
    })

    # Factor 3: Goal Alignment
    user_goal = investor_profile.get("primary_goal", "Other")
    product_class = instrument.get("asset_class", "")
    goal_assets = GOAL_ASSET_MAP.get(user_goal, [])
    goal_match = product_class in goal_assets
    goal_pts = 20 if goal_match else 0
    total += goal_pts
    factors.append({
        "factor": "Goal Alignment",
        "user_value": user_goal,
        "product_value": product_class,
        "matched": goal_match,
        "result_tag": "✅ Goal-Product Aligned" if goal_match else "❌ Product Does Not Serve Your Goal",
        "points": goal_pts,
    })

    # Factor 4: Liquidity Compatibility
    user_liquidity = investor_profile.get("liquidity_need", "High")
    product_liquidity = instrument.get("liquidity_level", "Low")
    liquidity_ok = LIQUIDITY_RANK.get(product_liquidity, 1) >= LIQUIDITY_RANK.get(user_liquidity, 2)
    liq_pts = 20 if liquidity_ok else 0
    total += liq_pts
    factors.append({
        "factor": "Liquidity Compatibility",
        "user_value": f"{user_liquidity} liquidity need",
        "product_value": f"{product_liquidity} liquidity",
        "matched": liquidity_ok,
        "result_tag": "✅ Liquidity Compatible" if liquidity_ok else "❌ Insufficient Liquidity for Your Needs",
        "points": liq_pts,
    })

    # Factor 5: Portfolio Diversification Benefit
    equity_pct = float(investor_profile.get("equity_pct", 50))
    div_pts, div_match = _score_diversification(equity_pct, product_class)
    total += div_pts
    factors.append({
        "factor": "Portfolio Diversification",
        "user_value": f"Equity {equity_pct:.0f}%",
        "product_value": product_class,
        "matched": div_match,
        "result_tag": "✅ Adds Diversification" if div_match else "⚠️ Adds Concentration",
        "points": div_pts,
    })

    return min(total, 100), factors


def _score_horizon(user_horizon: str, product_horizon_req: str) -> int:
    """Returns 0 or 20 based on whether user horizon meets product requirement."""
    HORIZON_YEARS = {
        "< 1 year": 0.5, "1–3 years": 2, "3–5 years": 4,
        "5–10 years": 7, "10+ years": 12,
    }
    user_years = next(
        (v for k, v in HORIZON_YEARS.items() if k in user_horizon or user_horizon in k), 1
    )
    req_str = product_horizon_req.replace("+", "").replace(" years", "").strip()
    try:
        req_years = float(req_str.split("–")[0])
        return 20 if user_years >= req_years else 0
    except (ValueError, IndexError):
        return 10  # Partial credit if unparsable


def _score_diversification(equity_pct: float, product_class: str) -> tuple:
    """Returns (points, is_diversifying)."""
    if product_class == "Equity" and equity_pct < 40:
        return 20, True   # Increases underweight equity
    if product_class != "Equity" and equity_pct > 60:
        return 20, True   # Reduces heavy equity concentration
    return 10, False      # Neutral
