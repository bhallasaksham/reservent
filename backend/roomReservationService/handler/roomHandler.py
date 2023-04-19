import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from ..dao import RoomDao
from ..utils.datetime import get_datetime_from_time_string, get_time_in_google_api_compatible_format

SCOPES = ['https://www.googleapis.com/auth/calendar']
TIMEZONE = 'America/Los_Angeles'
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID') or None
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET') or None
if GOOGLE_CLIENT_ID is None or GOOGLE_CLIENT_SECRET is None:
    raise BaseException('Missing env variables')

SCOPES = ['https://www.googleapis.com/auth/calendar']


class GetRoomsHandler:
    all_rooms: []
    available_rooms: []

    def __init__(self, request):
        self.all_rooms = RoomDao().initRooms()
        self.request = request

    def get_events_from_google_calendar(self, calendar_id):
        user_info = {
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'refresh_token': self.request.google_auth_token,
        }
        creds = Credentials.from_authorized_user_info(info=user_info, scopes=SCOPES)
        service = build('calendar', 'v3', credentials=creds)
        events_result = service.events().list(calendarId=calendar_id, timeMin=self.request.start_time, maxResults=1,
                                              singleEvents=True,
                                              orderBy='startTime').execute()
        return events_result['items']

    def is_room_available(self, room, event):
        start_dt = get_datetime_from_time_string(self.request.start_time)
        end_dt = get_datetime_from_time_string(self.request.end_time)
        event_start_dt = get_datetime_from_time_string(event['start']['dateTime'])
        room_availability_timediff = event_start_dt - start_dt
        room_requested_timediff = end_dt - start_dt
        if room_availability_timediff > room_requested_timediff and room.size >= int(self.request.num_guests):
            return True
        return False

    def get_rooms(self):
        self.request.start_time = get_time_in_google_api_compatible_format(self.request.start_time)
        self.request.end_time = get_time_in_google_api_compatible_format(self.request.end_time)
        for room in self.rooms:
            calendar_id = room.url.split('=')[1]
            events_list = self.get_events_from_google_calendar(calendar_id)
            for event in events_list:
                if self.is_room_available(room, event):
                    self.available_rooms.append(room)
        return self.available_rooms


class ReserveRoomHandler:
    def __init__(self, reservation):
        self.reservation = reservation

    # Function to create a new event
    def create_event(self):
        # Authenticate with Google Calendar API
        creds = Credentials.from_authorized_user_info(info=self.reservation.google_auth_token, scopes=SCOPES)
        service = build('calendar', 'v3', credentials=creds)

        # Calculate event start and end times
        start_time = get_time_in_google_api_compatible_format(self.reservation.start_time)
        end_time = get_time_in_google_api_compatible_format(self.reservation.end_time)

        # Create event object
        event = {
            'summary': self.reservation.title,
            'description': self.reservation.event_description,
            'start': {
                'dateTime': start_time,
                'timeZone': TIMEZONE,
            },
            'end': {
                'dateTime': end_time,
                'timeZone': TIMEZONE,
            },
            'attendees': [
                {'email': self.reservation.email},
                {'email': [{'email': email.strip()} for email in self.reservation.guest_email.split(',')]},
            ],
            'reminders': {
                'useDefault': True,
            },
        }

        # Call the Calendar API to create the event
        event = service.events().insert(calendarId='primary', body=event).execute()
        # TODO: insert event in google calendar of the room as well
        print(f'Event created: {event.get("htmlLink")}')
        return True;
