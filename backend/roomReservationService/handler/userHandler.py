
from roomReservationService.dao.userDao import UserDao

class UserHandler:
    def __init__(self):
        self.userDao = UserDao()

    def get_user_privilege(self, email):
        user = self.userDao.getUserByEmail(email)
        return user.privilege
