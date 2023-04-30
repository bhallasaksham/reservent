import os
import subprocess
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from adminService import adminRoutes
from eventService import eventRoutes
from roomReservationService import roomRoutes
from userManagementService import userRoutes
from reservationFacade import facadeRoutes
from starlette.middleware.sessions import SessionMiddleware

from adminService.middlewares.auth import authentication
from userManagementService.utils.constants import FRONT_END_URL

# setting up the apps
user_management_app = FastAPI()
room_reservation_app = FastAPI()
event_app = FastAPI()
admin_app = FastAPI()
reservation_facade_app = FastAPI()

# setting up the routers
user_management_app.include_router(userRoutes)
room_reservation_app.include_router(roomRoutes)
event_app.include_router(eventRoutes)
admin_app.include_router(adminRoutes)
reservation_facade_app.include_router(facadeRoutes)

# setting up the middlewares
admin_app.middleware("http")(authentication)

SECRET_KEY = os.environ.get('SECRET_KEY') or None
if SECRET_KEY is None:
    raise BaseException('Missing env variables')
user_management_app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

origins = [FRONT_END_URL]
user_management_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
room_reservation_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
event_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
admin_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
reservation_facade_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    subprocess.call(['sh', './config/run.sh'])
