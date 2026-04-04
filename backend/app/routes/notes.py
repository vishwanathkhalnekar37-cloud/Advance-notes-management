"""Notes routes"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import NoteCreate, NoteUpdate, NoteResponse, NoteShare, NoteLock
from app.services.note_service import NoteService
from app.services.user_service import UserService
from app.utils.security import verify_token
from typing import List
from fastapi import Header

router = APIRouter(prefix="/api/notes", tags=["Notes"])


def get_current_user_id(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Extract user ID from JWT token"""
    if not authorization:
        print("❌ No authorization header found")
        raise HTTPException(status_code=401, detail="Not authenticated - missing token")
    
    try:
        # Extract token from "Bearer <token>" format
        if not authorization.startswith("Bearer "):
            print(f"❌ Invalid authorization format: {authorization[:50]}")
            raise HTTPException(status_code=401, detail="Invalid token format - must be 'Bearer <token>'")
        
        token = authorization[7:]  # Remove "Bearer " prefix
        print(f"✅ Token found: {token[:30]}...")
        
        # Verify token
        payload = verify_token(token)
        if not payload:
            print("❌ Token verification failed - invalid or expired")
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        # Get user email from token
        email = payload.get("sub")
        if not email:
            print("❌ Token missing 'sub' claim (email)")
            raise HTTPException(status_code=401, detail="Invalid token - missing email")
        
        # Get user from database
        user = UserService.get_user_by_email(db, email)
        if not user:
            print(f"❌ User not found for email: {email}")
            raise HTTPException(status_code=401, detail="User not found")
        
        print(f"✅ User authenticated: {email} (ID: {user.id})")
        return user.id
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Unexpected error in get_current_user_id: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


@router.post("", response_model=NoteResponse)
def create_note(
    note_create: NoteCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create a new note"""
    try:
        print(f"📝 Creating note for user {user_id}")
        print(f"   Title: {note_create.title[:50]}...")
        note = NoteService.create_note(db, user_id, note_create)
        print(f"✅ Note created successfully: {note.id}")
        return NoteResponse.model_validate(note)
    except Exception as e:
        print(f"❌ Error creating note: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create note: {str(e)}")


@router.get("", response_model=List[NoteResponse])
def get_notes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all notes with pagination"""
    notes = NoteService.get_user_notes(db, user_id, skip, limit)
    return [NoteResponse.model_validate(note) for note in notes]


@router.get("/search", response_model=List[NoteResponse])
def search_notes(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Search notes by title or content"""
    notes = NoteService.search_notes(db, user_id, q, skip, limit)
    return [NoteResponse.model_validate(note) for note in notes]


@router.get("/recent", response_model=List[NoteResponse])
def get_recent_notes(
    limit: int = Query(5, ge=1, le=20),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get recently viewed notes"""
    notes = NoteService.get_recent_notes(db, user_id, limit)
    return [NoteResponse.model_validate(note) for note in notes]


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get a specific note"""
    note = NoteService.get_note(db, note_id, user_id)
    return NoteResponse.model_validate(note)


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note_update: NoteUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update a note"""
    note = NoteService.update_note(db, note_id, user_id, note_update)
    return NoteResponse.model_validate(note)


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Delete a note"""
    NoteService.delete_note(db, note_id, user_id)
    return {"message": "Note deleted successfully"}


# Lock/Unlock endpoints
@router.post("/{note_id}/lock")
def lock_note(
    note_id: int,
    lock_data: NoteLock,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Lock a note with PIN"""
    note = NoteService.lock_note(db, note_id, user_id, lock_data.lock_pin)
    return {"message": "Note locked successfully", "is_locked": note.is_locked}


@router.post("/{note_id}/unlock")
def unlock_note(
    note_id: int,
    lock_data: NoteLock,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Unlock a note with PIN"""
    NoteService.unlock_note(db, note_id, user_id, lock_data.lock_pin)
    return {"message": "Note unlocked successfully"}


@router.post("/{note_id}/verify-pin")
def verify_note_pin(
    note_id: int,
    lock_data: NoteLock,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Verify a note's PIN without unlocking it"""
    NoteService.verify_note_pin(db, note_id, user_id, lock_data.lock_pin)
    return {"message": "PIN verified successfully"}



# Share endpoints
@router.post("/{note_id}/share", response_model=NoteResponse)
def share_note(
    note_id: int,
    share_data: NoteShare,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate a shareable link for a note"""
    note = NoteService.share_note(db, note_id, user_id, share_data.is_public)
    return NoteResponse.model_validate(note)


@router.delete("/{note_id}/share")
def unshare_note(
    note_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Remove shareable link from a note"""
    NoteService.unshare_note(db, note_id, user_id)
    return {"message": "Note unshared successfully"}


# Public shared note endpoint (no authentication required)
@router.get("/shared/{share_token}", response_model=NoteResponse)
def get_shared_note(
    share_token: str,
    db: Session = Depends(get_db)
):
    """Get a publicly shared note"""
    note = NoteService.get_shared_note(db, share_token)
    if note.is_locked:
        raise HTTPException(status_code=403, detail="This note is locked")
    return NoteResponse.model_validate(note)
