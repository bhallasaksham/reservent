from fastapi import APIRouter

from eventService.handler.eventHandler import EventHandler
from pydantic import BaseModel

eventRoutes = APIRouter()

class CreateEventRequest(BaseModel):
    email: str
    start_time: str
    end_time: str
    title: str
    description: str
    guests: str
    room: str
    isStudent: bool

class FinalizeEventRequest(BaseModel):
    event: str
    google_auth_token: str
    email: str

@eventRoutes.get("/")
async def root():
    return {"message": "Hello World"}

@eventRoutes.post("/events")
async def create_event(request: CreateEventRequest):
    return EventHandler().create_event(request)

@eventRoutes.put("/events/finalize")
async def finalize_event(request: FinalizeEventRequest):
    return EventHandler().finalize_event(request)