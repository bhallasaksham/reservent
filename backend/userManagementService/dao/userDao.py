
from sqlalchemy.orm import sessionmaker

from database.dbConfig import DatabaseEngine
from database.schemas.userSchema import UserSchema


'''
This class is used to data access all the database operations related to the user table.
DAO means Data Access Object.

We use SQLAlchemy to handle all the database operations.
'''
class UserDao:
    '''
    This method is used to initialize the UserDao class.
    We initialize the engine here.
    '''
    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()

    '''
    This method is used to create a user record in the database.
    '''
    def createUser(self, username, user_email, privilege):
        session = sessionmaker(bind=self.engine, autoflush=True)()
        user = UserSchema(username, user_email, privilege)
        session.add(user)
        session.commit()
        session.close()
        return user
    
    '''
    This method is used to get a user record by user's id from the database.
    '''
    def getUser(self, userId):
        session = sessionmaker(bind=self.engine)()
        user = session.query(UserSchema).filter(UserSchema.id == userId).first()
        session.close()
        return user 

    '''
    This method is used to get a user record by user's email from the database.
    '''
    def getUserByEmail(self, email):
        session = sessionmaker(bind=self.engine)()
        user = session.query(UserSchema).filter(UserSchema.email == email).first()
        session.close()
        return user

