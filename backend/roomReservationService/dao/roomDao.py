from sqlalchemy.orm import sessionmaker

from database.schemas.roomSchema import RoomSchema
from database.dbConfig import DatabaseEngine


'''
This class is used to handle all the database operations related to the room table.
DAO means Data Access Object.

We use SQLAlchemy to handle all the database operations.
'''
class RoomDao:

    '''
    This method is used to initialize the RoomDao class.

    We initialize the engine here.
    '''
    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()

    '''
    This method is used to get all rooms record in the database.
    '''
    def getRooms(self):
        session = sessionmaker(bind=self.engine)()
        rooms = session.query(RoomSchema).all()
        session.close()
        return rooms

    '''
    This method is used to get a room record by privilege from the database.
    '''
    def getRoomsByPrivilege(self, privilege):
        session = sessionmaker(bind=self.engine)()
        rooms = session.query(RoomSchema).filter(RoomSchema.privilege == privilege).all()
        session.close()
        return rooms

    '''
    This method is used to get a room record by room's name from the database.
    '''
    def getRoomByName(self, name):
        session = sessionmaker(bind=self.engine)()
        room = session.query(RoomSchema).filter(RoomSchema.name == name).first()
        session.close()
        return room
