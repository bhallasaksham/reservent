import json
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
        return await facade(url='http://127.0.0.1:8000/rooms/available', http_verb='GET', request=request)
    except HTTPException as e:
        return {"message": e.detail}


@facadeRoutes.post("/rooms/reserve")
async def reserve_room(request: Request):
    data = await request.json()
    try:
        event =  await facade(url="http://127.0.0.1:8080/events", http_verb='POST', headers = request.headers, params = data)
        if event.body is not None:
            roomReservationResponse = await facade(url="http://127.0.0.1:8000/rooms/reserve", http_verb='POST',  headers = request.headers, body=event.body)
            if roomReservationResponse is not None:
                return await facade(url="http://127.0.0.1:8080/events/finalize", http_verb='PUT',  headers = request.headers, body=event.body)

    except HTTPException as e:
        return {"message": e.detail}

