from datetime import datetime


def get_datetime_from_time_string(time_string):
    return datetime.strptime(time_string, '%Y-%m-%dT%H:%M:%S%z')


def get_time_in_google_api_compatible_format(timestamp_str):
    timestamp_dt = datetime.strptime(timestamp_str, '%a %b %d %Y %H:%M:%S %Z %z')
    converted = timestamp_dt.strftime('%Y-%m-%dT%H:%M:%S%z')
    return converted
