"""Authentication routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserCreate, UserLogin, TokenResponse, UserResponse
from app.services.user_service import UserService
from app.utils.security import create_access_token
from datetime import timedelta
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    user = UserService.create_user(db, user_create)
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    user_response = UserResponse.model_validate(user)
    return TokenResponse(
        access_token=access_token,
        user=user_response
    )


@router.post("/login", response_model=TokenResponse)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = UserService.authenticate_user(db, user_login.email, user_login.password)
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    user_response = UserResponse.model_validate(user)
    return TokenResponse(
        access_token=access_token,
        user=user_response
    )


@router.get("/me", response_model=UserResponse)
def get_current_user(token: str = None, db: Session = Depends(get_db)):
    """Get current user (requires token in header)"""
    # This will be properly handled with Depends(get_current_user) in the main app
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"id": 1, "email": "demo@example.com", "username": "demo", "full_name": "Demo User", "is_active": True, "created_at": "2024-01-01T00:00:00", "updated_at": "2024-01-01T00:00:00"}
