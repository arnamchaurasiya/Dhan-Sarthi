from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

class LoginRequest(BaseModel):
    phone_number: str
    otp: str

class EkycRequest(BaseModel):
    pan_number: str
    aadhaar_number: str

@router.post("/login")
def login(request: LoginRequest):
    if request.otp != "1234":
        raise HTTPException(status_code=400, detail="Invalid OTP")
    return {"token": "mock-jwt-token-for-hackathon", "user": {"id": 1, "phone": request.phone_number}}

@router.post("/ekyc")
def verify_ekyc(request: EkycRequest):
    if not request.pan_number or not request.aadhaar_number:
        raise HTTPException(status_code=400, detail="PAN and Aadhaar required")
    
    # Mocking eKYC verification success
    return {
        "status": "success",
        "verified": True,
        "name": "Priya Sharma",
        "kyc_status": "KRA_VERIFIED",
        "message": "Identity successfully verified via DigiLocker."
    }
