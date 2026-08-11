"""
Dhan Sarthi — Portfolio Intelligence Engine
TDD Section 11 — Portfolio Intelligence Engine

Provides:
  1. Personalized Portfolio Risk Analysis (no universal thresholds — customized to investor's risk profile)
  2. Portfolio Impact Calculator (computes exact post-investment allocation changes)
"""
from typing import List, Dict, Any

# Personalized concentration thresholds based on investor risk profile
RISK_CONCENTRATION_THRESHOLDS: Dict[str, Dict[str, float]] = {
    "Conservative": {"single_asset": 10.0, "single_class": 30.0},
    "Moderate":     {"single_asset": 20.0, "single_class": 50.0},
    "Aggressive":   {"single_asset": 35.0, "single_class": 70.0},
}


def analyze_portfolio(
    holdings: List[Dict[str, Any]],
    investor_profile: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Analyze portfolio holdings relative to the investor's personalized profile.

    Args:
        holdings: List of dicts, each with 'asset_class', 'amount', 'name'
        investor_profile: Dict with 'risk_profile', 'primary_goal', 'investment_horizon'

    Returns:
        Analysis summary with total value, class breakdown, personalized insights, and health status.
    """
    total_val = sum(float(h.get("amount", 0)) for h in holdings)
    if total_val == 0:
        return {
            "total_portfolio_value": 0.0,
            "asset_allocation": {},
            "insights": [],
            "overall_health": "EMPTY",
        }

    user_risk = investor_profile.get("risk_profile", "Moderate")
    thresholds = RISK_CONCENTRATION_THRESHOLDS.get(user_risk, RISK_CONCENTRATION_THRESHOLDS["Moderate"])

    # Aggregate by asset class
    class_totals: Dict[str, float] = {}
    for h in holdings:
        cls = h.get("asset_class", "Other")
        class_totals[cls] = class_totals.get(cls, 0.0) + float(h.get("amount", 0))

    class_pcts = {cls: round(amt / total_val * 100, 1) for cls, amt in class_totals.items()}

    insights = []
    max_severity = "LOW"

    # Check class concentration against user's profile threshold
    for cls, pct in class_pcts.items():
        if pct > thresholds["single_class"]:
            sev = "HIGH" if pct > thresholds["single_class"] * 1.3 else "MEDIUM"
            if sev == "HIGH" or (sev == "MEDIUM" and max_severity == "LOW"):
                max_severity = sev

            insights.append({
                "type": "CONCENTRATION_RISK",
                "severity": sev,
                "asset_class": cls,
                "current_pct": pct,
                "threshold_pct": thresholds["single_class"],
                "message": (
                    f"Your {cls} allocation is {pct}%, exceeding the {thresholds['single_class']:.0f}% "
                    f"guideline for a {user_risk} investor profile."
                ),
            })

    # Check goal alignment
    goal = investor_profile.get("primary_goal", "Wealth Creation")
    equity_pct = class_pcts.get("Equity", 0.0) + class_pcts.get("Mutual Funds", 0.0) + class_pcts.get("MutualFund", 0.0)

    if goal == "Regular Income" and equity_pct > 50:
        insights.append({
            "type": "GOAL_MISMATCH",
            "severity": "MEDIUM",
            "message": (
                f"Your primary goal is 'Regular Income', but {equity_pct:.1f}% of your portfolio "
                "is in equity growth assets. Adding fixed income, bonds or REITs may better align with your income target."
            ),
        })

    health = "EXCELLENT"
    if max_severity == "MEDIUM":
        health = "WARNING"
    elif max_severity == "HIGH":
        health = "NEEDS_ATTENTION"

    return {
        "total_portfolio_value": round(total_val, 2),
        "asset_allocation": class_pcts,
        "risk_profile_applied": user_risk,
        "applied_thresholds": thresholds,
        "insights": insights,
        "overall_health": health,
    }


def calculate_portfolio_impact(
    current_portfolio_value: float,
    current_asset_pcts: Dict[str, float],
    invest_amount: float,
    invest_asset_class: str,
) -> Dict[str, Any]:
    """
    Compute exact allocation changes after a proposed investment.

    Args:
        current_portfolio_value: Current net worth (e.g. 793450)
        current_asset_pcts: Dict of current percentages {"Equity": 55.0, "REITs": 3.0, ...}
        invest_amount: Proposed investment amount (e.g. 50000)
        invest_asset_class: Asset class being bought (e.g. "REITs")

    Returns:
        Dict with new total value, new asset allocation %, and exact impact summary.
    """
    new_total = current_portfolio_value + invest_amount
    new_pcts = {}

    for cls, pct in current_asset_pcts.items():
        curr_val = current_portfolio_value * (pct / 100.0)
        if cls == invest_asset_class:
            curr_val += invest_amount
        new_pcts[cls] = round(curr_val / new_total * 100, 1)

    if invest_asset_class not in new_pcts:
        new_pcts[invest_asset_class] = round(invest_amount / new_total * 100, 1)

    new_asset_pct = new_pcts.get(invest_asset_class, 0.0)
    old_asset_pct = current_asset_pcts.get(invest_asset_class, 0.0)

    return {
        "old_total_value": current_portfolio_value,
        "new_total_value": round(new_total, 2),
        "invest_amount": invest_amount,
        "invest_asset_class": invest_asset_class,
        "old_allocation": current_asset_pcts,
        "new_allocation": new_pcts,
        "old_asset_pct": old_asset_pct,
        "new_asset_pct": new_asset_pct,
        "impact_summary": (
            f"Investing ₹{invest_amount:,.0f} will change your {invest_asset_class} exposure "
            f"from {old_asset_pct}% to {new_asset_pct}% of total portfolio."
        ),
    }
