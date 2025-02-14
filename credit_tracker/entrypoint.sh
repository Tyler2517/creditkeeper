#!/bin/sh
set -e

# Run migrations
python manage.py migrate

# Load data
python load_fixtures.py

# Run the server
exec "$@"