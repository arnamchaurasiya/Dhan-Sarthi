from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def test_order_creation_flow_and_idempotency():
    user_id = "order_user_1"

    # Setup eligibility
    client.post("/api/v1/auth/ekyc", json={"pan_number": "ABCDE1234F", "aadhaar_number": "123456789012", "user_id": user_id})
    client.post("/api/v1/consent/grant", json={"user_id": user_id, "fip_ids": ["zerodha_cdsl"]})

    # Authorize investment
    auth_res = client.post("/api/v1/gateway/authorize", json={
        "user_id": user_id,
        "asset_id": "NEXUS_REIT",
        "investor_profile": {
            "risk_profile": "Moderate",
            "investment_horizon": "5–10 years",
            "primary_goal": "Regular Income",
            "liquidity_need": "Medium",
            "equity_pct": 50.0
        },
        "instrument": {
            "risk_level": "Moderate",
            "liquidity_level": "Medium",
            "horizon_req": "5+ years",
            "asset_class": "REIT",
            "name": "Nexus Select REIT"
        },
        "knowledge_score": 85,
        "portfolio_impact": {"new_asset_pct": 12.1},
        "entity_verified": True,
        "scam_scan_clean": True,
        "disclosures_acknowledged": True
    })

    auth_id = auth_res.json()["authorization_id"]
    idempotency_key = f"idem-key-{uuid.uuid4().hex}"

    # Place order with authorization
    order_res = client.post(
        "/api/v1/orders/create",
        json={
            "user_id": user_id,
            "asset_id": "NEXUS_REIT",
            "authorization_id": auth_id,
            "amount": 50000.0,
            "order_type": "BUY"
        },
        headers={"Idempotency-Key": idempotency_key}
    )

    assert order_res.status_code == 200
    data = order_res.json()
    assert data["status"] == "SUBMITTED"
    assert data["duplicate_request"] is False
    order_id = data["order_id"]

    # Re-place order with SAME idempotency key -> should return original without creating new order
    order_res_dup = client.post(
        "/api/v1/orders/create",
        json={
            "user_id": user_id,
            "asset_id": "NEXUS_REIT",
            "authorization_id": auth_id,
            "amount": 50000.0,
            "order_type": "BUY"
        },
        headers={"Idempotency-Key": idempotency_key}
    )

    assert order_res_dup.status_code == 200
    dup_data = order_res_dup.json()
    assert dup_data["order_id"] == order_id
    assert dup_data["duplicate_request"] is True

    # Inspect order history
    get_res = client.get(f"/api/v1/orders/{order_id}")
    assert get_res.status_code == 200
    assert len(get_res.json()["events"]) >= 2

def test_order_creation_unauthorized_fails():
    res = client.post("/api/v1/orders/create", json={
        "user_id": "unauth_user",
        "asset_id": "NEXUS_REIT",
        "authorization_id": "invalid-auth-id",
        "amount": 10000.0
    })
    assert res.status_code == 403
    assert "Investment not authorized" in res.json()["detail"]
