import ast
from datetime import datetime

import pytz
from sqlalchemy.orm import sessionmaker

from database.schemas.eventSchema import EventSchema, EventModel
from database.dbConfig import DatabaseEngine

from eventService.utils.datetime import get_timestring_from_datetime

from database.schemas.userSchema import UserPrivilege


'''
This class is used to handle all the database operations related to the event table.
DAO means Data Access Object.

We use SQLAlchemy to handle all the database operations.
'''
class EventDao:

    '''
    This method is used to initialize the EventDao class.
    We initialize the engine and session here.
    '''
    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()
        self.session = sessionmaker(bind=self.engine, autoflush=True)()

    '''
    This method is used to create an event record in the database.
    We construct an EventSchema object and add it to the session.
    '''
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

    '''
    This method is used to get all events record from the database.
    We filter the events by the start time.
    If the user is not an basic user, we return all the events.
    '''
    def get_events(self, privilege):
        pst_tz = pytz.timezone('US/Pacific')
        now = datetime.now(pst_tz).replace(tzinfo=None)
        if privilege != UserPrivilege.USER:
            events = self.session.query(EventSchema).filter(EventSchema.startTime >= now).all()
        else:
            events = self.session.query(EventSchema).filter(EventSchema.startTime >= now, EventSchema.privilege == privilege).all()
        events_list = [
            EventModel(id=event.id, title=event.title, description=event.description, startTime=get_timestring_from_datetime(event.startTime),
            endTime=get_timestring_from_datetime(event.endTime), room=event.room, creator=event.creator, guests=ast.literal_eval(event.guests), privilege=event.privilege).dict() for event in events
        ]
        return events_list

    '''
    This method is used to delete an event record by event's id from the database.
    '''
    def delete_event_by_id(self, event_id):
        query = self.session.query(EventSchema).filter(EventSchema.id == event_id)
        query.delete()
        self.session.commit()
