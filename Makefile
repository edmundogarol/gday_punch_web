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

stoppg:
	brew services stop postgresql@14 || true

dev:
	python3 -m venv venv && source venv/bin/activate && brew services start postgresql

predev: stoppg dev

build:
	python -m pip install --upgrade pip && python -m pip install -r requirements.txt && pip list

env: dev build

migrate:
	DEVENV=development python3 manage.py migrate

makemigrations:
	DEVENV=development python3 manage.py makemigrations 

static:
	DEPLOYENV=deployment python3 manage.py collectstatic --noinput 

migrations: makemigrations migrate

server:
	DEVENV=development python3 manage.py runserver 0.0.0.0:8000

mailserver:
	brew services start mailhog

stopmail:
	brew services stop mailhog

buildrun: env server

resetdb: deletemigrations deletedb makemigrations migrate

app: gui predev build migrate	server

dockerapp: gui build migrate	server

ebdeploy: 
	eb deploy

deploy: prodgui static	ebdeploy

deploybeupdates: prodgui build static ebdeploy