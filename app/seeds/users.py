from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
import random

fake = Faker()


def seed_users(num_users=20):
    # Replace these with real image URLs
   

    for i in range(num_users):
        username = fake.user_name()
        email = fake.email()
        first_name = fake.first_name()
        last_name = fake.last_name()
        password = "password"


        user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
        )
        db.session.add(user)

    # Adding the demo user separately (outside the loop)
    demo = User(
        username="Demo",
        email="demo@aa.io",
        password="password",
        first_name="Demo",
        last_name="User",
    )
    db.session.add(demo)

    db.session.commit()



def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
