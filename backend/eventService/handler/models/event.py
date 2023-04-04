from datetime import date
from typing import List

from backend.eventService.handler.models.guest import Guest
from backend.eventService.handler.models.user import User


class Event:
    title: str
    description: str
    startTime: date
    endTime: date
    guests: List[Guest]
    room: str
    zoomLink: str
    eventCreator: User
