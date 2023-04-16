
from sqlalchemy.orm import sessionmaker

from database.dbConfig import DatabaseEngine
from database.schemas.userSchema import UserSchema


class UserDao:
    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()

    def createUser(self, username, user_email, privilege):
        session = sessionmaker(bind=self.engine, autoflush=True)()
        user = UserSchema(username, user_email, privilege)
        session.add(user)
        session.commit()
        session.close()
        return user
    
    def getUser(self, userId):
        session = sessionmaker(bind=self.engine)()
        user = session.query(UserSchema).filter(UserSchema.id == userId).first()
        session.close()
        return user 

    def getUserByEmail(self, email):
        session = sessionmaker(bind=self.engine)()
        user = session.query(UserSchema).filter(UserSchema.email == email).first()
        session.close()
        return user

