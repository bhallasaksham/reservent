import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv(os.getcwd() + '/config/.env')


class DatabaseEngine:
    __instance = None

    @staticmethod
    def getInstance():
        """ Static access method. """
        if DatabaseEngine.__instance is None:
            DatabaseEngine()
        return DatabaseEngine.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if DatabaseEngine.__instance is None:
            # Set the connection parameters
            conn_params = {
                "host": os.getenv("DB_HOST"),
                "port": os.getenv("DB_PORT"),
                "database": "reservent_db",
                "user": os.getenv("DB_USER"),
                "password": os.getenv("DB_PASSWORD")
            }
            # Create the SQLAlchemy engine
            engine = create_engine(
                f'postgresql://{conn_params["user"]}:{conn_params["password"]}@{conn_params["host"]}:{int(conn_params["port"])}/{conn_params["database"]}')

            # Connect to the database using the engine
            self.__engine = engine
            DatabaseEngine.__instance = self

    def getEngine(self):
        """ Get a database connection """
        return self.__engine
