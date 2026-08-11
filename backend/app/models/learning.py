"""
Dhan Sarthi — Learning Models: LearningContent, LearningProgress
TDD Section 12.2 — Learning entities
Mirrors Gyaan module: topics, quizzes, badges, progress tracking.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
try:
    from sqlalchemy import JSON
except ImportError:
    from sqlalchemy.dialects.sqlite import JSON
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class LearningContent(Base):
    """A learning topic/module in Dhan Gyaan."""
    __tablename__ = "learning_content"

    id = Column(String, primary_key=True, default=_uuid)
    topic_id = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    asset_class = Column(String, nullable=True)    # REIT / Bond / MutualFund / Equity / Gold
    language = Column(String, default="English")   # Multi-language support
    analogy_text = Column(String, nullable=True)   # The bite-sized analogy explanation
    quiz = Column(JSON, default=list)              # List of {question, options, correct_index, explanation}
    badge = Column(String, nullable=True)          # "REIT Master", "Bond Specialist", etc.
    estimated_minutes = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.utcnow)

    progress_records = relationship(
        "LearningProgress", back_populates="content", cascade="all, delete-orphan"
    )


class LearningProgress(Base):
    """Tracks a user's progress through a learning topic."""
    __tablename__ = "learning_progress"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    topic_id = Column(String, ForeignKey("learning_content.topic_id"), nullable=False, index=True)
    # Status: NOT_STARTED / IN_PROGRESS / COMPLETED
    status = Column(String, default="NOT_STARTED")
    score = Column(Integer, nullable=True)          # Quiz score 0-100
    completed_at = Column(DateTime, nullable=True)
    coins_earned = Column(Integer, default=0)
    badge_awarded = Column(String, nullable=True)

    user = relationship("User", back_populates="learning_progress")
    content = relationship("LearningContent", back_populates="progress_records")
