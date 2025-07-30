# blogs/admin.py
from django.contrib import admin
from .models import Blog, Comment, Vote

# This tells Django to show each model in the admin panel
admin.site.register(Blog)
admin.site.register(Comment)
admin.site.register(Vote)