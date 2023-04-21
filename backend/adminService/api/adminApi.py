
from fastapi import APIRouter
from fastapi import Request as FastAPIRequest
from fastapi.responses import JSONResponse
from adminService.handler.adminHandler import AdminHandler
from database.schemas.userSchema import UserPrivilege

adminRoutes = APIRouter()
adminHandler = AdminHandler()

@adminRoutes.get("/")
async def root():
    return {"message": "Hello World"}


@adminRoutes.get("/admin/users")
async def get_users():
    users = adminHandler.get_users()
    return users


@adminRoutes.delete("/admin/users")
async def delete_user(request: FastAPIRequest):
    email = request.state.user['email']
    body = await request.json()
    target_user_email = body.get("target_user_email")
    try:
        adminHandler.delete_user(email, target_user_email)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error deleting user", "error": str(e)})
    return JSONResponse(status_code=200, content={"message": "User deleted"})


@adminRoutes.put("/admin/users/privilege")
async def update_user_privilege(request: FastAPIRequest):
    email = request.state.user['email']
    body = await request.json()
    privilege = body.get("privilege")
    target_user_email = body.get("target_user_email")
    try:
        adminHandler.update_user_privilege(email, target_user_email, privilege)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error updating user privilege", "error": str(e)})
    return JSONResponse(status_code=200, content={"user": target_user_email, "privilege": privilege})
