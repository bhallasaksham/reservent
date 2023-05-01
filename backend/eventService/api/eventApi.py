from typing import Optional

from fastapi import APIRouter

from eventService.handler.eventHandler import EventHandler
from pydantic import BaseModel
from starlette.responses import JSONResponse

eventRoutes = APIRouter()


'''
This class is a Pydantic model for the request body of the create event endpoint.
'''
class CreateEventRequest(BaseModel):
    email: str
    privilege: str
    start_time: str
    end_time: str
    title: str
    description: Optional[str] = None
    guests: Optional[str] = None
    room: str
    room_url: str


'''
This class is a Pydantic model for the request body of the finalize event endpoint.
'''
class FinalizeEventRequest(BaseModel):
    room: str
    event_id: str
    event: dict
    google_auth_token: str
    email: str
    privilege: str

'''
This class is a Pydantic model for the request body of the get events endpoint.
'''
class GetEventsRequest(BaseModel):
    privilege: str


'''
Endpoint to create an event model using the Builder Pattern.

If there are no errors encountered, it returns the event model that was created, with status code 201.
Otherwise, if there's an HTTP exception, the error message will be returned in a JSON object with status code 500.
'''

@eventRoutes.post("/events")
async def create_event(request: CreateEventRequest):
    try:
        # Return the event model if there are no errors
        return JSONResponse(status_code=201, content=EventHandler().create_event(request))
    except Exception as e:
        print(e)
        # Return error message if there was an error creating the event
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})


'''
Endpoint to finalize an event by sending out the emails to the guests and saving the event in the DB.

If there are no errors encountered, it returns with status code 200 and the success message.
Otherwise, if there's an HTTP exception, the error message will be returned in a JSON object with status code 500.
'''
@eventRoutes.put("/events/finalize")
async def finalize_event(request: FinalizeEventRequest):
    try:
        EventHandler().finalize_event(request)
        return JSONResponse(status_code=200, content='success')
    except Exception as e:
        print(e)
        # Return error message if there was an error finalizing the event
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})


'''
Endpoint to get all the events from the DB based on the privilege

If there are no errors encountered, it returns with status code 200 and the list of events based on the privilege. For students,
it would only return events from other students. For the other privileges, it will return entire list of events from the time 
it was called. If there's an HTTP exception, the error message will be returned in a JSON object with status code 500.
'''
@eventRoutes.get("/events")
async def get_events(request: GetEventsRequest):
    try:
        # Return the list of events based on the privilege
        return JSONResponse(status_code=200, content=EventHandler().get_events(request.privilege))
    except Exception as e:
        print(e)
        # Return error message if there was an error getting the events
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})


'''
Endpoint to delete an event by ID from the DB.

If there are no errors encountered, it returns with status code 200 and the success message.
Otherwise, if there's an HTTP exception, the error message will be returned in a JSON object with status code 500.
'''
@eventRoutes.delete("/events/{event_id}")
async def delete_event(event_id: str):
    try:
        EventHandler().delete_event_by_id(event_id)
        # Return success message if the event was deleted successfully
        return JSONResponse(status_code=200, content='success')
    except Exception as e:
        print(e)
        # Return error message if there was an error deleting the event
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})