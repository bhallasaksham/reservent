from sqlalchemy.orm import sessionmaker

from database.schemas.roomSchema import RoomSchema
from database.dbConfig import DatabaseEngine


class RoomDao:

    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()

    def getRoomByName(self, name):
        session = sessionmaker(bind=self.engine)()
        room = session.query(RoomSchema).filter(RoomSchema.name == name).first()
        session.close()
        return room

    def getRoomByUrl(self, url):
        room = self.session.query(RoomSchema).filter(RoomSchema.url.contains(url)).first()
        return room
