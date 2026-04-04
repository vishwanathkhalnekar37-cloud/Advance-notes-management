"""Service layer for note operations"""
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Note
from app.schemas import NoteCreate, NoteUpdate
from app.utils.code_detector import detect_code_type, auto_format_content
from app.utils.share import generate_share_token
from app.utils.security import hash_pin, verify_pin
from fastapi import HTTPException
from typing import List, Optional
from datetime import datetime


class NoteService:
    """Business logic for note operations"""
    
    @staticmethod
    def _populate_content_field(note: Note) -> Note:
        """Populate the legacy 'content' field based on content_type and mode-specific fields"""
        if note.content_type == "text":
            note.content = note.content_text or ""
        elif note.content_type == "code":
            note.content = note.content_code or ""
        elif note.content_type == "json":
            note.content = note.content_json or ""
        else:
            note.content = note.content_text or ""
        return note
    
    @staticmethod
    def create_note(db: Session, owner_id: int, note_create: NoteCreate) -> Note:
        """Create a new note"""
        content_type = note_create.content_type
        
        # Detect code type from current mode content
        current_content = note_create.content or ""
        has_code, code_language = detect_code_type(current_content)
        
        # Auto-format  if needed
        if note_create.content:
            formatted_content = auto_format_content(note_create.content, content_type)
        else:
            formatted_content = ""
        
        if has_code and content_type == "text":
            content_type = "code"
        
        # Create note with mode-specific content
        db_note = Note(
            owner_id=owner_id,
            title=note_create.title,
            content=None,  # Keep legacy field empty
            content_type=content_type,
            tags=note_create.tags or [],
            color=note_create.color or "#3b82f6",
            has_code=has_code,
            code_language=code_language
        )
        
        # Save to the appropriate mode-specific fields
        if note_create.content_text:
            db_note.content_text = note_create.content_text
        if note_create.content_code:
            db_note.content_code = note_create.content_code
        if note_create.content_json:
            db_note.content_json = note_create.content_json
        
        # Also save the current mode content (from 'content' parameter)
        if content_type == "text":
            db_note.content_text = formatted_content
        elif content_type == "code":
            db_note.content_code = formatted_content
        elif content_type == "json":
            db_note.content_json = formatted_content
        
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        return NoteService._populate_content_field(db_note)
    
    @staticmethod
    def get_note(db: Session, note_id: int, owner_id: Optional[int] = None) -> Note:
        """Get a note by ID"""
        query = db.query(Note).filter(Note.id == note_id)
        
        if owner_id:
            query = query.filter(Note.owner_id == owner_id)
        
        note = query.first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        
        return NoteService._populate_content_field(note)
    
    @staticmethod
    def get_shared_note(db: Session, share_token: str) -> Note:
        """Get a shared note by its share token"""
        note = db.query(Note).filter(
            (Note.share_token == share_token) & (Note.is_shared == True)
        ).first()
        
        if not note:
            raise HTTPException(status_code=404, detail="Shared note not found")
        
        # Update view count and last viewed
        note.view_count += 1
        note.last_viewed = datetime.utcnow()
        db.commit()
        db.refresh(note)
        
        return NoteService._populate_content_field(note)
    
    @staticmethod
    def get_user_notes(db: Session, owner_id: int, skip: int = 0, limit: int = 20) -> List[Note]:
        """Get all notes for a user with pagination"""
        return db.query(Note).filter(
            Note.owner_id == owner_id
        ).order_by(desc(Note.updated_at)).offset(skip).limit(limit).all()
    
    @staticmethod
    def search_notes(db: Session, owner_id: int, query: str, skip: int = 0, limit: int = 20) -> List[Note]:
        """Search notes by title or content"""
        search_term = f"%{query}%"
        return db.query(Note).filter(
            (Note.owner_id == owner_id) & 
            ((Note.title.ilike(search_term)) | (Note.content.ilike(search_term)))
        ).order_by(desc(Note.updated_at)).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_recent_notes(db: Session, owner_id: int, limit: int = 5) -> List[Note]:
        """Get recently viewed notes"""
        return db.query(Note).filter(
            (Note.owner_id == owner_id) & (Note.last_viewed.isnot(None))
        ).order_by(desc(Note.last_viewed)).limit(limit).all()
    
    @staticmethod
    def update_note(db: Session, note_id: int, owner_id: int, note_update: NoteUpdate) -> Note:
        """Update a note"""
        note = NoteService.get_note(db, note_id, owner_id)
        
        update_data = note_update.dict(exclude_unset=True)
        
        # Handle mode-specific content updates (if sent explicitly)
        if "content_text" in update_data:
            note.content_text = update_data["content_text"]
            del update_data["content_text"]
        
        if "content_code" in update_data:
            note.content_code = update_data["content_code"]
            del update_data["content_code"]
        
        if "content_json" in update_data:
            note.content_json = update_data["content_json"]
            del update_data["content_json"]
        
        # Handle content updates (for backward compatibility and current mode)
        if "content" in update_data:
            content = update_data["content"]
            has_code, code_language = detect_code_type(content)
            update_data["has_code"] = has_code
            update_data["code_language"] = code_language
            
            # Auto-format
            content_type = update_data.get("content_type", note.content_type)
            formatted_content = auto_format_content(content, content_type)
            
            # Remove 'content' from update_data - we'll handle it separately by mode
            del update_data["content"]
            
            # Save to the appropriate mode-specific field based on content_type
            if content_type == "text":
                note.content_text = formatted_content
            elif content_type == "code":
                note.content_code = formatted_content
            elif content_type == "json":
                note.content_json = formatted_content
        
        for field, value in update_data.items():
            setattr(note, field, value)
        
        db.commit()
        db.refresh(note)
        return NoteService._populate_content_field(note)
    
    @staticmethod
    def delete_note(db: Session, note_id: int, owner_id: int) -> bool:
        """Delete a note"""
        note = NoteService.get_note(db, note_id, owner_id)
        db.delete(note)
        db.commit()
        return True
    
    @staticmethod
    def lock_note(db: Session, note_id: int, owner_id: int, pin: str) -> Note:
        """Lock a note with a PIN"""
        note = NoteService.get_note(db, note_id, owner_id)
        note.is_locked = True
        note.lock_pin = hash_pin(pin)
        db.commit()
        db.refresh(note)
        return note
    
    @staticmethod
    def unlock_note(db: Session, note_id: int, owner_id: int, pin: str) -> bool:
        """Unlock a note with a PIN"""
        note = NoteService.get_note(db, note_id, owner_id)
        
        if not note.is_locked:
            raise HTTPException(status_code=400, detail="Note is not locked")
        
        if not verify_pin(pin, note.lock_pin):
            raise HTTPException(status_code=401, detail="Invalid PIN")
        
        note.is_locked = False
        note.lock_pin = None
        db.commit()
        db.refresh(note)
        return True
    
    @staticmethod
    def verify_note_pin(db: Session, note_id: int, owner_id: int, pin: str) -> bool:
        """Verify a note's PIN without changing its locked state"""
        note = NoteService.get_note(db, note_id, owner_id)
        
        if not note.is_locked:
            raise HTTPException(status_code=400, detail="Note is not locked")
        
        if not verify_pin(pin, note.lock_pin):
            raise HTTPException(status_code=401, detail="Invalid PIN")
        
        return True
    
    @staticmethod
    def share_note(db: Session, note_id: int, owner_id: int, is_public: bool = False) -> Note:
        """Generate a shareable link for a note"""
        note = NoteService.get_note(db, note_id, owner_id)
        
        if not note.share_token:
            note.share_token = generate_share_token()
        
        note.is_shared = True
        note.is_public = is_public
        db.commit()
        db.refresh(note)
        return note
    
    @staticmethod
    def unshare_note(db: Session, note_id: int, owner_id: int) -> Note:
        """Remove shareable link from a note"""
        note = NoteService.get_note(db, note_id, owner_id)
        note.is_shared = False
        note.is_public = False
        note.share_token = None
        note.view_count = 0
        db.commit()
        db.refresh(note)
        return note
    
    @staticmethod
    def filter_by_tags(db: Session, owner_id: int, tags: List[str], skip: int = 0, limit: int = 20) -> List[Note]:
        """Filter notes by tags"""
        # SQLAlchemy JSON filtering
        return db.query(Note).filter(
            Note.owner_id == owner_id
        ).all()  # Will filter in Python for simplicity
