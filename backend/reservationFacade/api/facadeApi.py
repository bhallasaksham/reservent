import json
import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request

from reservationFacade.handler.facadeHandler import facade

facadeRoutes = APIRouter()

load_dotenv(os.getcwd() + '/config/.env')

'''
Endpoint to get available rooms from the Room Reservation service.

This asynchronous function is a GET request handler for the '/rooms/available' route, 
acting as a Facade pattern to forward the request to the Room Reservation service. 

It retrieves the required service's host and port from environment variables and constructs the target URL. 
The function then sends the request with the same headers and query parameters received, and returns the response. 

If there's an HTTP exception, the error message will be returned in a JSON object.
'''


@facadeRoutes.get("/rooms/available")
async def get_available_rooms(request: Request):
    try:
        return await facade(url='http://' + os.getenv("LOCAL_HOST") + ':' + os.getenv("ROOM_RESERVATION_SERVICE_PORT") +
                                '/rooms/available', http_verb='GET', headers=request.headers,
                            params=request.query_params)
    except HTTPException as e:
        return {"message": e.detail}


'''
Endpoint to reserve a room and create an event in the Event Service.

This asynchronous function is a POST request handler for the '/rooms/reserve' route. 
It receives a JSON payload containing reservation details and first tries to create an event in the Event Service. 

If the event is successfully created (status code 201), it proceeds to reserve the room in the Room Reservation service. 
If the room is successfully reserved (status code 201), it finalizes the event by updating it with the reserved room 
name in the Event Service. 

If an HTTP exception occurs at any stage, the error message will be returned in a JSON object.

'''


@facadeRoutes.post("/rooms/reserve")
async def reserve_room(request: Request):
    data = await request.json()
    try:
        event = await facade(url='http://' + os.getenv("LOCAL_HOST") + ':' + os.getenv("EVENT_SERVICE_PORT") +
                                 '/events',
                             http_verb='POST', headers=request.headers, params=data)

        if event.status_code == 201:
            reserved = await facade(url='http://' + os.getenv("LOCAL_HOST") + ':' + os.getenv("ROOM_RESERVATION_SERVICE_PORT")
                                        + '/rooms/reserve', http_verb='POST',
                                    headers=request.headers, body=event.body)
            if reserved.status_code == 201:
                body = json.loads(reserved.body)
                params = {'room': data["room"], 'event_id': body['event_id']}
                finalized = await facade(url='http://' + os.getenv("LOCAL_HOST") + ':' + os.getenv("EVENT_SERVICE_PORT")
                                             + '/events/finalize', http_verb='PUT',
                                         headers=request.headers, params=params, body=event.body)
                return finalized
            else:
                return reserved
        else:
            return event
    except HTTPException as e:
        return {"message": e.detail}

'''
Endpoint to retrieve events from the Event Service.

This asynchronous function is a GET request handler for the '/events' route, acting as a Facade pattern to 
forward the request to the Event Service. It retrieves the required service's host and port from environment variables 
and constructs the target URL. The function then sends the request with the same headers received, 
and returns the response containing the events. 

If there's an HTTP exception, the error message will be returned in a JSON object.
'''


@facadeRoutes.get("/events")
async def get_events(request: Request):
    try:
        events = await facade(url='http://' + os.getenv("LOCAL_HOST") + ':' + os.getenv("EVENT_SERVICE_PORT")
                                  + '/events', http_verb='GET', headers=request.headers)
        return events
    except HTTPException as e:
        return {"message": e.detail}

'''
Endpoint to delete an event and its associated reservation.

This asynchronous function is a DELETE request handler for the '/events/{event_id}' route. 
It first retrieves the event with the specified ID from the Event Service. If the event is found (status code 200), 
it proceeds to delete the reservation. Once the reservation is deleted, it deletes the event from the Event Service and 
returns the response. 

If there's an HTTP exception at any stage, the error message will be returned in a JSON object.
'''

@facadeRoutes.delete("/events/{event_id}")
async def delete_event(event_id: str, request: Request):
    try:
            reserved = await facade(url='http://' + os.getenv("LOCAL_HOST") + ':' + os.getenv("ROOM_RESERVATION_SERVICE_PORT")
                                    + '/rooms/reservation/' + event_id, http_verb='DELETE',
                                    headers=request.headers)
            # if reservation deleted:
            if reserved.status_code == 200:
                deleted_event = await facade(url='http://' + os.getenv("LOCAL_HOST") + ':'
                                                 + os.getenv("EVENT_SERVICE_PORT") +'/events/' + event_id,
                                             http_verb='DELETE', headers=request.headers)
                return deleted_event
            return reserved
    except HTTPException as e:
        return {"message": e.detail}
