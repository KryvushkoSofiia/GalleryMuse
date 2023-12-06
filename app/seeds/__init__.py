from flask.cli import AppGroup
from .users import seed_users, undo_users
from .galleries import seed_galleries, undo_galleries
from .reviews import seed_reviews, undo_reviews
from .galleries_favorites import seed_galleries_favorites, undo_galleries_favorites
from .visited_galleries import seed_visited_galleries, undo_visited_galleries
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_galleries()
        undo_reviews()
        undo_galleries_favorites()
        undo_visited_galleries()
    seed_users()
    seed_galleries()
    seed_reviews()
    seed_galleries_favorites()
    seed_visited_galleries()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_galleries()
    undo_reviews()
    undo_galleries_favorites()
    undo_visited_galleries()
    # Add other undo functions here
