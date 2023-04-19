import json
from typing import Optional
from fastapi import APIRouter, Response, HTTPException, Header, Cookie, Request, Body
from starlette.responses import JSONResponse

from reservationFacade.handler.facadeHandler import facade

facadeRoutes = APIRouter()


@facadeRoutes.get("/")
async def root():
    return {"message": "Hello World"}


@facadeRoutes.get("/rooms/available")
async def get_available_rooms(request: Request):
    try:
        rooms = await facade(url='http://127.0.0.1:8000/rooms/available', http_verb='GET', headers=request.headers,
                            params=request.query_params)
        return rooms
    except HTTPException as e:
        return {"message": e.detail}


@facadeRoutes.post("/rooms/reserve")
async def reserve_room(request: Request):
    data = await request.json()
    try:

        event = await facade(url="http://127.0.0.1:8080/events", http_verb='POST', headers=request.headers, params=data)
        if event.status_code == 201:
            reserved = await facade(url="http://127.0.0.1:8000/rooms/reserve", http_verb='POST',
                                    headers=request.headers, body=event.body)
            if reserved.status_code == 201:
                finalized = await facade(url="http://127.0.0.1:8080/events/finalize", http_verb='PUT',
                                         headers=request.headers, body=event.body)
                return finalized
    except HTTPException as e:
        return {"message": e.detail}
