import os
import jwt
from fastapi import HTTPException, status, Request
from fastapi.responses import JSONResponse
import requests

SECRET_KEY = os.environ.get('SECRET_KEY') or None
if SECRET_KEY is None:
    raise BaseException('Missing env variables')


# Decode the token using the same secret key
def decode_jwt(encoded_token):
    return jwt.decode(encoded_token, SECRET_KEY, algorithms=['HS256'])


async def facade(url: str, http_verb: str, request: Request):
    if request.headers is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    jwt_token = request.headers["authorization"].split(" ")[1]
    decoded_token = decode_jwt(jwt_token)
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "email": decoded_token.get("email"),
        "google_auth_token": request.headers["authorization"].split(" ")[2]
    }
    if request.query_params:
        params = request.query_params
        for key, value in params.items():
            data[key] = value

    if http_verb == 'GET':
        response = requests.get(url, headers=headers, json=data)
    elif http_verb == 'PUT':
        response = requests.put(url, headers=headers, json=data)
    elif http_verb == 'POST':
        response = requests.post(url, headers=headers, json=data)
    elif http_verb == 'DELETE':
        response = requests.delete(url, headers=headers, json=data)
    else:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="Invalid HTTP Verb in Facade Layer")

    return JSONResponse(status_code=response.status_code, content=response.content)
