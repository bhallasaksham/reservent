from fastapi import APIRouter

roomRoutes = APIRouter()


@roomRoutes.get("/")
async def root():
    return {"message": "Hello World"}