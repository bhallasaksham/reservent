# API DOCUMENTATION

## USER MANAGEMENT SERVICE

This API provides user management services such as user authentication, user authorization, and obtaining user privilege level.

Authentication: This API uses OAuth 2.0 authentication for user login. The authentication token is stored in a secure HTTP-only cookie.

Authorization: This API uses JWT for user authorization. The JWT token is stored in a secure HTTP-only cookie.

Errors: This API returns errors in JSON format with the following keys: "message" and "error". The "message" key contains a user-friendly error message, while the "error" key contains the error details.

### Dependencies

1. fastapi: This is a high-performance web framework used for building APIs with Python 3.7+. It is used to create the API routes, handle incoming requests, and generate responses.

2. httpx: This is an HTTP client library for Python 3 that provides support for both synchronous and asynchronous APIs. It is used for making HTTP requests to the Google OAuth server.

3. google-auth: This is a Python library used for authenticating with Google APIs using OAuth 2.0. It provides utilities for making authentication requests and handling authentication tokens.

4. uvicorn: This is a lightning-fast ASGI server implementation that is used to run the fastapi application.

These dependencies can be installed by running:
```
pip install fastapi httpx google-auth uvicorn
```


### Login

This endpoint redirects the user to the Google OAuth login page. After successful authentication, the user is redirected to the /auth endpoint.

#### Endpoint
```
GET /login
```

#### Response
```
Redirect to Google OAuth login page.
```

### Authentication

This endpoint handles the authentication callback from the Google OAuth server. It retrieves the user information and creates a JWT token for user authorization. It also creates a refresh token for the user and sets it in a cookie.

#### Route
```
GET /auth
```

#### Response Success
```
Redirect to the frontend URL with cookies set.
```

#### Response Error Code 500
```
{
    message: "Error creating user"
}
```

#### Note
- [Firebase Documentation](https://firebase.google.com/docs/auth/web/google-signin)


### Logout

This endpoint logs out the user by deleting the refresh token and JWT token cookies.

#### Endpoint
```
GET /logout
```

#### Response

```
{
    message: "Logged out successfully"
}
```

### GET USER PRIVILEGE

This endpoint returns the user privilege level for a given email address. This endpoint is protected by user authentication and authorization.

#### Endpoint
```
GET /users/privileges
```

#### Response

##### Code 200 Success
````
{
    user: "user@andrew.cmu.edu",
    privilege: "admin"
}
````

##### Code 500 Error
````
{
    message: "Error getting user privilege"
}
````



## ROOM RESERVATION SERVICE

The Room Reservation Service API is a simple RESTful API that provides room reservation functionality.

Authentication: This API requires a valid Google OAuth 2.0 authentication token to be passed in the request body for all endpoints.

Authorization: This API uses user privileges to restrict access to certain endpoints. The privilege attribute must be passed in the request body for all endpoints.

Errors: This API returns errors in JSON format with the following keys: "message". The "message" key contains a user-friendly error message.

### Dependencies

1. fastapi: A modern, fast web framework for building APIs with Python.
2. pydantic: A data validation and settings management library.
3. google-auth: Library for Google OAuth2 authentication.
4. google-api-python-client: A library for accessing Google APIs.
5. typing: A module for supporting type hints.

### Fetch Available Rooms

#### Endpoint

```
GET /rooms/available
```

#### Example Request Body
```
{
    email: "user@andrew.cmu.edu",
    google_auth_token: "valid_oauth_token",
    privilege: "1",
    start_time: "2023-05-01T09:00:00",
    end_time: "2023-05-01T12:00:00",
    num_guests: 4
}
```

#### Example Response
```
{
    available_rooms: [
        {
            name: "Rm-116",
            calendar_id: "abcd1234",
            capacity: 6
        },
        {
            name: "Rm-120",
            calendar_id: "efgh5678",
            capacity: 6
        }
    ]
}
```

### Reserve Room

This endpoint reserves a room for a given time range and number of guests. This endpoint is protected by user authentication and authorization.

#### Endpoint
```
POST /rooms/reserve
```

#### Example Request Body
```
{
    email: "user@example.com",
    google_auth_token: "valid_oauth_token",
    privilege: "1",
    event: {
        "summary": "Meeting",
        "description": "This is a meeting",
        "start": {
            "dateTime": "2023-05-01T09:00:00",
            "timeZone": "America/Los_Angeles"
        },
        "end": {
            "dateTime": "2023-05-01T10:00:00",
            "timeZone": "America/Los_Angeles"
        },
        "guests": ["user1@example.com", "user2@example.com"],
    }
}
```

#### Example Response Success Code 201
```
{
    event_id: "1234567890"
}
```

#### Example Response Error Code 500
```
{
    message: "Internal Server Error"
}
```

### Delete Room Reservation

This endpoint cancels a room reservation for a given event ID. This endpoint is protected by user authentication and authorization.

#### Endpoint
```
DELETE /rooms/reservation/{event_id}
```

#### Example Request Body
```
{
    email: "user@andrew.cmu.edu",
    google_auth_token: "valid_oauth_token",
    privilege: "1"
}
```

#### Example Response Success Code 200
```
Nothing will be returned.
```

#### Example Response Error Code 500
```
{
    message: "Internal Server Error"
}
```




## EVENT SERVICE

The Event Service allows users to create, finalize, delete, and get events. Users can create events and finalize them by sending out emails to guests and saving them to the database. Users can also delete events by their ID and get events from the database based on their privilege.

### Dependencies

1. fastapi: A modern, fast web framework for building APIs with Python.
2. pydantic: A data validation and settings management library.
3. starlette: A lightweight ASGI framework/toolkit for building high-performance asyncio services.


### Create Events
This endpoint creates an event for the user. If there are no errors, it returns the event model that was created with status code 201. If there is an error, it returns the error message in a JSON object with status code 500.

#### Endpoint
```
POST /events
```

#### Request Body
```
{
    email: str,
    privilege: str,
    start_time: str,
    end_time: str,
    title: str,
    description: Optional[str],
    guests: Optional[str],
    room: str,
    room_url: str
}
```

#### Response Success Code 201
```
Returns the event model that was created.
```
#### Example Response Error Code 500
```
{
    message: "Internal Server Error"
}
```

### Finalize Events

This endpoint finalizes an event by sending out the emails to the guests and saving the event in the database. If there are no errors, it returns with status code 200 and the success message. If there is an error, it returns the error message in a JSON object with status code 500.

#### Endpoint

```
PUT /events/finalize
```

#### Request Body
```
{
    room: str,
    event_id: str,
    event: dict,
    google_auth_token: str,
    email: str,
    privilege: str
}
```

#### Response Success Code 200
```
success
```

#### Response Error Code 500
```
{
    message: "Internal Server Error"
}
```

### Get Events

This endpoint gets all the events from the database based on the privilege. If there are no errors, it returns with status code 200 and the list of events based on the privilege. For students, it would only return events from other students. For the other privileges, it will return the entire list of events from the time it was called. If there is an error, it returns the error message in a JSON object with status code 500.

#### Endpoint
```
GET /events
```

#### Request Body
```
{
    privilege: str
}
```

#### Response Success Code 200
```
[
    {
        id: int,
        title: str,
        description: Optional[str],
        start_time: str,
        end_time: str,
        guests: Optional[str],
        room: str,
        room_url: str,
        email: str,
        created_at: str
    },
    {...},
    {...},
    ...
]
```

#### Response Error Code 500
```
{
    message: "Internal Server Error"
}
```

### Delete Events

This endpoint deletes the event with the given event_id from the database.

#### Endpoint
```
DELETE /events/{event_id}
```

#### Example Request
```
DELETE /events/12345678
```

#### Example Reponse Success Code 200
```
success
```

#### Response Error Code 500
```
{
    message: "Internal Server Error"
}
```

## ADMIN SERVICE

The Admin Service allows administrators to manage users by changing their privilege levels. It also allows the administrators to delete users.

### Dependencies

1. fastapi: A Python web framework used to build the API endpoints.
2. uvicorn: A lightning-fast ASGI server for running the FastAPI application.

### Get Users

This endpoint returns a list of all the users.

#### Endpoint

```
GET /admin/users
```

#### Response
```
{
   users: [
      {
         "username": "user1",
         "email": "user1@andrew.cmu.edu",
         "privilege": "ADMIN"
      },
      {
         "username": "user2",
         "email": "user2@andrew.cmu.edu",
         "privilege": "STAFF"
      },
      {
         "username": "user3",
         "email": "user3@andrew.cmu.edu",
         "privilege": "USER"
      },
      ...
   ]
}
```

### Delete User

This endpoint deletes a user with the given email address.

#### Endpoint
```
DELETE /admin/users
```

#### Example Request
```
{
   target_user_email: "user1@andrew.cmu.edu"
}
```

#### Response Success Code 200
```
{
   message: "User deleted"
}
```

#### Response Error Code 500
```
{
   message: "Error deleting user"
}
```

### Update User Privilege

This endpoint updates a user's privilege between USER, STAFF or ADMIN with the given email address.

#### Endpoint
```
PUT /admin/users/privilege
```

#### Example Request
```
{
   target_user_email: "user2@andrew.cmu.edu",
   privilege: "ADMIN"
}
```

#### Response Success Code 200
```
{
   user: "user2@andrew.cmu.edu",
   privilege: "ADMIN"
}
```

#### Response Error Code 500
```
{
   message: "Error updating user privilege"
}
```


