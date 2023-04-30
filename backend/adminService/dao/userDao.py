
from sqlalchemy.orm import sessionmaker

from database.dbConfig import DatabaseEngine
from database.schemas.userSchema import UserSchema


'''
This class is used to handle all the database operations related to the user table.
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
    def getUsers(self):
        session = sessionmaker(bind=self.engine)()
        users = session.query(UserSchema).all()
        session.close()
        return users

    '''
    This method is used to get a user record by email from the database.
    '''
    def getUserByEmail(self, email):
        session = sessionmaker(bind=self.engine)()
        user = session.query(UserSchema).filter(UserSchema.email == email).first()
        session.close()
        return user
    
    '''
    This method is used to update a user's privilege by email in the database.
    '''
    def updateUserPrivilegeByEmail(self, email, privilege):
        session = sessionmaker(bind=self.engine, autoflush=True)()
        user = session.query(UserSchema).filter(UserSchema.email == email).first()
        user.privilege = privilege
        session.commit()
        session.close()
        return user

    '''
    This method is used to delete a user by email in the database.

    Throw an exception if the user does not exist.
    '''
    def deleteUserByEmail(self, email):
        session = sessionmaker(bind=self.engine, autoflush=True)()
        try:
            user = session.query(UserSchema).filter(UserSchema.email == email).first()
            session.delete(user)
            session.commit()
            session.close()
        except Exception as e:
            print(e)
            session.rollback()
            session.close()
            return False
        return True
