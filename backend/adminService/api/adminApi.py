from fastapi import APIRouter

adminRoutes = APIRouter()


@adminRoutes.get("/")
async def root():
    return {"message": "Hello World"}