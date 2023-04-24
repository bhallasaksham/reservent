from datetime import datetime

from eventService.handler.models.eventBuilder import EventBuilder
from eventService.handler.gmailAdapter import GmailAdapter

from eventService.dao.eventDao import EventDao

from database.schemas.userSchema import UserPrivilege

DATE_TIME_FORMAT = '%a %b %d %Y %H:%M:%S GMT %z'


class EventHandler:
    def __init__(self):
        self.adaptor = GmailAdapter()
        self.dao = EventDao()
        self.id = None
        self.event = None
        self.room = None
        self.privilege = None

    def create_event(self, request):
        """ Creates an event model using the builder pattern """
        event_builder = EventBuilder()
        event_builder\
            .set_creator(request.email)\
            .set_summary(request.title)\
            .set_start_time(datetime.strptime(request.start_time, DATE_TIME_FORMAT))\
            .set_end_time(datetime.strptime(request.end_time, DATE_TIME_FORMAT))

        # in order to keep the legacy functionality intact, we need to add the room as a guest for the event
        event_builder.add_room_as_guest(request.room_url)

        if request.description:
            event_builder.set_description(request.description)

        if request.guests:
            guests = request.guests.split(',')
            if len(guests) > 0:
                # add guests
                for guest in guests:
                    event_builder.add_guest(guest)

        if request.privilege == UserPrivilege.USER:
            # if the request is made by student, we need to make the event public so other students can see that the room is reserved
            event_builder.set_visibility('public')
        else:
            # on the contrary, for faculty and staff, we let the event appear on the calendar with default visibility
            event_builder.set_visibility('default')

        self.event = event_builder.build()

        return self.event

    def finalize_event(self, request):
        """ Finalizes the event by saving the event in the DB and calling the Gmail Adaptor to send out the emails """
        self.id = request.event_id
        self.event = request.event
        self.room = request.room
        self.privilege = int(request.privilege)

        event = self.save_event()

        if event:
            # if the event is finalized and save successfully in the DB
            return self.adaptor.send_emails(request.event, request.google_auth_token, self.room)

    def save_event(self):
        """ Saves an event in the DB """
        return self.dao.save(self.event, self.room, self.id, self.privilege)

    def get_events(self, privilege):
        """ Gets all the events based on the privilege """
        return self.dao.get_events(int(privilege))

    def delete_event_by_id(self, event_id):
        """ Deletes a given event from the DB """
        self.dao.delete_event_by_id(event_id)