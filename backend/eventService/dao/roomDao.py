from sqlalchemy.orm import sessionmaker

from database.schemas.roomSchema import RoomSchema
from database.dbConfig import DatabaseEngine


class RoomDao:

    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()
        self.session = sessionmaker(bind=self.engine, autoflush=True)()

    def initRooms(self):
        # Create rooms
        rooms = [
            RoomSchema(name='RM116',
                       url='http://calendar.google.com/calendar/r?cid=c_18892kskagh6khq5ie244ejemu20a@resource.calendar.google.com',
                       size=6),
            RoomSchema(name='RM120',
                       url='http://calendar.google.com/calendar/r?cid=c_18857krhc40eejk5molu6feh8dbcc@resource.calendar.google.com',
                       size=6),
            RoomSchema(name='RM129A',
                       url='http://calendar.google.com/calendar/r?cid=west.cmu.edu_2d34383337323335352d383031@resource.calendar.google.com',
                       size=6),
            RoomSchema(name='RM129B',
                       url='http://calendar.google.com/calendar/r?cid=west.cmu.edu_2d34383231323435382d333231@resource.calendar.google.com',
                       size=6),
            RoomSchema(name='RM224',
                       url='http://calendar.google.com/calendar/r?cid=c_188dqu93ks628hq1ncd7m3euj8s0s@resource.calendar.google.com',
                       size=6),
            RoomSchema(name='RM228',
                       url='http://calendar.google.com/calendar/r?cid=west.cmu.edu_3634303838363838313536@resource.calendar.google.com',
                       size=6),
            RoomSchema(name='RM230',
                       url='http://calendar.google.com/calendar/r?cid=west.cmu.edu_35363936313337362d363937@resource.calendar.google.com',
                       size=6)
        ]

        # Add all the rooms to the session
        for room in rooms:
            instance = self.session.query(RoomSchema).filter(RoomSchema.name == room.name).first()
            if instance:
                continue
            self.session.add(room)

        # Commit the transaction
        self.session.commit()

    def getRooms(self):
        session = sessionmaker(bind=self.engine)()
        rooms = session.query(RoomSchema)
        session.close()
        return rooms

    def getRoomByName(self, name):
        session = sessionmaker(bind=self.engine)()
        room = session.query(RoomSchema).filter(RoomSchema.name == name).first()
        session.close()
        return room
