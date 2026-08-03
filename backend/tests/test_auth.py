from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_login_success():
    response = client.post(
        "/api/v1/auth/login",
        json={"phone_number": "9876543210", "otp": "1234"}
    )
    assert response.status_code == 200
    assert "token" in response.json()
    assert response.json()["user"]["phone"] == "9876543210"

def test_login_failure():
    response = client.post(
        "/api/v1/auth/login",
        json={"phone_number": "9876543210", "otp": "0000"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid OTP"

def test_ekyc_success():
    response = client.post(
        "/api/v1/auth/ekyc",
        json={"pan_number": "ABCDE1234F", "aadhaar_number": "123456789012"}
    )
    assert response.status_code == 200
    assert response.json()["verified"] is True
    assert response.json()["name"] == "Priya Sharma"
