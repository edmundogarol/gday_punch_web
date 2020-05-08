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
	python3 -m venv venv && source venv/bin/activate 
	
build:
	pip3 install -r requirements.txt 

migrate:
	python manage.py migrate

makemigrations:
	python manage.py makemigrations 

server:
	python manage.py runserver 0.0.0.0:8000

resetdb: deletemigrations deletedb makemigrations migrate

app: gui	migrate	server