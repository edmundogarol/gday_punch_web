# Shortcuts for running Gday Punch Web App

gui:
	cd gdaypunchwebapp/gdaypunchreact && yarn && yarn run dev

watchgui:
	cd gdaypunchwebapp/gdaypunchreact && yarn && yarn run devwatch

deletemigrations:
	cd gdaypunchbackend/gdaypunchapi/migrations && find . ! -name __init__.py -maxdepth 1 -type f -delete

deletedb:
	rm db.sqlite3

dev:
	python -m venv venv && source venv/bin/activate && brew services start postgresql

build:
	pip install -r requirements.txt 

env: dev build

migrate:
	DEVENV=development python manage.py migrate

makemigrations:
	DEVENV=development python manage.py makemigrations 

collectstatic:
	python manage.py collectstatic

migrations: makemigrations migrate

server:
	DEVENV=development python manage.py runserver 0.0.0.0:8000

resetdb: deletemigrations deletedb makemigrations migrate

app: gui	dev build migrate	server

dockerapp: gui build migrate collectstatic	server