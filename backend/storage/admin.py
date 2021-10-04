from django.contrib import admin
from .models import Image, Tag, User, Comment

# Register your models here.

admin.site.register(Image)
admin.site.register(Tag)
admin.site.register(User)
admin.site.register(Comment)
