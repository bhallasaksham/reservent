from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from roomReservationService.handler import GetRoomsHandler, ReserveRoomHandler

roomRoutes = APIRouter()


class Event(BaseModel):
    summary: str
    description: str
    start: dict
    end: dict
    attendees: list
    visibility: str


class Reservation(BaseModel):
    email: str
    google_auth_token: str
    event: Event


class Request(BaseModel):
    email: str
    google_auth_token: str
    start_time: str
    end_time: str
    num_guests: Optional[str] = 1


@roomRoutes.get("/")
async def root():
    return {"message": "Hello World"}


@roomRoutes.get("/rooms/available")
async def get_available_rooms(request: Request):
    handler = GetRoomsHandler(request)
    return handler.get_rooms()


@roomRoutes.post("/rooms/reserve")
async def reserve_room(reservation: Reservation):
    handler = ReserveRoomHandler(reservation)
    return handler.create_event()



