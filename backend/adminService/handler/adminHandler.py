
from adminService.dao.userDao import UserDao
from database.schemas.userSchema import UserPrivilege

class AdminHandler:
    def __init__(self):
        self.userDao = UserDao()

    def get_users(self):
        users = self.userDao.getUsers()
        return users

    def update_user_privilege(self, email, privilege):
        user = self.userDao.updateUserPrivilegeByEmail(email, privilege)
        return user