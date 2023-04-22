
from sqlalchemy.orm import sessionmaker

from database.dbConfig import DatabaseEngine
from database.schemas.userSchema import UserSchema


class UserDao:
    def __init__(self):
        self.engine = DatabaseEngine.getInstance().getEngine()

    def getUserByEmail(self, email):
        session = sessionmaker(bind=self.engine)()
        user = session.query(UserSchema).filter(UserSchema.email == email).first()
        session.close()
        return user
