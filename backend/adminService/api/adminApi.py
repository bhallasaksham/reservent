
from fastapi import APIRouter
from fastapi import Request as FastAPIRequest
from fastapi.responses import JSONResponse
from adminService.handler.adminHandler import AdminHandler
from database.schemas.userSchema import UserPrivilege

# Initialize the router
adminRoutes = APIRouter()
# Initialize the handler
adminHandler = AdminHandler()


'''
This endpoint is used to get all the users from the database for administrator usage.
'''
@adminRoutes.get("/admin/users")
async def get_users():
    users = adminHandler.get_users()
    return users


'''
This endpoint is used to delete a user from the database for administrator usage.
'''
@adminRoutes.delete("/admin/users")
async def delete_user(request: FastAPIRequest):
    # Get the user's email from the cookie
    email = request.state.user['email']
    # Get the target user's email from the request body
    body = await request.json()
    target_user_email = body.get("target_user_email")
    try:
        # Delete the user from the database
        adminHandler.delete_user(email, target_user_email)
    except Exception as e:
        # Return an error if there is an error deleting the user
        return JSONResponse(status_code=500, content={"message": "Error deleting user", "error": str(e)})
    # Return a success message if the user is deleted successfully
    return JSONResponse(status_code=200, content={"message": "User deleted"})


'''
This endpoint is used to update a user's privilege in the database for administrator usage.
'''
@adminRoutes.put("/admin/users/privilege")
async def update_user_privilege(request: FastAPIRequest):
    # Get the user's email from the cookie
    email = request.state.user['email']
    # Get the privilege and target user's email from the request body
    body = await request.json()
    privilege = body.get("privilege")
    target_user_email = body.get("target_user_email")
    try:
        # Update the user's privilege in the database
        adminHandler.update_user_privilege(email, target_user_email, privilege)
    except Exception as e:
        # Return an error if there is an error updating the user's privilege
        return JSONResponse(status_code=500, content={"message": "Error updating user privilege", "error": str(e)})
    # Return the updated user's email and privilege if the user's privilege is updated successfully
    return JSONResponse(status_code=200, content={"user": target_user_email, "privilege": privilege})
