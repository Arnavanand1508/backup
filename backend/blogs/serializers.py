# blogs/serializers.py
from rest_framework import serializers
from .models import Blog, Comment, Vote
from django.contrib.auth.models import User

class BlogCardSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField() # ADDED: Method field for comment count

    class Meta:
        model = Blog
        # MODIFIED: Added 'author_image' and 'comments_count' to the fields list
        fields = ['id', 'title', 'description', 'blog_image', 'publish_date', 'author_name', 'author_image', 'likes', 'dislikes', 'comments_count']

    def get_likes(self, obj):
        return Vote.objects.filter(blog=obj, vote_type=1).count()

    def get_dislikes(self, obj):
        return Vote.objects.filter(blog=obj, vote_type=-1).count()

    def get_comments_count(self, obj): # ADDED: Method to get comment count
        return obj.comments.count()


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'blog', 'author_name', 'text', 'created_at', 'user_session_id']
        read_only_fields = ['user_session_id']


class BlogDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField() # ADDED: Also add to detail serializer for consistency

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'main_content', 'blog_image', 'publish_date',
            'author_name', 'author_image', 'about_author', 'comments',
            'likes', 'dislikes', 'comments_count' # MODIFIED: Added 'comments_count'
        ]

    def get_likes(self, obj):
        return Vote.objects.filter(blog=obj, vote_type=1).count()

    def get_dislikes(self, obj):
        return Vote.objects.filter(blog=obj, vote_type=-1).count()

    def get_comments_count(self, obj): # ADDED: Method to get comment count
        return obj.comments.count()
