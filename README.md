# Gday Punch Web App (Django REST Framework + React.JS)

Legacy Django REST Framework + React.JS Project (2020–2022)

This repository contains an older Django + React project that powered a production tool with multiple modules including:

- User authentication and permissions
- REST APIs
- Background processing
- Data reporting features
- Admin tools

The codebase reflects an earlier stage of my engineering career and contains some architectural decisions I would approach differently today.

I’ve included it here to demonstrate the scale of functionality implemented and my experience building full-stack Django systems.

If I were to rebuild this today, I would likely introduce:

- better service-layer separation
- improved test coverage
- async task processing (Celery / queues)
- modular app structure

Repository: `gday_punch_web`

![gday_punch_web_app](https://gdaypunch-resources.s3.ap-southeast-2.amazonaws.com/gday-punch-webapp.png)

#Starting Gday Punch Web App

## Run Server and GUI
> `make app`

## Run Server
> `make server`

## Run GUI
> `make watchgui`

## Run Local Mail Server to test emails
> `make mailserver`
