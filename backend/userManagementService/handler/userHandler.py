
from userManagementService.dao.userDao import UserDao
from database.schemas.userSchema import UserPrivilege

class UserHandler:
    def __init__(self):
        self.userDao = UserDao()

    def user_login(self, username, email):
        user = self.userDao.getUserByEmail(email)
        if user is None:
            user = self.userDao.createUser(username, email, UserPrivilege.USER)
        return user