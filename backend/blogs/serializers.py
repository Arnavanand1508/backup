# blogs/serializers.py
from rest_framework import serializers
from .models import Blog, Comment, Vote

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'blog_id', 'author_name', 'text', 'created_at']

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user_session_id', 'blog_id', 'vote_type']

# Serializer for the homepage cards, now with rating
class BlogCardSerializer(serializers.ModelSerializer):
    # 'rating' is a read-only field calculated by the model's property
    rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'blog_image', 'upload_date', 'rating']

# Serializer for the detailed blog view, now with all fields
class BlogDetailSerializer(serializers.ModelSerializer):
    # Use the CommentSerializer to nest comments within the blog detail
    comments = CommentSerializer(many=True, read_only=True)
    
    # These are read-only fields calculated by properties on the Blog model
    likes = serializers.IntegerField(read_only=True)
    dislikes = serializers.IntegerField(read_only=True)
    rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Blog
        # Include all fields from the Blog model, plus nested comments and vote data
        fields = [
            'id', 'title', 'description', 'main_content', 'blog_image',
            'upload_date', 'author_name', 'author_image', 'about_author',
            'likes', 'dislikes', 'rating', 'comments'
        ]