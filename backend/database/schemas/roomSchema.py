from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

from database.dbConfig import DatabaseEngine

Base = declarative_base()
db = DatabaseEngine.getInstance()
engine = db.getEngine()


class RoomSchema(Base):
    __tablename__ = 'tblRooms'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    url = Column(String)
    size = Column(Integer)

    def __init__(self, name = None, url = None, size = None):
        self.name = name
        self.url = url
        self.size = size

        # Create tables if not exist
        Base.metadata.create_all(engine)