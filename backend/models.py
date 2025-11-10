# backend/models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from database import Base


class MessageType(str, PyEnum):
    TEXT = "text"
    VOICE = "voice"


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)  # text message body or voice transcript
    message_type = Column(Enum(MessageType), nullable=False, default=MessageType.TEXT)
    scheduled_date = Column(DateTime(timezone=True), nullable=True)
    user_id = Column(Integer, nullable=False)  # placeholder until auth is built
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())