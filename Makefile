# Shortcuts for running Gday Punch Web App

gui:
	cd gdaypunchwebapp/gdaypunchreact && yarn && yarn run dev

prodgui:
	cd gdaypunchwebapp/gdaypunchreact && yarn && yarn run build

watchgui:
	cd gdaypunchwebapp/gdaypunchreact && yarn && yarn run devwatch

deletemigrations:
	cd gdaypunchbackend/gdaypunchapi/migrations && find . ! -name __init__.py -maxdepth 1 -type f -delete

deletedb:
	rm db.sqlite3

dev:
	python -m venv venv && source venv/bin/activate && brew services start postgresql

build:
	pip install --user -r requirements.txt 

env: dev build

migrate:
	DEVENV=development python manage.py migrate

makemigrations:
	DEVENV=development python manage.py makemigrations 

static:
	DEVENV=development python manage.py collectstatic --noinput

migrations: makemigrations migrate

server:
	DEVENV=development python manage.py runserver 0.0.0.0:8000

resetdb: deletemigrations deletedb makemigrations migrate

app: gui	dev build migrate	server

dockerapp: gui build migrate	server

ebdeploy: 
	eb deploy

predeploy: prodgui static	ebdeploy