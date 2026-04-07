"""Note model for storing user notes"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Index, JSON, LargeBinary, TypeDecorator, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Note(Base):
    """Note model for storing notes with all features"""
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(Text, nullable=False)
    # Keep legacy content field for backwards compatibility
    content = Column(Text, nullable=True)
    # Separate content fields for each mode (no DEFAULT allowed on LONGTEXT in MySQL)
    content_text = Column(Text, nullable=True)  # Text mode content
    content_code = Column(Text, nullable=True)  # Code mode content
    content_json = Column(Text, nullable=True)  # JSON mode content
    content_type = Column(String(50), default="text")  # text, json, code, markdown
    tags = Column(JSON, default=[])  # Array of tags as JSON
    color = Column(String(50), default="#3b82f6")  # Color for note background
    
    # Advanced Features
    is_locked = Column(Boolean, default=False)
    lock_pin = Column(String(255), nullable=True)  # Hashed PIN
    
    is_shared = Column(Boolean, default=False)
    share_token = Column(String(100), unique=True, nullable=True)  # Unique share link token
    is_public = Column(Boolean, default=False)  # Public/Private toggle for shared notes
    
    # Auto-formatting / Code detection
    has_code = Column(Boolean, default=False)
    code_language = Column(String(50), nullable=True)  # Detected language
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    view_count = Column(Integer, default=0)
    last_viewed = Column(DateTime, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="notes")

    # Indexes for performance
    __table_args__ = (
        Index('idx_note_owner_id', 'owner_id'),
        Index('idx_note_created_at', 'created_at'),
        Index('idx_note_share_token', 'share_token'),
        Index('idx_note_is_shared', 'is_shared'),
    )

    def get_content_for_mode(self):
        """Get content based on current content_type"""
        if self.content_type == "text":
            return self.content_text or ""
        elif self.content_type == "code":
            return self.content_code or ""
        elif self.content_type == "json":
            return self.content_json or ""
        else:
            return self.content_text or ""

    def __repr__(self):
        return f"<Note(id={self.id}, title={self.title}, owner_id={self.owner_id})>"
