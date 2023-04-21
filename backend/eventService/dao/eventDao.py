from datetime import datetime

import pytz
from sqlalchemy.orm import sessionmaker

from database.schemas.eventSchema import EventSchema, EventModel
from database.dbConfig import DatabaseEngine

from eventService.utils.datetime import get_timestring_from_datetime


class EventDao:

    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()
        self.session = sessionmaker(bind=self.engine, autoflush=True)()

    def save(self, event, room):
        title = event['summary']
        description = event.get('description', '')
        startTime = event['start']['dateTime']
        endTime = event['end']['dateTime']
        creator = event['creator']
        guests = []
        if len(event['guests']) > 1:
            for guest in event['guests'][1:]:
                guests.append(guest['email'])
        guests = str(guests)
        event = EventSchema(title, description, startTime, endTime, room, creator, guests)
        self.session.add(event)
        self.session.commit()
        return event

    def get_events(self):
        now = datetime.now(pytz.timezone('US/Pacific'))
        events = self.session.query(EventSchema).filter(EventSchema.startTime >= now).all()
        events_list = [
            EventModel(title=event.title, description=event.description, startTime=get_timestring_from_datetime(event.startTime),
            endTime=get_timestring_from_datetime(event.endTime), room=event.room, creator=event.creator, guests=event.guests).dict() for event in events
        ]
        return events_list