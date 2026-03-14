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

## Gday Punch Web App
![Gday Punch Web App](https://edmundo-dev-assets.s3.us-west-2.amazonaws.com/screenshots/gday-punch-webapp)

## Digital Manga(Book) Purchasing + Reader
![Digital manga details](https://edmundo-dev-assets.s3.us-west-2.amazonaws.com/screenshots/gday-punch-webapp-digital_manga_summary)

#Starting Gday Punch Web App

## Run Server and GUI
> `make app`

## Run Server
> `make server`

## Run GUI
> `make watchgui`

## Run Local Mail Server to test emails
> `make mailserver`
