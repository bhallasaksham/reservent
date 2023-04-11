import os
from datetime import datetime
import jwt
from fastapi import HTTPException, status, Request
import requests

SECRET_KEY = os.environ.get('SECRET_KEY') or None
if SECRET_KEY is None:
    raise BaseException('Missing env variables')


# Decode the token using the same secret key
def decode_jwt(encoded_token):
    return jwt.decode(encoded_token, SECRET_KEY, algorithms=['HS256'])


def get_time_in_google_api_compatible_format(timestamp_str):
    timestamp_dt = datetime.strptime(timestamp_str, '%a %b %d %Y %H:%M:%S %Z %z')
    converted = timestamp_dt.strftime('%Y-%m-%dT%H:%M:%S%z')
    return converted


'''
TODO: 
1. get jwt and refresh token from header after yixin merges his PR
2. populate request data using request.body() instead of hard coding it 
'''


def facade(url: str, http_verb: str, request: Request):
    if request.cookies is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    jwt_token = request.cookies["jwt_token"]
    # jwt_token = request.headers["authorization"].split(" ")[1]
    decoded_token = decode_jwt(jwt_token)
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "email": decoded_token.get("email"),
        "google_auth_token": request.cookies["refresh_token"],
        # "google_auth_token": request.headers["authorization"].split(" ")[2],
        "start_time": get_time_in_google_api_compatible_format("Tue Apr 11 2023 16:00:00 GMT -0700"),
        "end_time": get_time_in_google_api_compatible_format("Tue Apr 11 2023 17:00:00 GMT -0700"),
        "num_guests": 4
    }
    # for key, value in request.body():
    #     data[key] = value

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

    if response.status_code != 200 or response.status_code != 201:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

    return response.json()
