from app.models import db, Gallery, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
import random
from app.api.aws_helpers import upload_file_to_s3

fake = Faker()

real_image_urls = [
    "https://d1nn9x4fgzyvn4.cloudfront.net/migration-slide-image/SC270875.jpg",
    "https://hips.hearstapps.com/ver.h-cdn.co/assets/15/38/1024x512/landscape-1442432299-worlds-best-museums-05.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/general-view-of-pablo-picasso-room-at-the-reina-sofia-news-photo-1654532568.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/an-outdoors-display-is-shown-at-the-apartheid-museum-news-photo-1654116723.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/paulista-avenue-royalty-free-image-1654541004.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/visitors-look-at-works-of-art-by-henri-matisse-12-august-news-photo-1654526366.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/the-national-art-center-in-tokyo-1592846260.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/this-photograph-shows-a-general-view-of-the-exterior-of-the-news-photo-847309490-1556919039.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/the-national-gallery-of-canada-in-ottawa-with-louise-news-photo-590497089-1556919270.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/view-of-west-side-of-switch-house-switch-house-at-tate-news-photo-929454378-1556919204.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/gettyimages-455108478-1499380731.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/the-mauritshuis-museum-binnenhof-and-high-rise-buildings-news-photo-955563104-1556919497.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/kunsthistorisches-museum-vienna-austria-news-photo-558025575-1556919769.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/san-francisco-museum-of-modern-art-also-known-as-sfmoma-news-photo-173456034-1556919882.jpg",
    "https://hips.hearstapps.com/ver.h-cdn.co/assets/15/38/worlds-best-museums-02.jpg",
    "https://hips.hearstapps.com/ver.h-cdn.co/assets/15/38/1024x682/worlds-best-museums-03.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/museo-rafael-larco-in-lima-peru-news-photo-1141450507-1556919360.jpg",
    "https://hips.hearstapps.com/ver.h-cdn.co/assets/15/38/1024x682/worlds-best-museums-23.jpg",
    "https://hips.hearstapps.com/ver.h-cdn.co/assets/15/38/worlds-best-museums-04.jpg",
    "https://hips.hearstapps.com/ver.h-cdn.co/assets/15/38/1024x696/worlds-best-museums-09.jpg",
]


def seed_galleries(num_galleries=20):
    for _ in range(num_galleries):
        owner_id = random.randint(1, 20)
        title = fake.sentence()[:50]
        description = fake.paragraph()
        location = fake.city()

        # Choose a real image URL for seeding
        gallery_img = random.choice(real_image_urls)

        gallery = Gallery(
            owner_id=owner_id,
            title=title,
            description=description,
            location=location,
            gallery_img=gallery_img,
        )
        db.session.add(gallery)

    db.session.commit()


def undo_galleries():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.galleries RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM galleries"))

    db.session.commit()
