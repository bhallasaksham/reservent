from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from starlette.responses import JSONResponse

from roomReservationService.handler import GetRoomsHandler, ReserveRoomHandler

roomRoutes = APIRouter()


class Event(BaseModel):
    summary: str
    description: str
    start: dict
    end: dict
    guests: list
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
    try:
        handler = GetRoomsHandler(request)
        return JSONResponse(status_code=200, content=handler.get_rooms())
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})


@roomRoutes.post("/rooms/reserve")
async def reserve_room(reservation: Reservation):
    try:
        handler = ReserveRoomHandler(reservation)
        return JSONResponse(status_code=201, content=handler.create_event())
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})



