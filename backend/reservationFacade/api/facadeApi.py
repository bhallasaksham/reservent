from fastapi import FastAPI, Request, Response, HTTPException, Depends, Header, Form, Cookie, Query, status

userRoutes = APIRouter()
oauth = get_oauth()


@userRoutes.get("/")
async def root():
    return {"message": "Hello World"}


@userRoutes.get("/rooms/available")
async def getAvailableRooms(response: Response, token: Optional[str] = Header(None)):
    try:
        return facade(url='http://127.0.0.1:8000/rooms/available', http_verb='GET', token=token)
    except HTTPException as e:
        response.status_code = e.status_code
        return {"message": e.detail}



@userRoutes.post("/rooms/:room/reserve")
async def reserveRoom(response: Response, token: Optional[str] = Header(None)):
    try:
        roomReservationResponse = facade(url="http://127.0.0.1:8000/rooms/reserve", http_verb='POST', token=token)
        if roomReservationResponse is not None:
            createEventResponse = facade(url="http://127.0.0.1:8080/events/create", http_verb='POST', token=token)
            if createEventResponse is not None:
                return facade(url="http://127.0.0.1:8080/events/finalize", http_verb='PUT', token=token);
    except HTTPException as e:
        response.status_code = e.status_code
        return {"message": e.detail}

