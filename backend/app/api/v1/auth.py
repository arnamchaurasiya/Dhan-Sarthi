from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token
from app.core.audit import publish_event
from app.models.user import User, KYCRecord
from datetime import datetime

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

class LoginRequest(BaseModel):
    phone_number: str
    otp: str

class EkycRequest(BaseModel):
    pan_number: str
    aadhaar_number: str
    user_id: str = "demo_user"

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    if request.otp != "1234":
        publish_event(
            "AUTH_FAILED", request.phone_number, "auth_service",
            {"phone": request.phone_number, "reason": "invalid_otp"},
            severity="HIGH"
        )
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Upsert user record
    user = db.query(User).filter(User.phone == request.phone_number).first()
    if not user:
        user = User(phone=request.phone_number, name="Priya Sharma")
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"user_id": user.id, "phone": request.phone_number})

    publish_event(
        "AUTH_LOGIN", user.id, "auth_service",
        {"phone": request.phone_number, "user_id": user.id},
        severity="MEDIUM"
    )

    return {
        "token": token,
        "user": {
            "id": user.id,
            "phone": request.phone_number,
            "name": user.name or "Priya Sharma",
        }
    }

@router.post("/ekyc")
def verify_ekyc(request: EkycRequest, db: Session = Depends(get_db)):
    if not request.pan_number or not request.aadhaar_number:
        publish_event(
            "KYC_FAILED", request.user_id, "auth_service",
            {"reason": "missing_pan_or_aadhaar"},
            severity="HIGH"
        )
        raise HTTPException(status_code=400, detail="PAN and Aadhaar required")

    # Upsert KYC record
    kyc = db.query(KYCRecord).filter(KYCRecord.user_id == request.user_id).first()
    now = datetime.utcnow()
    if not kyc:
        kyc = KYCRecord(
            user_id=request.user_id,
            kyc_type="DIGILOCKER",
            status="COMPLETED",
            pan_number=request.pan_number,
            kyc_ref_id="KRA-DL-84920",
            verified_at=now
        )
        db.add(kyc)
    else:
        kyc.status = "COMPLETED"
        kyc.pan_number = request.pan_number
        kyc.verified_at = now

    db.commit()

    publish_event(
        "KYC_COMPLETED", request.user_id, "auth_service",
        {"kyc_type": "DIGILOCKER", "pan_masked": f"XXXXX{request.pan_number[-4:]}" if len(request.pan_number) >= 4 else "PAN"},
        severity="HIGH"
    )

    return {
        "status": "success",
        "verified": True,
        "name": "Priya Sharma",
        "kyc_status": "KRA_VERIFIED",
        "message": "Identity successfully verified via DigiLocker."
    }
