"""Note Pydantic schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class NoteCreate(BaseModel):
    """Schema for creating a note"""
    title: str
    content: Optional[str] = None
    content_text: Optional[str] = None
    content_code: Optional[str] = None
    content_json: Optional[str] = None
    tags: Optional[List[str]] = []
    content_type: Optional[str] = "text"  # text, json, code, markdown
    color: Optional[str] = "#3b82f6"  # Color for note background


class NoteUpdate(BaseModel):
    """Schema for updating a note"""
    title: Optional[str] = None
    content: Optional[str] = None
    content_text: Optional[str] = None
    content_code: Optional[str] = None
    content_json: Optional[str] = None
    tags: Optional[List[str]] = None
    content_type: Optional[str] = None
    color: Optional[str] = None


class NoteLock(BaseModel):
    """Schema for locking/unlocking a note"""
    lock_pin: str


class NoteShare(BaseModel):
    """Schema for sharing a note"""
    is_shared: bool
    is_public: bool = False


class NoteResponse(BaseModel):
    """Schema for note response"""
    id: int
    owner_id: int
    title: str
    content: Optional[str] = None  # Legacy field, will be populated based on content_type
    content_text: Optional[str] = None
    content_code: Optional[str] = None
    content_json: Optional[str] = None
    content_type: str
    tags: List[str]
    color: str
    is_locked: bool
    is_shared: bool
    is_public: bool
    has_code: bool
    code_language: Optional[str]
    share_token: Optional[str]
    view_count: int
    created_at: datetime
    updated_at: datetime
    last_viewed: Optional[datetime] = None

    model_config = {"from_attributes": True}


class NoteListResponse(BaseModel):
    """Schema for note list response (minimal data)"""
    id: int
    title: str
    content_type: str
    tags: List[str]
    is_locked: bool
    is_shared: bool
    created_at: datetime
    updated_at: datetime
    view_count: int

    model_config = {"from_attributes": True}
