import os
import base64
from datetime import datetime

import pytz
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.message import EmailMessage


GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID') or None
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET') or None
if GOOGLE_CLIENT_ID is None or GOOGLE_CLIENT_SECRET is None:
    raise BaseException('Missing env variables')

SCOPES = ['https://www.googleapis.com/auth/gmail.compose']

class GmailAdaptor:
    @staticmethod
    def send_emails(event, google_auth_token, room):
        try:
            user_info = {
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'refresh_token': google_auth_token,
            }
            creds = Credentials.from_authorized_user_info(info=user_info, scopes=SCOPES)
            service = build('gmail', 'v1', credentials=creds)
            messages = []
            if event.get('guests', None):
                for guest in event['guests'][1:]:
                    # create the email message
                    message = EmailMessage()
                    msg_str = 'This is automated draft mail. You are invited to a google calendar event.'
                    if event.get('description', None):
                        msg_str += '\n\n' + event['description']

                    # Parse the timestamp string
                    pacific = pytz.timezone('US/Pacific')
                    timestamp_start = event['start']['dateTime']
                    timestamp_start = datetime.strptime(timestamp_start[:-5], '%Y-%m-%dT%H:%M:%S')
                    start = timestamp_start.strftime('%a %b %d %I:%M%p')

                    timestamp_end = event['end']['dateTime']
                    timestamp_end = datetime.strptime(timestamp_end[:-5], '%Y-%m-%dT%H:%M:%S')
                    end = timestamp_end.astimezone(pacific).strftime('%a %b %d %I:%M%p')
                    msg_str += '\n\nWhen:'
                    msg_str += '\n' + start + ' - ' + end
                    msg_str += '\n\nLocation:'
                    msg_str += '\n' + room + '-Meeting (6)'
                    msg_str += '\n\nIf you have any questions or concerns, please do not hesitate to reach out to me at ' + event['creator'] + '.\n\nI look forward to seeing you.'
                    msg_str += '\n\nBest Regards!'
                    message.set_content(msg_str)
                    message['To'] = guest['email']
                    message['from'] = event['creator']
                    message['Subject'] = event['summary']

                    # encode the message
                    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

                    create_message = {
                            'raw': encoded_message
                        }
                    send_message = service.users().messages().send(userId=event['creator'], body=create_message).execute()
                    print(F'Message Id: {send_message["id"]}')

                    messages.append(send_message)

            return messages

        except HttpError as error:
            print(F'An error occurred: {error}')