
from adminService.dao.userDao import UserDao
from database.schemas.userSchema import UserPrivilege

class AdminHandler:
    def __init__(self):
        self.userDao = UserDao()

    def get_users(self):
        users = self.userDao.getUsers()
        return users

    def update_user_privilege(self, email, target_user_email, privilege):
        admin_user = self.userDao.getUserByEmail(email)
        if admin_user.privilege != UserPrivilege.ADMIN:
            raise Exception("Only admin can update user privilege")
        user = self.userDao.updateUserPrivilegeByEmail(target_user_email, privilege)
        return user

    def delete_user(self, email, target_user_email):
        admin_user = self.userDao.getUserByEmail(email)
        if admin_user.privilege != UserPrivilege.ADMIN:
            raise Exception("Only admin can delete user")
        return self.userDao.deleteUserByEmail(target_user_email)
