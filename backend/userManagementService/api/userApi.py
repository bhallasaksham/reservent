
from fastapi import APIRouter, Cookie, Query
from fastapi import Request as FastAPIRequest
from fastapi.responses import JSONResponse, RedirectResponse
from userManagementService.utils.oauth import get_oauth
from userManagementService.utils.jwt import get_jwt
from userManagementService.handler.userHandler import UserHandler
from userManagementService.utils.constants import FRONT_END_URL

userRoutes = APIRouter()
userHandler = UserHandler()
oauth = get_oauth()

@userRoutes.get("/")
async def root():
    return {"message": "Hello World"}

@userRoutes.get("/login")
async def login(request: FastAPIRequest):
    redirect_uri = request.url_for('auth')  # This creates the url for the /auth endpoint
    return await oauth.google.authorize_redirect(request, redirect_uri, access_type='offline', prompt='consent')

@userRoutes.get('/auth')
async def auth(request: FastAPIRequest, access_token_cookie: str = Cookie(None)):
    token = await oauth.google.authorize_access_token(request)
    user = await oauth.google.parse_id_token(request, token)
    jwt_token = get_jwt({
        'name': user['name'],
        'email': user['email'],
    })

    try:
        userDb = userHandler.user_login(user['name'], user['email'])
    except Exception as e:
        response.status_code = 500
        print("Error creating user", e)
        return {"message": "Error creating user", "error": str(e)}
    
    # Create a new JSON response with the user data
    response = RedirectResponse(url=FRONT_END_URL)
    
    # Set the access token cookie if it doesn't already exist
    if access_token_cookie is None:
        response.set_cookie(key='refresh_token', value=token['refresh_token'], httponly=False, max_age=3600, secure=True)
        response.set_cookie(key='jwt_token', value=jwt_token, httponly=False, max_age=3600, secure=True)
        response.set_cookie(key='user_privilege', value=userDb.privilege, httponly=False, max_age=3600, secure=True)
    
    return response

@userRoutes.get('/logout')
async def logout(response: JSONResponse):
    response.delete_cookie('refresh_token')
    response.delete_cookie('jwt_token')
    return {"message": "Logged out successfully"}

@userRoutes.get('/users/privileges')
async def get_user_privilege(request: FastAPIRequest):
    try:
        email = request.query_params['email']
        userPrivilege = userHandler.get_user_privilege(email)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error getting user privilege", "error": str(e)})
    return JSONResponse(status_code=200, content={"user": email, "privilege": userPrivilege})
