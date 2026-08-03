from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, dpi_mock, ai_features

app = FastAPI(
    title="Dhan Sarthi API",
    description="Unified API for Dhan Sarthi Multi-Asset Investing Super App",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dpi_mock.router)
app.include_router(ai_features.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Dhan Sarthi API is running"}


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}
