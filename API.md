# API DOCUMENTATION

## USER MANAGEMENT SERVICE

This API provides user management services such as user authentication, user authorization, and obtaining user privilege level.

Authentication: This API uses OAuth 2.0 authentication for user login. The authentication token is stored in a secure HTTP-only cookie.

Authorization: This API uses JWT for user authorization. The JWT token is stored in a secure HTTP-only cookie.

Errors: This API returns errors in JSON format with the following keys: "message" and "error". The "message" key contains a user-friendly error message, while the "error" key contains the error details.

### Endpoints

#### Login

This endpoint redirects the user to the Google OAuth login page. After successful authentication, the user is redirected to the /auth endpoint.

##### Route
```
GET /login
```

##### Response
```
Redirect to Google OAuth login page.
```

#### Authentication

This endpoint handles the authentication callback from the Google OAuth server. It retrieves the user information and creates a JWT token for user authorization. It also creates a refresh token for the user and sets it in a cookie.

##### Route
```
GET /auth
```

##### Response

###### Success
```
Redirect to the frontend URL with cookies set.
```
###### Code 500 Error
```json
{
    message: "Error creating user"
}
```

##### Note
- [Firebase Documentation](https://firebase.google.com/docs/auth/web/google-signin)


#### Logout

This endpoint logs out the user by deleting the refresh token and JWT token cookies.

##### Route
```
GET /logout
```

##### Response

```json
{
    message: "Logged out successfully"
}
```

#### GET USER PRIVILEGE

This endpoint returns the user privilege level for a given email address. This endpoint is protected by user authentication and authorization.

##### Route
```
GET /users/privileges
```

##### Response

###### Code 200 Success
````json
{
    user: "user@andrew.cmu.edu",
    privilege: "admin"
}
````

###### Code 500 Error
````json
{
    message: "Error getting user privilege"
}
````

### Dependencies

1. fastapi: This is a high-performance web framework used for building APIs with Python 3.7+. It is used to create the API routes, handle incoming requests, and generate responses.

2. httpx: This is an HTTP client library for Python 3 that provides support for both synchronous and asynchronous APIs. It is used for making HTTP requests to the Google OAuth server.

3. google-auth: This is a Python library used for authenticating with Google APIs using OAuth 2.0. It provides utilities for making authentication requests and handling authentication tokens.

4. uvicorn: This is a lightning-fast ASGI server implementation that is used to run the fastapi application.

These dependencies can be installed by running:
```
pip install fastapi httpx google-auth uvicorn
```

## ROOM RESERVATION SERVICE

The Room Reservation Service API is a simple RESTful API that provides room reservation functionality.

Authentication: This API requires a valid Google OAuth 2.0 authentication token to be passed in the request body for all endpoints.

Authorization: This API uses user privileges to restrict access to certain endpoints. The privilege attribute must be passed in the request body for all endpoints.

Errors: This API returns errors in JSON format with the following keys: "message". The "message" key contains a user-friendly error message.

### Endpoints

#### Fetch Available Rooms

##### Route

```
GET /rooms/available
```

##### Example Request Body
```json
{
    email: "user@andrew.cmu.edu",
    google_auth_token: "valid_oauth_token",
    privilege: "1",
    start_time: "2023-05-01T09:00:00",
    end_time: "2023-05-01T12:00:00",
    num_guests: 4
}
```

##### Example Response
```json
{
    "available_rooms": [
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

#### Reserve Room

This endpoint reserves a room for a given time range and number of guests. This endpoint is protected by user authentication and authorization.

##### Route
```
POST /rooms/reserve
```

##### Example Request Body
```json
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

##### Example Response Success Code 201
```json
{
    event_id: "1234567890"
}
```

##### Example Response Error Code 500
```json
{
    message: "Internal Server Error"
}
```

#### Delete Room Reservation

This endpoint cancels a room reservation for a given event ID. This endpoint is protected by user authentication and authorization.

##### Route
```
DELETE /rooms/reservation/{event_id}
```

##### Example Request Body
```json
{
    email: "user@andrew.cmu.edu",
    google_auth_token: "valid_oauth_token",
    privilege: "1"
}
```

##### Example Response Success Code 200
```
Nothing will be returned.
```

##### Example Response Error Code 500
```json
{
    message: "Internal Server Error"
}
```

### Dependencies

1. fastapi: A modern, fast web framework for building APIs with Python.
2. pydantic: A data validation and settings management library.
3. google-auth: Library for Google OAuth2 authentication.
4. google-api-python-client: A library for accessing Google APIs.
5. typing: A module for supporting type hints.




