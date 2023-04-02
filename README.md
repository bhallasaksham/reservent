# RESERVENT - TEAM 6

## API Documentation

Please review the API Documentation [here](https://hackmd.io/@saksham-bhalla/S1pKJxBxn/edit).

## Architecture Haiku

Please review the Architecture Haiku [here](https://docs.google.com/document/d/1wtcVfIZTQdThSHfUntw8accwkPUaRFBS/edit?usp=sharing&ouid=116506808424154350020&rtpof=true&sd=true).

## UI Prototypes 

Please review the UI Design prototypes [here](https://www.figma.com/file/AhcHxAZcDttB2oJM5bDnmj/Untitled?node-id=0%3A1&t=zSJevP3CWC03RgGh-1).

## Git Workflow

Please do not directly push to main branch. We should follow the pull request workflow where all new changes are reviewed by at least one team member before and then merged with main. 
  - Make all changes on a local branch
  - Push branch to remote server
  - Create pull request and add all team members as reviewers
  - Pull request format can be 
    - Summary
    - Demo (if it is a UI change)
    - Notes (This is where you can share if there's a particular piece of code that requires an in-depth review or any pending tasks)
  - Wait for at-least 1 approving review before merging with main
  
Please review [Github Workflow](https://docs.github.com/en/get-started/quickstart/github-flow) for more details.
  
## Naming Convention

 Please follow the following naming conventions during the development process - 
 
### Branch Name
 
 - feature/my-new-feature  
 - bugfix/my-new-bugfix
 
### [Commit Message](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)

Format: `<type>(<scope>): <subject>`

- `feat`
- `fix`
- `docs`
- `chore`
- `refactor`
- ...
 
## Backend Setup

- To create a virtual environment, type `python3 -m venv env`
- To activate the virtual environment, go to the `backend` directory and type: `source env/bin/activate`
- Once the virtual environment is activated, run <s>`main.py`</s> to start the local server (run `sh run.sh` instead).
- Here's the list of services hosted through the backend server:
  - User Management Service: http://0.0.0.0:4000
  - Room Reservation Service: http://0.0.0.0:8000
  - Event Service: http://0.0.0.0:8080
  - Admin Service: http://0.0.0.0:9000

```
If you are facing error related with google auth, you may want to use the environment in /backend/requirements.txt
```

## Frontend Setup

1. `git clone` this repo and have `node.js` installed (should support v15 or later)
2. run following command

```
cd front-end
npm install
npm start
```

3. Front-end application: http://localhost:3000/

## Database Setup

- Host the database on the AWS account
- Host: `sda-s06.cozm4z1zuevq.us-east-1.rds.amazonaws.com`
- User: `postgres`
- Port: `5432`
- Password: `sda-s06123`
- Command line to connect the DB: 
```
psql -U postgres -p 5432 -h sda-s06.cozm4z1zuevq.us-east-1.rds.amazonaws.com -W
```
