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

loaddata:
	# python manage.py loaddata authorsFixture && python manage.py loaddata booksFixture
	
server:
	python manage.py runserver

app: gui	dev	build	migrate	loaddata	server