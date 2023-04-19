from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from roomReservationService.handler import GetRoomsHandler, ReserveRoomHandler

roomRoutes = APIRouter()


class Reservation(BaseModel):
    email: str
    google_auth_token: str
    creator: str
    summary: str
    description: str
    start: dict
    end: dict
    # event_description: Optional[str] = None
    # room_name: Optional[str] = None
    guest_email: Optional[str] = None


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
    return handler.get_available_rooms()


@roomRoutes.post("/rooms/reserve")
async def reserve_room(reservation: Reservation):
    print(reservation)
    handler = ReserveRoomHandler(reservation)
    try:
        response = handler.create_event()
        return response
    except Exception as e:
        return {"message": str(e)}


