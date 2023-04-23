from sqlalchemy.orm import sessionmaker

from database.schemas.roomSchema import RoomSchema
from database.dbConfig import DatabaseEngine


class RoomDao:

    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()

    def getRooms(self):
        session = sessionmaker(bind=self.engine)()
        rooms = session.query(RoomSchema).all()
        session.close()
        return rooms

    def getRoomsByPrivilege(self, privilege):
        session = sessionmaker(bind=self.engine)()
        rooms = session.query(RoomSchema).filter(RoomSchema.privilege == privilege).all()
        session.close()
        return rooms

    def getRoomByName(self, name):
        session = sessionmaker(bind=self.engine)()
        room = session.query(RoomSchema).filter(RoomSchema.name == name).first()
        session.close()
        return room
