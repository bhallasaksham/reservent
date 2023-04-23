from typing import Optional

from fastapi import APIRouter

from eventService.handler.eventHandler import EventHandler
from pydantic import BaseModel
from starlette.responses import JSONResponse

eventRoutes = APIRouter()


class CreateEventRequest(BaseModel):
    email: str
    google_auth_token: str
    privilege: str
    description: Optional[str] = None
    end_time: str
    guests: Optional[str] = None
    room: str
    room_url: str
    start_time: str
    title: str


class FinalizeEventRequest(BaseModel):
    email: str
    google_auth_token: str
    privilege: str
    room: str
    event_id: str  # No need to save this in db, but return to client. Client can use this event id to make delete request


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


@eventRoutes.get("/events/{event_id}")
async def get_event(event_id: str):
    try:
        return JSONResponse(status_code=200, content=EventHandler().get_event_by_id(event_id))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})