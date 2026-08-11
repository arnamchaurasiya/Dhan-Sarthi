from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_consent_lifecycle():
    user_id = "test_user_consent_1"

    # 1. View initially (no consent)
    res = client.get(f"/api/v1/consent/view/{user_id}")
    assert res.status_code == 200
    assert res.json()["status"] == "NO_ACTIVE_CONSENT"

    # 2. Grant consent
    res = client.post("/api/v1/consent/grant", json={"user_id": user_id, "fip_ids": ["zerodha_cdsl"]})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ACTIVE"
    consent_id = data["consent_id"]

    # 3. View active consent
    res = client.get(f"/api/v1/consent/view/{user_id}")
    assert res.status_code == 200
    assert res.json()["status"] == "ACTIVE"
    assert res.json()["consent_id"] == consent_id

    # 4. Renew consent
    res = client.post(f"/api/v1/consent/renew/{consent_id}?user_id={user_id}")
    assert res.status_code == 200
    assert res.json()["status"] == "RENEWED"

    # 5. Revoke consent
    res = client.post(f"/api/v1/consent/revoke/{consent_id}", json={"user_id": user_id, "reason": "user_cancelled"})
    assert res.status_code == 200
    assert res.json()["status"] == "REVOKED"

    # 6. View history
    res = client.get(f"/api/v1/consent/history/{user_id}")
    assert res.status_code == 200
    assert len(res.json()["consent_records"]) >= 1
    assert len(res.json()["audit_events"]) >= 3
