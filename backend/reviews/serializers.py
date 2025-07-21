from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'blog', 'user_session_id', 'author_name', 
            'text', 'vote_type', 'created_at'
        ]