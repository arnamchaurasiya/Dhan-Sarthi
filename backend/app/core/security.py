"""
Dhan Sarthi — JWT Security & Authentication Helpers
"""
from datetime import datetime, timedelta
from typing import Optional

try:
    from jose import JWTError, jwt
    JWT_AVAILABLE = True
except ImportError:
    JWT_AVAILABLE = False

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

security_scheme = HTTPBearer(auto_error=False)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    if JWT_AVAILABLE:
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    # Fallback: simple base64 mock token (hackathon only)
    import base64, json
    return base64.b64encode(json.dumps(to_encode).encode()).decode()


def decode_token(token: str) -> dict:
    if JWT_AVAILABLE:
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    import base64, json
    try:
        return json.loads(base64.b64decode(token).decode())
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> dict:
    """
    FastAPI dependency. Returns decoded token payload.
    For hackathon: if no token is provided, returns a demo user to allow unauthenticated testing.
    Production: remove the fallback and enforce authentication.
    """
    if not credentials:
        # Hackathon: allow unauthenticated access for demo
        return {"user_id": "demo_user", "phone": "9999999999", "is_demo": True}
    return decode_token(credentials.credentials)
