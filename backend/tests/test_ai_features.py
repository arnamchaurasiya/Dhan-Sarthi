from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ask_gyaan():
    response = client.post(
        "/api/v1/ai/ask-gyaan",
        json={"query": "REITs", "language": "Hindi"}
    )
    assert response.status_code == 200
    assert "REITs" in response.json()["explanation"]
    assert response.json()["badge_awarded"] == "Curious Learner"

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
    assert response.json()["scam_probability"] > 0.8

def test_check_scam_false():
    response = client.post(
        "/api/v1/ai/security/check-scam",
        json={"text": "I am thinking of investing in a mutual fund."}
    )
    assert response.status_code == 200
    assert response.json()["is_scam"] is False

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

