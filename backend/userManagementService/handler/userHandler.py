
from userManagementService.dao.userDao import UserDao
from database.schemas.userSchema import UserPrivilege


'''
This class is used to handle all the business logic related to the user table.
'''
class UserHandler:
    '''
    This method is used to initialize the UserHandler class.
    We initialize the userDao here.
    '''
    def __init__(self):
        self.userDao = UserDao()

    '''
    This method is used to login a user.
    If the user does not exist, we create a new user.
    Else, we return the existing user.
    '''
    def user_login(self, username, email):
        user = self.userDao.getUserByEmail(email)
        if user is None:
            user = self.userDao.createUser(username, email, UserPrivilege.USER)
        return user

    '''
    This method is used to get a user privilege by user's email from the database.
    '''
    def get_user_privilege(self, email):
        user = self.userDao.getUserByEmail(email)
        return user.privilege
