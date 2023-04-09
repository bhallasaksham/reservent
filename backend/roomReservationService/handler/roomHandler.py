from ..dao import Room


class RoomHandler:
    @staticmethod
    def initialize_rooms():
        rooms = Room().initRooms()
        return rooms
