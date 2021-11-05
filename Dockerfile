# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.7-buster

# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1

#Install nginx
RUN apt-get update && apt-get install nginx vim -y --no-install-recommends
# COPY .platform/nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/gday.conf /etc/nginx/conf.d/gday.conf
COPY nginx/proxy.conf /etc/nginx/conf.d/proxy.conf
RUN chown -R root:root /etc/nginx/conf.d/proxy.conf
RUN chmod 755 /etc/nginx/conf.d/proxy.conf
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

#Install yarn
RUN apt-get update && apt-get -y install sudo
RUN apt-get -y install curl
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
COPY requirements.txt start-server.sh Makefile manage.py /opt/app/
COPY gdaypunchbackend /opt/app/gdaypunchbackend/
COPY gdaypunchwebapp /opt/app/gdaypunchwebapp/
COPY djangolog/django.log /var/log/django/

# WORKDIR /opt/app/gdaypunchwebapp/gdaypunchreact
# RUN	yarn && yarn run build

#Navigate to root
WORKDIR /opt/app

#Static files debug
# RUN ls gdaypunchbackend/public/static

#Install requirements and migrate - Cachebust db-config download to always pick up latest config
RUN pip install -r requirements.txt
ARG CACHEBUST=1
RUN aws s3 cp s3://gdaypunch-static/gday-db-config.json .
# RUN cat gday-db-config.json
RUN python manage.py migrate --noinput

#Collect Static
# RUN python manage.py migrate collectstatic

#Change root permissions
RUN chown -R www-data:www-data /opt/app

# Expose port 8000 to other containers
EXPOSE 8020
STOPSIGNAL SIGTERM
CMD ["/opt/app/start-server.sh"]