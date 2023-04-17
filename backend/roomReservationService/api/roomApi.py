from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from ..handler.roomHandler import initialize_rooms, get_rooms, create_event

roomRoutes = APIRouter()


class Reservation(BaseModel):
    email: str
    google_auth_token: str
    title: str
    start_time: str
    end_time: str
    num_guests: Optional[int] = 1
    event_description: Optional[str] = None
    room_name: Optional[str] = None
    guest_email: Optional[str] = None


class RoomsQuery(BaseModel):
    email: str
    google_auth_token: str
    start_time: str
    end_time: str
    num_guests: str


@roomRoutes.get("/")
async def root():
    return {"message": "Hello World"}


@roomRoutes.get("/rooms/available")
async def get_available_rooms(roomsQuery: RoomsQuery):
    meeting_rooms = initialize_rooms()
    return get_rooms(roomsQuery, meeting_rooms)


@roomRoutes.post("/rooms/{room}/reserve")
async def reserve_room(room: str, reservation: Reservation):
    print(room, reservation)
    reservation.room_name = room
    try:
        response = create_event(reservation, room)
        return response
    except Exception as e:
        return {"message": str(e)}


