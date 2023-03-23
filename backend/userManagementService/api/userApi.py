from fastapi import APIRouter

userRoutes = APIRouter()


@userRoutes.get("/")
async def root():
    return {"message": "Hello World"}