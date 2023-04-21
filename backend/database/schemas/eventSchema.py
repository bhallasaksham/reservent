import json
from datetime import datetime

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

from database.dbConfig import DatabaseEngine

Base = declarative_base()
db = DatabaseEngine.getInstance()
engine = db.getEngine()


class EventSchema(Base):
    __tablename__ = 'tblEvents'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    startTime = Column(DateTime)
    endTime = Column(DateTime)
    room = Column(String)
    creator = Column(String)
    guests = Column(String)

    def __init__(self, title = None, description = None, startTime = None, endTime = None, room = None, creator = None, guests = None):
        self.title = title
        self.description = description
        self.startTime = startTime
        self.endTime = endTime
        self.room = room
        self.creator = creator
        self.guests = guests

        # Create the table if it does not exist
        Base.metadata.create_all(engine)

# Pydantic schema for the Event model
class EventModel(BaseModel):
    id: int
    title: str
    description: str
    startTime: str
    endTime: str
    room: str
    creator: str
    guests: str