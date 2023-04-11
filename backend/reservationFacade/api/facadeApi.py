from typing import Optional
from fastapi import APIRouter, Response, HTTPException, Header, Cookie, Request, Body

from reservationFacade.handler.facadeHandler import facade

facadeRoutes = APIRouter()


@facadeRoutes.get("/")
async def root():
    return {"message": "Hello World"}


@facadeRoutes.get("/rooms/available")
async def get_available_rooms(request: Request):
    try:
        return facade(url='http://127.0.0.1:8000/rooms/available', http_verb='GET', request=request)
    except HTTPException as e:
        return {"message": e.detail}


@facadeRoutes.post("/rooms/:room/reserve")
async def reserve_room(request: Request):
    try:
        createEventResponse = facade(url="http://127.0.0.1:8080/events/create", http_verb='POST', request=request)
        if createEventResponse is not None:
            roomReservationResponse = facade(url="http://127.0.0.1:8000/rooms/reserve", http_verb='POST',  request=request)
            if roomReservationResponse is not None:
                return facade(url="http://127.0.0.1:8080/events/finalize", http_verb='PUT',  request=request);
    except HTTPException as e:
        return {"message": e.detail}

