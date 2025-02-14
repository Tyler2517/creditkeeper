# credit_tracker/load_all_fixtures.py
import os
from django.core.management import call_command
from django.core.wsgi import get_wsgi_application

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'credit_tracker.settings')
application = get_wsgi_application()

def load_fixtures():
    fixtures_dir = os.path.join(os.path.dirname(__file__), 'customers', 'fixtures')
    fixtures = [f for f in os.listdir(fixtures_dir) if f.endswith('.json')]
    
    for fixture in fixtures:
        fixture_path = os.path.join(fixtures_dir, fixture)
        print(f'Loading fixture: {fixture_path}')
        call_command('loaddata', fixture_path)

if __name__ == '__main__':
    load_fixtures()