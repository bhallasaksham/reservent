from fastapi import FastAPI, Request, Response, HTTPException, Depends, Header, Form, Cookie, Query, status
import requests

SECRET_KEY = os.environ.get('SECRET_KEY') or None
if SECRET_KEY is None:
    raise BaseException('Missing env variables')

# Decode the token using the same secret key
def decode_jwt(encoded_token):
    return jwt.decode(encoded_token, SECRET_KEY, algorithms=['HS256'])


def facade(url: str, http_verb: str, token: Optional[str] = Header(None)):
    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    decoded_token = decode_jwt(token)

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "username": decoded_token.get("username"),
        "email": decoded_token.get("email")
    }

    if http_verb == "GET":
        response = requests.get(url, headers=headers, json=data)
    elif http_verb == "PUT":
        response: requests.put(url, headers=headers, json=data)
    elif http_verb == "POST":
        response: requests.post(url, headers=headers, json=data)
    elif http_verb == "DELETE":
        response: requests.delete(url, headers=headers, json=data)
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Invalid HTTP Verb in Facade Layer")

    if response.status_code != 200 or response.status_code != 201:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

    return response.json()