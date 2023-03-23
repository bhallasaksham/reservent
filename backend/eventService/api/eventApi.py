from fastapi import APIRouter

eventRoutes = APIRouter()


@eventRoutes.get("/")
async def root():
    return {"message": "Hello World"}