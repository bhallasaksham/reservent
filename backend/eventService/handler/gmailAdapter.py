import os
import base64

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.message import EmailMessage

from eventService.utils.datetime import get_email_datetime_from_string
from eventService.utils.constants import GMAIL_SCOPE, GMAIL_APP, GMAIL_VERSION

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID') or None
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET') or None
if GOOGLE_CLIENT_ID is None or GOOGLE_CLIENT_SECRET is None:
    raise BaseException('Missing env variables')

SCOPES = [GMAIL_SCOPE]

class GmailAdapter:
    @staticmethod
    def send_emails(event, google_auth_token, room):
        """ Sends the emails to the guest list using Gmail API"""

        try:
            user_info = {
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'refresh_token': google_auth_token,
            }
            creds = Credentials.from_authorized_user_info(info=user_info, scopes=SCOPES)
            service = build(GMAIL_APP, GMAIL_VERSION, credentials=creds)
            messages = []

            # send emails to all the guests in the guest list
            if event.get('guests', None):
                for guest in event['guests'][1:]:
                    # create the email message
                    message = EmailMessage()

                    # draft the content
                    msg_str = 'This is automated draft mail. You are invited to a google calendar event.'
                    if event.get('description', None):
                        msg_str += '\n\n' + event['description']

                    # format the timestamps based on the timezone
                    start = get_email_datetime_from_string(event['start']['dateTime'])
                    end = get_email_datetime_from_string(event['end']['dateTime'])

                    msg_str += '\n\nWhen:'
                    msg_str += '\n' + start + ' - ' + end

                    # add the location for the event
                    msg_str += '\n\nLocation:'
                    msg_str += '\n' + room

                    # add additional content
                    msg_str += '\n\nIf you have any questions or concerns, please do not hesitate to reach out to me at ' + event['creator'] + '.\n\nI look forward to seeing you.'
                    msg_str += '\n\nBest Regards!'
                    message.set_content(msg_str)

                    # populate the other required fields for EmailMessage()
                    message['To'] = guest['email']
                    message['from'] = event['creator']
                    message['Subject'] = event['summary']

                    # encode the message
                    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

                    create_message = {
                            'raw': encoded_message
                    }

                    # send the draft to the given guest
                    send_message = service.users().messages().send(userId=event['creator'], body=create_message).execute()

                    messages.append(send_message)

            return messages

        except HttpError as error:
            print(f'An error occurred: {error}')