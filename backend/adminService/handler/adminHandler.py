
from adminService.dao.userDao import UserDao
from database.schemas.userSchema import UserPrivilege


'''
This class is used to handle all the business logic related to the admin table.

We use the UserDao to handle all the database operations.
'''
class AdminHandler:
    '''
    This method is used to initialize the AdminHandler class.
    We initialize the userDao here.
    '''
    def __init__(self):
        self.userDao = UserDao()

    '''
    This method is used to get all the users from the database.
    '''
    def get_users(self):
        users = self.userDao.getUsers()
        return users

    '''
    This method is used to update a user's privilege by email in the database.
    '''
    def update_user_privilege(self, email, target_user_email, privilege):
        # Only admin can update user privilege
        admin_user = self.userDao.getUserByEmail(email)
        if admin_user.privilege != UserPrivilege.ADMIN:
            raise Exception("Only admin can update user privilege")
        user = self.userDao.updateUserPrivilegeByEmail(target_user_email, privilege)
        return user

    '''
    This method is used to delete a user by email in the database.
    '''
    def delete_user(self, email, target_user_email):
        # Only admin can delete user
        admin_user = self.userDao.getUserByEmail(email)
        if admin_user.privilege != UserPrivilege.ADMIN:
            raise Exception("Only admin can delete user")
        return self.userDao.deleteUserByEmail(target_user_email)
