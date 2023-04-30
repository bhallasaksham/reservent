import os
from typing import Optional

import jwt
from fastapi import HTTPException, status
import json
import requests
from starlette.responses import JSONResponse

SECRET_KEY = os.environ.get('SECRET_KEY') or None
if SECRET_KEY is None:
    raise BaseException('Missing env variables')


# Decode the token using the same secret key
def decode_jwt(encoded_token):
    return jwt.decode(encoded_token, SECRET_KEY, algorithms=['HS256'])

# Get the user privilege from the user management service
async def get_privilege(headers):
    jwt_token = headers["authorization"].split(" ")[1]
    decoded_token = decode_jwt(jwt_token)
    url = 'http://' + os.getenv("LOCAL_HOST") + ':' + os.getenv("USER_MANAGEMENT_SERVICE_PORT") + "/users/privileges"
    response = requests.get(url, headers=headers, params={"email": decoded_token.get("email")})
    data = response.json()
    return data['privilege']


# This method is used to call the services from the facade layer
async def facade(url: str, http_verb: str, headers: {}, params: Optional[dict] = None,
                 body: Optional[str] = None) -> object:
    if headers is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    jwt_token = headers["authorization"].split(" ")[1]
    decoded_token = decode_jwt(jwt_token)
    privilege = await get_privilege(headers)
    data = {
        "email": decoded_token.get("email"),
        "google_auth_token": headers["authorization"].split(" ")[2],
        "privilege": privilege
    }
    if params:
        for key, value in params.items():
            data[key] = value
    if body:
        event_data = json.loads(body)
        data['event'] = event_data
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
    return JSONResponse(status_code=response.status_code, content=response.json())
