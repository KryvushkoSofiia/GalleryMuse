from flask_wtf import FlaskForm
from wtforms.validators import DataRequired, NumberRange, Length
from wtforms import StringField, IntegerField, BooleanField, SubmitField
from app.models import Review

class ReviewForm(FlaskForm):

    review = StringField('review', validators=[DataRequired(), Length(min=4, max=1000, message="Review must be between 4 and 1000 characters")])
    star_rating = IntegerField('star_rating', validators=[DataRequired(), NumberRange(min=1, max=5, message='Galleries can only be rated 1-5 stars')])
    submit = SubmitField('submit')
