from typing import Optional

from fastapi import APIRouter, Response
from pydantic import BaseModel

from ..handler.roomHandler import initialize_rooms, get_rooms, AvailableRoom

roomRoutes = APIRouter()


class Reservation(BaseModel):
    email: str
    google_auth_token: str
    start_time: str
    end_time: Optional[str] = None
    num_guests: str


@roomRoutes.get("/")
async def root():
    return {"message": "Hello World"}


@roomRoutes.get("/rooms/available")
async def get_available_rooms(reservation: Reservation):
    meeting_rooms = initialize_rooms()
    return get_rooms(reservation, meeting_rooms)






