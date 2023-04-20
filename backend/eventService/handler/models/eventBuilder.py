DATE_TIME_FORMAT = '%Y-%m-%dT%H:%M:%S%z'

class EventBuilder:
    def __init__(self):
        self.event = {}
    def set_creator(self, creator):
        self.event['creator'] = creator
        return self

    def set_summary(self, summary):
        self.event['summary'] = summary
        return self

    def set_description(self, description):
        self.event['description'] = description
        return self

    def set_start_time(self, start_time):
        start = start_time.strftime(DATE_TIME_FORMAT)
        self.event['start'] = {'dateTime': start}
        return self

    def set_end_time(self, end_time):
        end = end_time.strftime(DATE_TIME_FORMAT)
        self.event['end'] = {'dateTime': end}
        return self

    def add_room_as_guest(self, room_calendar_email):
        self.event['guests'] = []
        self.event['guests'].append({'email': room_calendar_email})
        return self

    def add_guest(self, email):
        self.event['guests'].append({'email': email})
        return self

    def set_visibility(self, visibility):
        self.event['visibility'] = visibility
        return self

    def build(self):
        return self.event