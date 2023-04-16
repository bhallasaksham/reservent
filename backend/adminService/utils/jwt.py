
import os
import jwt

# Secret key
SECRET_KEY = os.environ.get('SECRET_KEY') or None
if SECRET_KEY is None:
    raise BaseException('Missing env variables')

# Encode the payload using a secret key
def get_jwt(payload):
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


# Decode the token using the same secret key
def decode_jwt(encoded_token):
    return jwt.decode(encoded_token, SECRET_KEY, algorithms=['HS256'])