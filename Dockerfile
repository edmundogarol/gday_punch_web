# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.6

# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1

#Install yarn
RUN apt-get update && apt-get -y install sudo
RUN apt-get install curl
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt update
RUN sudo apt -y install yarn

# create root directory for our project in the container
RUN mkdir /gdaypunchweb

# Set the working directory to /gdaypunchweb
WORKDIR /gdaypunchweb

# Copy the current directory contents into the container at /gdaypunchweb
ADD . /gdaypunchweb/

# Expose port 8000 to other containers
EXPOSE 8000

# Install any needed packages specified in requirements.txt
RUN pip3 install -r requirements.txt