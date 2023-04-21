from datetime import datetime

import pytz


def get_timestring_from_datetime(timestamp):
    pacific = pytz.timezone('US/Pacific')
    return timestamp.astimezone(pacific).strftime('%a %b %d %I:%M%p')

def get_email_datetime_from_string(str):
    pacific = pytz.timezone('US/Pacific')
    timestamp_formatted = datetime.strptime(str[:-5], '%Y-%m-%dT%H:%M:%S')
    return timestamp_formatted.astimezone(pacific).strftime('%a %b %d %I:%M%p')