from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, IntegerField, BooleanField, SubmitField
from wtforms.validators import DataRequired, NumberRange, Length
from app.api.aws_helpers import ALLOWED_EXTENSIONS
from app.models import Gallery


class GalleryForm(FlaskForm):
   
   title = StringField('title', validators=[DataRequired(), Length(min=6, max=50, message='Service Title must be between 6 and 50 characters')])
   description = StringField('description', validators=[DataRequired(), Length(min=1, max=1000, message='Service Description must be between 1 and 255 characters')])
   location = StringField('location city', validators=[DataRequired(), Length(min=5, max=255, message='Location must be between 5 and 255 characters')])
   status = BooleanField('visited')
   gallery_img = FileField("Image File", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
   submit = SubmitField('submit')
