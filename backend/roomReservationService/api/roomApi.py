from fastapi import APIRouter

from ..handler import RoomHandler

roomRoutes = APIRouter()


@roomRoutes.get("/")
async def root():
    return RoomHandler().initialize_rooms()