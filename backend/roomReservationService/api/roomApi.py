from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from starlette.responses import JSONResponse

from roomReservationService.handler import GetRoomsHandler, ReserveRoomHandler, GetRoomsDecoratorImpl
from database.schemas.userSchema import UserPrivilege

# Initialize the router
roomRoutes = APIRouter()


'''
This class is a Pydantic model for the request body of the event endpoint.
'''
class Event(BaseModel):
    summary: str
    description: Optional[str] = None
    start: dict
    end: dict
    guests: Optional[list]  =  None
    visibility: str


'''
This class is a Pydantic model for the request body of the reserve room endpoint.
'''
class Reservation(BaseModel):
    email: str
    google_auth_token: str
    privilege: str
    event: Event


'''
This class is a Pydantic model for the request body of the delete room reservation endpoint.
'''
class DeleteRequest(BaseModel):
    email: str
    google_auth_token: str
    privilege: str


'''
This class is a Pydantic model for the request body of the get available rooms endpoint.
'''
class Request(BaseModel):
    email: str
    google_auth_token: str
    privilege: str
    start_time: str
    end_time: str
    num_guests: Optional[str] = 1


@roomRoutes.get("/")
async def root():
    return {"message": "Hello World"}


'''
Endpoint to get all the available rooms for a given time period.
'''
@roomRoutes.get("/rooms/available")
async def get_available_rooms(request: Request):
    try:
        handler = GetRoomsHandler(request)
        # If the user is an admin or staff, then we want to get all the rooms
        # Otherwise, we want to get only the rooms that the user has access to
        # We user decorators to add this functionality
        if int(request.privilege) == UserPrivilege.ADMIN or int(request.privilege) == UserPrivilege.STAFF:
            handler = GetRoomsDecoratorImpl(handler, request)
        return JSONResponse(status_code=200, content=handler.get_rooms())
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})


'''
Endpoint to reserve a room for a given time period.
'''
@roomRoutes.post("/rooms/reserve")
async def reserve_room(reservation: Reservation):
    try:
        handler = ReserveRoomHandler(reservation)
        return JSONResponse(status_code=201, content={"event_id":handler.create_event()})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})


'''
Endpoint to delete a room reservation.
'''
@roomRoutes.delete("/rooms/reservation/{event_id}")
async def delete_room_reservation(delete_request: DeleteRequest, event_id: str):
    try:
        handler = ReserveRoomHandler(reservation=delete_request)
        return JSONResponse(status_code=200, content=handler.delete_event(event_id))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
