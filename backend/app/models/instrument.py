"""
Dhan Sarthi — Instrument Master & ProductRiskMetrics Models
TDD Section 12.1 — Instrument Master
Canonical reference for all investable products across 8 asset classes.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class Instrument(Base):
    """
    Instrument Master — the canonical reference for all investable products.
    Standardizes ISIN, Asset Class, Issuer, Risk, Liquidity, Maturity, Regulatory Status.
    """
    __tablename__ = "instruments"

    id = Column(String, primary_key=True, default=_uuid)
    isin = Column(String, unique=True, nullable=True, index=True)
    symbol = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    # Asset class: Equity / MutualFund / REIT / InvIT / Bond / Gold / ETCD / Commodity
    asset_class = Column(String, nullable=False, index=True)
    instrument_type = Column(String, nullable=True)      # "REIT", "AAA Corporate Bond", etc.
    issuer = Column(String, nullable=True)
    # Risk level: Low / LowToModerate / Moderate / ModerateToHigh / High / VeryHigh
    risk_level = Column(String, nullable=False, default="Moderate")
    # Liquidity: High / Medium / Low
    liquidity_level = Column(String, default="Medium")
    min_invest = Column(Float, nullable=True)
    expected_yield = Column(String, nullable=True)
    horizon_req = Column(String, nullable=True)           # "5+ years"
    maturity_date = Column(Date, nullable=True)
    regulatory_status = Column(String, nullable=True)     # "SEBI Registered", "Exchange Listed"
    sebi_reg_no = Column(String, nullable=True)
    credit_rating = Column(String, nullable=True)         # AAA / AA / A for bonds
    aum = Column(String, nullable=True)
    last_price = Column(Float, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow)
    gyaan_topic_id = Column(String, nullable=True)        # Links to Gyaan learning content
    is_active = Column(Boolean, default=True)

    risk_metrics = relationship(
        "ProductRiskMetrics", back_populates="instrument", uselist=False, cascade="all, delete-orphan"
    )
    holdings = relationship("Holding", back_populates="instrument")


class ProductRiskMetrics(Base):
    """Quantitative risk metrics for each instrument."""
    __tablename__ = "product_risk_metrics"

    id = Column(String, primary_key=True, default=_uuid)
    instrument_id = Column(String, ForeignKey("instruments.id"), nullable=False, index=True)
    volatility_3y = Column(Float, nullable=True)
    max_drawdown = Column(Float, nullable=True)
    sharpe_ratio = Column(Float, nullable=True)
    beta = Column(Float, nullable=True)
    liquidity_score = Column(Float, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

    instrument = relationship("Instrument", back_populates="risk_metrics")
