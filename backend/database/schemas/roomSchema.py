
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.ext.declarative import declarative_base

from database.dbConfig import DatabaseEngine

Base = declarative_base()
db = DatabaseEngine.getInstance()
engine = db.getEngine()

class Privilege(Enum):
    STUDENT = 1
    STAFF_AND_FACULTY = 2


class RoomSchema(Base):
    __tablename__ = 'tblRooms'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    url = Column(String)
    capacity = Column(Integer)
    privilege = Column(Integer)

    def __init__(self, name=None, url=None, capacity=None, privilege=None):
        self.name = name
        self.url = url
        self.capacity = capacity
        self.privilege = privilege

        # Create tables if not exist
        Base.metadata.create_all(engine)
