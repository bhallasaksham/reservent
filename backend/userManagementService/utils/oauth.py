
import os

from starlette.config import Config
from authlib.integrations.starlette_client import OAuth

# OAuth settings
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID') or None
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET') or None
if GOOGLE_CLIENT_ID is None or GOOGLE_CLIENT_SECRET is None:
    raise BaseException('Missing env variables')

# Secret key
SECRET_KEY = os.environ.get('SECRET_KEY') or None
if SECRET_KEY is None:
    raise BaseException('Missing env variables')

# Set up OAuth
config_data = {'GOOGLE_CLIENT_ID': GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_SECRET': GOOGLE_CLIENT_SECRET}
starlette_config = Config(environ=config_data)
oauth = None


'''
This function returns the oauth object
'''
def get_oauth():
    global oauth
    if oauth is None:
        oauth = OAuth(starlette_config)
        oauth.register(
            name='google',
            server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
            client_kwargs={'scope': 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.compose'},
        )
    return oauth

# This is an example how to use google auth to interact with google calendar
# info = {
#     'client_id': GOOGLE_CLIENT_ID,
#     'client_secret': GOOGLE_CLIENT_SECRET,
#     'refresh_token': token['refresh_token'],
# }

# # Create a Google Calendar API client
# creds = Credentials.from_authorized_user_info(info=info, scopes=SCOPES)
# print("creds", creds.to_json())
# service = build('calendar', 'v3', credentials=creds)
# now = datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
# events_result = service.events().list(calendarId='primary', timeMin=now,
#                                         maxResults=10, singleEvents=True,
#                                         orderBy='startTime').execute()
