# blogs/serializers.py
from rest_framework import serializers
from .models import Blog, Comment, Vote

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'blog', 'author_name', 'text', 'created_at']
        extra_kwargs = {'blog': {'write_only': True}}


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user_session_id', 'blog', 'vote_type']
        extra_kwargs = {'blog': {'write_only': True}}


class BlogCardSerializer(serializers.ModelSerializer):
    likes = serializers.IntegerField(read_only=True)
    class Meta:
        model = Blog
        fields = ['id', 'title', 'blog_image', 'upload_date', 'likes']


class BlogDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    likes = serializers.IntegerField(read_only=True)
    dislikes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'description', 'main_content', 'blog_image',
            'upload_date', 'author_name', 'author_image', 'about_author',
            'likes', 'dislikes', 'comments'
        ]