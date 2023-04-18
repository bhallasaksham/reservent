import os
import base64

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
    def send_emails(event, google_auth_token):
        try:
            user_info = {
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'refresh_token': google_auth_token,
            }
            creds = Credentials.from_authorized_user_info(info=user_info, scopes=SCOPES)
            service = build('gmail', 'v1', credentials=creds)
            drafts = []
            for guest in event['guests']:
                if 'Meeting' not in guest['email']:
                    # create the email message
                    message = EmailMessage()
                    message.set_content('This is automated draft mail. You are invited to a google calendar event. ' + event['description'])
                    message['To'] = guest['email']
                    message['from'] = event['creator']
                    message['Subject'] = event['summary']

                    # encode the message
                    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

                    create_message = {
                        'message': {
                            'raw': encoded_message
                        }
                    }
                    draft = service.users().drafts().create(userId=event['creator'],
                                                            body=create_message).execute()
                    print(F'Draft id: {draft["id"]}\nDraft message: {draft["message"]}')

                    drafts.append(draft)

            return drafts

        except HttpError as error:
            print(F'An error occurred: {error}')