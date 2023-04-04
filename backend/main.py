import subprocess
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from adminService import adminRoutes
from eventService import eventRoutes
from roomReservationService import roomRoutes
from userManagementService import userRoutes

user_management_app = FastAPI()
room_reservation_app = FastAPI()
event_app = FastAPI()
admin_app = FastAPI()

# setting up the routers
user_management_app.include_router(userRoutes)
room_reservation_app.include_router(roomRoutes)
event_app.include_router(eventRoutes)
admin_app.include_router(adminRoutes)


origins = ["http://localhost:3000"]
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

if __name__ == "__main__":
    subprocess.call(['sh', './config/run.sh'])
