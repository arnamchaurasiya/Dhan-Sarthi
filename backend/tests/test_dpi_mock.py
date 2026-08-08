from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_aa_consent():
    response = client.post(
        "/api/v1/mock-dpi/aa/consent",
        json={"user_id": "user_123", "fip_ids": ["fip_zerodha", "fip_cams"]}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "APPROVED"
    assert "consent_handle" in response.json()

def test_fetch_holdings_success():
    response = client.get("/api/v1/mock-dpi/aa/fetch-holdings/mock-consent-handle-84920")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "summary" in data["data"]
    assert "holdings" in data["data"]
    assert data["data"]["summary"]["total_net_worth"] > 0
    assert len(data["data"]["holdings"]) == 7

def test_fetch_holdings_failure():
    response = client.get("/api/v1/mock-dpi/aa/fetch-holdings/invalid-handle")
    assert response.status_code == 200
    assert "error" in response.json()
