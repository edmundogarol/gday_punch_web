#!/usr/bin/env bash
# start-server.sh
(cd gdaypunchbackend; PYTHONPATH=`pwd`/.. gunicorn gdaypunchbackend.wsgi:application www-data --bind 0.0.0.0:8010 --workers 3 --threads 1 --log-level debug) &
nginx -g "daemon off;"