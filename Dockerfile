# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.7-buster

# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1

#Install nginx
RUN apt-get update && apt-get install nginx vim -y --no-install-recommends
COPY nginx.default /etc/nginx/sites-available/default
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

#Install yarn
RUN apt-get update && apt-get -y install sudo
RUN apt-get install curl
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt update
RUN sudo apt -y install yarn

#Create root directory for our project in the container
RUN mkdir -p /opt/app
RUN mkdir -p /opt/app/pip_cache
RUN mkdir -p /opt/app/gdaypunchbackend
RUN mkdir -p /opt/app/gdaypunchwebapp

#Copy app contents to root directory
RUN sudo /opt/elasticbeanstalk/bin/get-config environment --output yaml | sed -n '1!p' | sed -e 's/^\(.*\): /\1=/g' | sed -e 's/^/export /' > env.sh; source env.sh
COPY requirements.txt start-server.sh Makefile manage.py /opt/app/
COPY gdaypunchbackend /opt/app/gdaypunchbackend/
COPY gdaypunchwebapp /opt/app/gdaypunchwebapp/

WORKDIR /opt/app/gdaypunchwebapp/gdaypunchreact
RUN	yarn && yarn run dev

#Navigate to root
WORKDIR /opt/app

#Install requirements and migrate
RUN pip install -r requirements.txt
RUN python manage.py migrate --noinput

#Change root permissions
RUN chown -R www-data:www-data /opt/app

# Expose port 8000 to other containers
EXPOSE 8020
STOPSIGNAL SIGTERM
CMD ["/opt/app/start-server.sh"]