
import jwt
from fastapi.responses import JSONResponse
from adminService.utils.jwt import decode_jwt

async def authetication(request, call_next):
    token = request.cookies.get('jwt_token')
    if token is None:
        return JSONResponse(status_code=401, content={"message": "Unauthorized"})
    
    try:
        userPayload = decode_jwt(token)
        request.state.user = userPayload
    except jwt.exceptions.InvalidTokenError:
            return JSONResponse(status_code=401, content={"message": "Invalid token"})

    response = await call_next(request)
    return response