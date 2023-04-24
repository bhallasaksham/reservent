import ast
from datetime import datetime

import pytz
from sqlalchemy.orm import sessionmaker

from database.schemas.eventSchema import EventSchema, EventModel
from database.dbConfig import DatabaseEngine

from eventService.utils.datetime import get_timestring_from_datetime

from database.schemas.userSchema import UserPrivilege


class EventDao:

    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()
        self.session = sessionmaker(bind=self.engine, autoflush=True)()

    def save(self, event, room, id, privilege):
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
        event = EventSchema(id, title, description, startTime, endTime, room, creator, guests, privilege)
        self.session.add(event)
        self.session.commit()
        return event

    def get_events(self, privilege):
        now = datetime.now(pytz.timezone('US/Pacific'))
        if privilege != UserPrivilege.USER:
            events = self.session.query(EventSchema).filter(EventSchema.startTime >= now).all()
        else:
            events = self.session.query(EventSchema).filter(EventSchema.startTime >= now, EventSchema.privilege == privilege).all()
        events_list = [
            EventModel(id=event.id, title=event.title, description=event.description, startTime=get_timestring_from_datetime(event.startTime),
            endTime=get_timestring_from_datetime(event.endTime), room=event.room, creator=event.creator, guests=ast.literal_eval(event.guests), privilege=event.privilege).dict() for event in events
        ]
        return events_list

    def get_event_by_id(self, event_id):
        event = self.session.query(EventSchema).filter(EventSchema.id == event_id).first()
        return EventModel(id=event.id, title=event.title, description=event.description, startTime=get_timestring_from_datetime(event.startTime),
            endTime=get_timestring_from_datetime(event.endTime), room=event.room, creator=event.creator, guests=ast.literal_eval(event.guests), privilege=event.privilege).dict()

    def delete_event_by_id(self, event_id):
        query = self.session.query(EventSchema).filter(EventSchema.id == event_id)
        query.delete()
        self.session.commit()
