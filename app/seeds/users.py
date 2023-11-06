from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
import random

fake = Faker()


def seed_users(num_users=20):
    for _ in range(num_users):
        username = fake.user_name()
        email = fake.email()
        first_name = fake.first_name()
        last_name = fake.last_name()
        password = "password"
        profile_picture = f"https://example.com/profile/{random.randint(1, 100)}.jpg"

        user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            profile_picture=profile_picture,
        )
        db.session.add(user)

        demo = User(
            username="Demo",
            email="demo@aa.io",
            password="password",
            first_name="Demo",
            last_name="User",
            profile_picture="https://i.pinimg.com/564x/a8/57/00/a85700f3c614f6313750b9d8196c08f5.jpg",
        )
    db.session.add(demo)

    db.session.commit()

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
