
from sqlalchemy import Enum
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

from database.dbConfig import DatabaseEngine

Base = declarative_base()
db = DatabaseEngine.getInstance()
engine = db.getEngine()


class UserPrivilege(Enum):
    ADMIN = 1
    STAFF = 2
    USER = 3


class UserSchema(Base):
    __tablename__ = 'user_tab'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    email = Column(String, unique=True, index=True)
    privilege = Column(Integer)

    def __init__(self, username = None, email = None, privilege = None):
        self.username = username
        self.email = email
        self.privilege = privilege

        # Create tables if not exist
        Base.metadata.create_all(engine)