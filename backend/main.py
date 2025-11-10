from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import Base, engine, get_db
from models import Message
from schemas import MessageCreate, MessageUpdate, MessageResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DearFutureMe API", version="1.0.0")

@app.get("/")
async def root():
    """
    Root endpoint - returns API information
    This is the homepage of your API
    """
    return {"message": "DearFutureMe API is running", "version": "1.0.0"}

@app.get("/api/hello")
async def hello():
    """
    Hello endpoint - returns a greeting message
    This is the endpoint your React Native app will call
    """
    return {"message": "Hello from FastAPI backend"}

@app.post("/api/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_message(message: MessageCreate, db: Session = Depends(get_db)):
    # model_dump() converts Pydantic model to dict.
    db_message = Message(**message.model_dump(), user_id=1)  # TODO: replace with authenticated user
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@app.get("/api/messages", response_model=List[MessageResponse])
def list_messages(db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.user_id == 1).order_by(Message.created_at.desc()).all()
    return messages


@app.get("/api/messages/{message_id}", response_model=MessageResponse)
def get_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id, Message.user_id == 1).first()
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)