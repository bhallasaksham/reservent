
import jwt
from fastapi.responses import JSONResponse
from adminService.utils.jwt import decode_jwt


'''
This middleware is used to authenticate the user using JWT.

We decode the JWT token using the decode_jwt method from the jwt.py file in the utils folder.
'''
async def authentication(request, call_next):
    # Get the token from the authorization header
    token = request.headers["authorization"].split(" ")[1]
    # Return an error if there is no token
    if token is None:
        return JSONResponse(status_code=401, content={"message": "Unauthorized"})
    
    # Decode the JWT token
    try:
        # Get the user payload from the JWT token
        userPayload = decode_jwt(token)
        # Set the user payload to the request state
        request.state.user = userPayload
    except jwt.exceptions.InvalidTokenError:
            # Return an error if the token is invalid
            return JSONResponse(status_code=401, content={"message": "Invalid token"})
    # Return the response
    response = await call_next(request)
    return response
