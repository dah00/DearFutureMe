from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta

from database import Base, engine, get_db
from models import Message, User
from schemas import (
    MessageCreate, MessageUpdate, MessageResponse,
    UserCreate, UserResponse, Token, TokenData
)
from security import (
    verify_password, get_password_hash,
    create_access_token, decode_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

Base.metadata.create_all(bind=engine)

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

app = FastAPI(title="DearFutureMe API", version="1.0.0")

@app.get("/")
async def root():
    """
    Root endpoint - returns API information
    This is the homepage of your API
    """
    return {"message": "DearFutureMe API is running", "version": "1.0.0"}


# Get current user from token
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency that extracts and verifies JWT token.
    Used in protected routes.
    
    Steps:
    1. Extract token from Authorization header
    2. Decode token
    3. Get user from database
    4. Return user (or raise error if invalid)
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    # Extract user ID from token
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Get user from database
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    
    return user

############################# MESSAGES ############################

@app.post("/api/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    db_message = Message(**message.model_dump(), user_id=current_user.id)  
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@app.get("/api/messages", response_model=List[MessageResponse])
def list_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    messages = db.query(Message).filter(
        Message.user_id == current_user.id  
    ).order_by(Message.created_at.desc()).all()
    return messages


@app.get("/api/messages/{message_id}", response_model=MessageResponse)
def get_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.user_id == current_user.id  
    ).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return message


@app.put("/api/messages/{message_id}", response_model=MessageResponse)
def update_message(message_id: int, update_data: MessageUpdate, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id, Message.user_id == 1).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    # exclude_unset=True during updates avoids overwriting missing fields.
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(message, field, value)

    db.commit()
    db.refresh(message)
    return message


@app.delete("/api/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id, Message.user_id == 1).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    db.delete(message)
    db.commit()
    return None


############################# AUTHENTICATION ############################

# Registration endpoint
@app.post("/api/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and Create user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

     # Create token
    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub": str(db_user.id)}, expires_delta=expires)
    
    return {"access_token": token, "token_type": "bearer"}

# Login endpoint
@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login user and return JWT token.
    
    Steps:
    1. Find user by email
    2. Verify password
    3. Create JWT token
    4. Return token
    """
    # Find user (OAuth2PasswordRequestForm uses 'username' field for email)
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},  # "sub" = subject (user ID)
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# Who I am endpoint
@app.get("/api/auth/me", response_model=UserResponse)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)