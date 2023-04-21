from datetime import datetime

from eventService.handler.models.eventBuilder import EventBuilder
from eventService.handler.gmailAdapter import GmailAdapter

from eventService.dao.eventDao import EventDao

DATE_TIME_FORMAT = '%a %b %d %Y %H:%M:%S GMT %z'


class EventHandler:
    def __init__(self):
        self.event = None
        self.room = None
        self.adaptor = GmailAdapter()
        self.dao = EventDao()

    def create_event(self, request):
        event_builder = EventBuilder()
        event_builder\
            .set_creator(request.email)\
            .set_summary(request.title)\
            .set_start_time(datetime.strptime(request.start_time, DATE_TIME_FORMAT))\
            .set_end_time(datetime.strptime(request.end_time, DATE_TIME_FORMAT))

        # room = RoomDao().getRoomByName(request.room)
        room_calendar_email = request.room_url.split('=')[1]
        event_builder.add_room_as_guest(room_calendar_email)

        if request.description:
            event_builder.set_description(request.description)

        if request.guests:
            guests = request.guests.split(',')
            if len(guests) > 0:
                # add guests
                for guest in guests:
                    event_builder.add_guest(guest)

        if request.isStudent:
            event_builder.set_visibility('public')
        else:
            event_builder.set_visibility('default')

        self.event = event_builder.build()

        return self.event

    def finalize_event(self, request):
        self.event = request.event
        self.room = request.room

        event = self.save_event()

        if event:
            return self.adaptor.send_emails(request.event, request.google_auth_token, self.room)

    def save_event(self):
        return self.dao.save(self.event, self.room)

    def get_events(self):
        return self.dao.get_events()

    def get_event_by_id(self, event_id):
        return self.dao.get_event_by_id(event_id)

    def delete_event_by_id(self, event_id):
       self.dao.delete_event_by_id(event_id)