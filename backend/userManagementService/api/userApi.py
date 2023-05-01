
from fastapi import APIRouter, Cookie, Query
from fastapi import Request as FastAPIRequest
from fastapi.responses import JSONResponse, RedirectResponse
from userManagementService.utils.oauth import get_oauth
from userManagementService.utils.jwt import get_jwt
from userManagementService.handler.userHandler import UserHandler
from userManagementService.utils.constants import FRONT_END_URL


# Initialize the router
userRoutes = APIRouter()

# Initialize the handler
userHandler = UserHandler()

# Initialize the oauth
oauth = get_oauth()


'''
This endpoint is used to let front end call our backend to 
get the redirect url for google login.
'''
@userRoutes.get("/login")
async def login(request: FastAPIRequest):
    redirect_uri = request.url_for('auth')  # This creates the url for the /auth endpoint
    return await oauth.google.authorize_redirect(request, redirect_uri, access_type='offline', prompt='consent')


'''
This endpoint is a callback url for google login.
OAuth2 will redirect to this url after user has logged in.
It will provide us with the access token and id token.
We will use the id token to get the user's information.
We will then use the user's information to create a jwt token.
After that, we will create a user record into our database.
Finally, We will then use the jwt token to create a cookie.
'''
@userRoutes.get('/auth')
async def auth(request: FastAPIRequest, access_token_cookie: str = Cookie(None)):
    # Get the access token and id token from google
    token = await oauth.google.authorize_access_token(request)
    # Get the user's information from google
    user = await oauth.google.parse_id_token(request, token)
    # Create a jwt token
    jwt_token = get_jwt({
        'name': user['name'],
        'email': user['email'],
    })

    try:
        # Create a user record in our database
        userDb = userHandler.user_login(user['name'], user['email'])
    except Exception as e:
        # Return an error if there is an error creating the user
        response.status_code = 500
        return {"message": "Error creating user", "error": str(e)}
    
    # Create a new Redirct response
    response = RedirectResponse(url=FRONT_END_URL)
    
    # Set the access token cookie if it doesn't already exist
    if access_token_cookie is None:
        response.set_cookie(key='refresh_token', value=token['refresh_token'], httponly=False, max_age=3600, secure=True)
        response.set_cookie(key='jwt_token', value=jwt_token, httponly=False, max_age=3600, secure=True)
        response.set_cookie(key='user_privilege', value=userDb.privilege, httponly=False, max_age=3600, secure=True)
    
    return response


'''
This endpoint is used to logout the user.
It will delete the refresh token and jwt token cookies.
'''
@userRoutes.get('/logout')
async def logout(response: JSONResponse):
    response.delete_cookie('refresh_token')
    response.delete_cookie('jwt_token')
    return {"message": "Logged out successfully"}


'''
This endpoint is used to get the user's privilege.
'''
@userRoutes.get('/users/privileges')
async def get_user_privilege(request: FastAPIRequest):
    try:
        # Get the user's email from the query params
        email = request.query_params['email']
        userPrivilege = userHandler.get_user_privilege(email)
    except Exception as e:
        # Return an error if there is an error getting the user's privilege
        return JSONResponse(status_code=500, content={"message": "Error getting user privilege", "error": str(e)})
    # Return the user's privilege
    return JSONResponse(status_code=200, content={"user": email, "privilege": userPrivilege})
