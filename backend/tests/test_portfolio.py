from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_portfolio_analysis():
    res = client.post("/api/v1/portfolio/analyze", json={
        "user_id": "u1",
        "holdings": [
            {"name": "TCS", "asset_class": "Equity", "amount": 500000.0},
            {"name": "Bond", "asset_class": "Fixed Income", "amount": 100000.0}
        ],
        "investor_profile": {
            "risk_profile": "Conservative",
            "primary_goal": "Regular Income",
            "investment_horizon": "1–3 years"
        }
    })

    assert res.status_code == 200
    data = res.json()
    assert data["total_portfolio_value"] == 600000.0
    assert len(data["insights"]) >= 1
    assert data["overall_health"] in ["WARNING", "NEEDS_ATTENTION"]

def test_portfolio_impact_calculator():
    res = client.post("/api/v1/portfolio/impact", json={
        "user_id": "u1",
        "current_portfolio_value": 793450.0,
        "current_asset_pcts": {"Equity": 55.0, "REITs": 3.0, "Debt": 42.0},
        "invest_amount": 50000.0,
        "invest_asset_class": "REITs"
    })

    assert res.status_code == 200
    data = res.json()
    assert data["old_total_value"] == 793450.0
    assert data["new_total_value"] == 843450.0
    assert data["new_asset_pct"] > data["old_asset_pct"]
    assert "Investing ₹50,000" in data["impact_summary"]
