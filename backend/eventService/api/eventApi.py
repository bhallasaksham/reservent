from typing import Optional

from fastapi import APIRouter

from eventService.handler.eventHandler import EventHandler
from pydantic import BaseModel
from starlette.responses import JSONResponse

eventRoutes = APIRouter()

class CreateEventRequest(BaseModel):
    email: str
    start_time: str
    end_time: str
    title: str
    description: Optional[str] = None
    guests: Optional[str] = None
    room: str
    isStudent: bool

class FinalizeEventRequest(BaseModel):
    event: dict
    google_auth_token: str
    email: str

@eventRoutes.get("/")
async def root():
    return {"message": "Hello World"}

@eventRoutes.post("/events")
async def create_event(request: CreateEventRequest):
    try:
        return JSONResponse(status_code=201, content=EventHandler().create_event(request))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})

@eventRoutes.put("/events/finalize")
async def finalize_event(request: FinalizeEventRequest):
    try:
        EventHandler().finalize_event(request)
        return JSONResponse(status_code=200, content='success')
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})

@eventRoutes.get("/events")
async def get_events():
    try:
        return JSONResponse(status_code=200, content=EventHandler().get_events())
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})