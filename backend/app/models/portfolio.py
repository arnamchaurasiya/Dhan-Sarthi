"""
Dhan Sarthi — Portfolio Models: Account, Holding, Transaction, PortfolioSnapshot
TDD Section 12.2 — Portfolio entities
Mirrors darpanData.ts interfaces: Holding, Transaction, ConnectedAccount
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class Account(Base):
    """A broker/FIP account connected via AA for a user."""
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    fip_id = Column(String, ForeignKey("fips.id"), nullable=True)
    broker_name = Column(String, nullable=False)           # "Zerodha", "Groww", etc.
    account_type = Column(String, default="DEMAT")         # DEMAT / MF / BANK
    account_ref = Column(String, nullable=True)            # Masked account identifier
    connected_at = Column(DateTime, default=datetime.utcnow)
    last_synced_at = Column(DateTime, nullable=True)

    holdings = relationship("Holding", back_populates="account", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")


class Holding(Base):
    """A single holding within an account."""
    __tablename__ = "holdings"

    id = Column(String, primary_key=True, default=_uuid)
    account_id = Column(String, ForeignKey("accounts.id"), nullable=False, index=True)
    instrument_id = Column(String, ForeignKey("instruments.id"), nullable=True, index=True)
    symbol = Column(String, nullable=False)                # Denormalized for quick access
    quantity = Column(Float, nullable=False, default=0)
    avg_price = Column(Float, nullable=True)
    current_price = Column(Float, nullable=True)
    total_value = Column(Float, nullable=True)
    stcg_gain = Column(Float, nullable=True)               # Short-term capital gain
    ltcg_gain = Column(Float, nullable=True)               # Long-term capital gain
    asset_class = Column(String, nullable=True)            # Denormalized for analytics
    updated_at = Column(DateTime, default=datetime.utcnow)

    account = relationship("Account", back_populates="holdings")
    instrument = relationship("Instrument", back_populates="holdings")


class Transaction(Base):
    """A single buy/sell/dividend/interest/SIP transaction."""
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=_uuid)
    account_id = Column(String, ForeignKey("accounts.id"), nullable=False, index=True)
    instrument_id = Column(String, ForeignKey("instruments.id"), nullable=True)
    # Type: BUY / SELL / DIVIDEND / INTEREST / SIP
    transaction_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    units = Column(Float, nullable=True)
    price = Column(Float, nullable=True)
    fees = Column(Float, default=0)
    date = Column(Date, nullable=False)
    platform = Column(String, nullable=True)

    account = relationship("Account", back_populates="transactions")


class PortfolioSnapshot(Base):
    """Daily portfolio snapshot for trend analysis."""
    __tablename__ = "portfolio_snapshots"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    total_value = Column(Float, nullable=False)
    equity_pct = Column(Float, default=0)
    debt_pct = Column(Float, default=0)
    reit_pct = Column(Float, default=0)
    gold_pct = Column(Float, default=0)
    cash_pct = Column(Float, default=0)
    mutual_fund_pct = Column(Float, default=0)
    health_score = Column(Float, nullable=True)
    snapshot_date = Column(Date, default=datetime.utcnow)
