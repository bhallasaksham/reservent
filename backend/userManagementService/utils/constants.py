
import os

FRONT_END_URL = 'http://' + os.getenv("LOCAL_HOST") + ':' + os.getenv("FRONT_END_SERVICE_PORT")
SCOPES = ['https://www.googleapis.com/auth/calendar']