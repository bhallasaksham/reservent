from sqlalchemy.orm import sessionmaker

from database.schemas.eventSchema import EventSchema
from database.dbConfig import DatabaseEngine


class EventDao:

    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()
        self.session = sessionmaker(bind=self.engine, autoflush=True)()

    def save(self, event):
        title = event['summary']
        description = event.get('description', '')
        startTime = event['start']['dateTime']
        endTime = event['end']['dateTime']
        room = event['guests'][0]['email']
        creator = event['creator']
        guests = str(event['guests'])
        event = EventSchema(title, description, startTime, endTime, room, creator, guests)
        self.session.add(event)
        self.session.commit()
        return event

