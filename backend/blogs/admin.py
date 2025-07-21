# blogs/admin.py
from django.contrib import admin
from .models import Blog

# Keep this line
admin.site.register(Blog)