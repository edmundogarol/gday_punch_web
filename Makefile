# Shortcuts for running Gday Punch Web App

gui:
	cd gdaypunchwebapp/gdaypunchreact && yarn && yarn run dev

watchgui:
	cd gdaypunchwebapp/gdaypunchreact && yarn && yarn run devwatch

dev:
	python3 -m venv venv && source venv/bin/activate 
	
build:
	pip3 install -r requirements.txt 

migrate:
	python manage.py migrate

server:
	python manage.py runserver 0.0.0.0:8000

guts: gui	migrate

app: gui	migrate	server