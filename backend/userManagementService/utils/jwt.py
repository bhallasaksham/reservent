
import jwt
from userManagementService.utils.oauth import SECRET_KEY

# Encode the payload using a secret key
def get_jwt(payload):
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


# Decode the token using the same secret key
def decode_jwt(encoded_token):
    return jwt.decode(encoded_token, SECRET_KEY, algorithms=['HS256'])
