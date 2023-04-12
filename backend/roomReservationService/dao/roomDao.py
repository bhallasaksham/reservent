from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from database.dbConfig import DatabaseEngine

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
    size = Column(Integer)

    _session = None

    def __init__(self, name = None, url = None, size = None):
        self.name = name
        self.url = url
        self.size = size
        if self._session is None:
            self._session = initDB()

    def initRooms(self):
        # Create rooms
        rooms = [
            Room(name='RM116', url='http://calendar.google.com/calendar/r?cid=c_18892kskagh6khq5ie244ejemu20a@resource.calendar.google.com', size=6),
            Room(name='RM120', url='http://calendar.google.com/calendar/r?cid=c_18857krhc40eejk5molu6feh8dbcc@resource.calendar.google.com', size=6),
            Room(name='RM129A', url='http://calendar.google.com/calendar/r?cid=west.cmu.edu_2d34383337323335352d383031@resource.calendar.google.com', size=6),
            Room(name='RM129B', url='http://calendar.google.com/calendar/r?cid=west.cmu.edu_2d34383231323435382d333231@resource.calendar.google.com', size=6),
            Room(name='RM216', url='http://calendar.google.com/calendar/r?cid=c_188da8uo28gm4hqmgp434p5e1njq2@resource.calendar.google.com', size=6),
            Room(name='RM224', url='http://calendar.google.com/calendar/r?cid=c_188dqu93ks628hq1ncd7m3euj8s0s@resource.calendar.google.com', size=6),
            Room(name='RM228', url='http://calendar.google.com/calendar/r?cid=west.cmu.edu_3634303838363838313536@resource.calendar.google.com', size=6),
            Room(name='RM230', url='http://calendar.google.com/calendar/r?cid=west.cmu.edu_35363936313337362d363937@resource.calendar.google.com', size=6)
        ]

        # Add all the rooms to the session
        self._session.add_all(rooms)

        # Commit the transaction
        self._session.commit()

        rooms = self._session.query(Room).all()
        return rooms
