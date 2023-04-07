from fastapi import APIRouter

from ..dao import Room

roomRoutes = APIRouter()


@roomRoutes.get("/")
async def root():
    rooms = Room(name='RM120', url='abc.com').initRooms()
    return rooms