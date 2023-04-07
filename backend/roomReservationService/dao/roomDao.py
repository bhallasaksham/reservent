from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from dbConfig import DatabaseEngine

Base = declarative_base()

def initDB():
    db = DatabaseEngine.getInstance()
    engine = db.getEngine()
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    return session

class Room(Base):
    __tablename__ = 'tblRooms'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    url = Column(String)

    def __init__(self, name, url):
        self.name = name
        self.url = url

    def initRooms(self):
        session = initDB()
        # Create a new room
        new_room = Room(name=self.name, url=self.url)

        # Add the new room to the session
        session.add(new_room)

        # Commit the transaction
        session.commit()

        rooms = session.query(Room).all()
        return rooms
