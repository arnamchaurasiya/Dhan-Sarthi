from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ask_gyaan():
    response = client.post(
        "/api/v1/ai/ask-gyaan",
        json={"query": "What is REIT?", "language": "Hindi"}
    )
    assert response.status_code == 200
    assert "REIT" in response.json()["explanation"]
    assert response.json()["language"] == "Hindi"

def test_personalized_path():
    response = client.post(
        "/api/v1/ai/personalized-path",
        json={"user_id": "u1", "age": 25, "monthly_income": 80000, "equity_pct": 80}
    )
    assert response.status_code == 200
    assert response.json()["profile"]["name"] == "Arnam"
    assert len(response.json()["recommended_path"]) == 5

def test_explain_portfolio():
    response = client.post(
        "/api/v1/ai/explain-portfolio",
        json={
            "user_id": "u1",
            "holdings": [
                {"name": "Reliance Industries", "amount": 120000, "category": "Equity"},
                {"name": "HDFC Mutual Fund", "amount": 80000, "category": "Equity"}
            ]
        }
    )
    assert response.status_code == 200
    assert response.json()["portfolio_summary"]["equity_exposure_pct"] == 100.0
    assert "High Concentration Risk" in response.json()["portfolio_summary"]["warning"]

def test_before_you_invest():
    response = client.post(
        "/api/v1/ai/before-you-invest",
        json={"user_id": "u1", "asset_name": "REIT", "asset_category": "Real Estate Investment Trust"}
    )
    assert response.status_code == 200
    assert response.json()["readiness_score"] == 82
    assert len(response.json()["checklist"]) == 4

def test_suitability_suitable():
    response = client.post(
        "/api/v1/ai/invest/suitability",
        json={"user_id": "u1", "asset_id": "REIT1", "risk_score": 80}
    )
    assert response.status_code == 200
    assert response.json()["is_suitable"] is True

def test_suitability_unsuitable():
    response = client.post(
        "/api/v1/ai/invest/suitability",
        json={"user_id": "u1", "asset_id": "F&O", "risk_score": 30}
    )
    assert response.status_code == 200
    assert response.json()["is_suitable"] is False

def test_check_scam_true():
    response = client.post(
        "/api/v1/ai/security/check-scam",
        json={"text": "Get guaranteed returns on this sure shot stock!"}
    )
    assert response.status_code == 200
    assert response.json()["is_scam"] is True
    assert response.json()["rule_based_risk_score"] > 0.0
    assert response.json()["score_basis"] == "keyword_rule_engine"

def test_check_scam_false():
    response = client.post(
        "/api/v1/ai/security/check-scam",
        json={"text": "I am thinking of investing in a mutual fund."}
    )
    assert response.status_code == 200
    assert response.json()["is_scam"] is False
    assert response.json()["rule_based_risk_score"] == 0.0

def test_verify_entity():
    res = client.post("/api/v1/ai/security/verify-entity", json={"name": "Zerodha Broking Ltd."})
    assert res.status_code == 200
    assert res.json()["found"] is True
    assert res.json()["status"] == "Registered"

def test_verify_upi():
    res = client.post("/api/v1/ai/security/verify-upi", json={"upi_id": "zerodha@dfc"})
    assert res.status_code == 200
    assert res.json()["valid"] is True

def test_verify_account():
    res = client.post("/api/v1/ai/security/verify-account", json={"ifsc": "SBIN0001234", "account_number": "99912345678"})
    assert res.status_code == 200
    assert res.json()["valid"] is True
