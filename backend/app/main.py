"""
Dhan Sarthi — Main FastAPI Application
Registers all API routers and initializes SQLAlchemy DB tables on startup.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.core.database import Base, engine

# Import routers
from app.api.v1 import (
    auth,
    dpi_mock,
    ai_features,
    consent,
    gateway,
    risk_profile,
    orders,
    portfolio,
    audit_api,
)

# Auto-create all SQLAlchemy tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dhan Sarthi API",
    description="Unified Backend API for Dhan Sarthi Multi-Asset Investing Super App (SEBI Hackathon)",
    version="2.1.0",
)

# Enable CORS for mobile app & local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(dpi_mock.router)
app.include_router(ai_features.router)
app.include_router(consent.router)
app.include_router(gateway.router)
app.include_router(risk_profile.router)
app.include_router(orders.router)
app.include_router(portfolio.router)
app.include_router(audit_api.router)


@app.get("/")
def read_root():
    return {
        "status": "ok",
        "app": "Dhan Sarthi API",
        "version": "2.1.0",
        "message": "SEBI-Aligned Safety & Decision Super App Backend is running.",
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite_connected",
        "audit_bus": "in-memory_active",
        "version": "2.1.0",
    }
