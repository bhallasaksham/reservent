from datetime import datetime

from eventService.handler.models.eventBuilder import EventBuilder
from eventService.handler.gmailAdapter import GmailAdaptor

DATE_TIME_FORMAT = '%a %b %d %Y %H:%M:%S GMT %z'


class EventHandler:
    def __init__(self):
        self.event = None
        self.adaptor = GmailAdaptor()

    def create_event(self, request):
        event_builder = EventBuilder()
        event_builder\
            .set_creator(request.email)\
            .set_summary(request.title)\
            .set_description(request.description)\
            .set_start_time(datetime.strptime(request.start_time, DATE_TIME_FORMAT))\
            .set_end_time(datetime.strptime(request.end_time, DATE_TIME_FORMAT))\
            .add_guest(request.room + '-Meeting (6)')

        # add guests
        for guest in request.guests.split(','):
            event_builder.add_guest(guest)

        if request.isStudent:
            event_builder.set_visibility('public')
        else:
            event_builder.set_visibility('default')

        self.event = event_builder.build()

        return self.event

    async def finalize_event(self, request):
        drafts = await self.adaptor(request.event, request.google_auth_token)
        return drafts