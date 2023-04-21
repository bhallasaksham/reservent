import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request

from reservationFacade.handler.facadeHandler import facade

facadeRoutes = APIRouter()

load_dotenv(os.getcwd() + '/config/.env')

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
        # if event.status_code == 201:
        #     reserved = await facade(url="http://127.0.0.1:8000/rooms/reserve", http_verb='POST',
        #                             headers=request.headers, body=event.body)
        #     if reserved.status_code == 201:
        room_name = data["room"]
        finalized = await facade(url="http://127.0.0.1:8080/events/finalize", http_verb='PUT',
                                         headers=request.headers, params={"room" : room_name},body=event.body)
        return finalized
    except HTTPException as e:
        return {"message": e.detail}

@facadeRoutes.get("/events")
async def get_events(request: Request):
    try:
        events = await facade(url='http://' + os.getenv("LOCAL_HOST") + ':'+ os.getenv("EVENT_SERVICE_PORT") +'/events', http_verb='GET', headers=request.headers)
        return events
    except HTTPException as e:
        return {"message": e.detail}
