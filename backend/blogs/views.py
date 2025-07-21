# blogs/views.py
from rest_framework import generics, viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Blog, Comment, Vote
from .serializers import BlogCardSerializer, BlogDetailSerializer, CommentSerializer

class BlogCardListView(generics.ListAPIView):
    queryset = Blog.objects.all().order_by('-upload_date')
    serializer_class = BlogCardSerializer

class BlogDetailView(generics.RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogDetailSerializer
    lookup_field = 'pk'

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer

@api_view(['POST'])
def submit_vote(request):
    user_session_id = request.data.get('user_session_id')
    blog_id = request.data.get('blog_id')
    vote_type = request.data.get('vote_type')

    if not all([user_session_id, blog_id, vote_type]):
        return Response({"error": "Missing data"}, status=status.HTTP_400_BAD_REQUEST)

    vote, created = Vote.objects.update_or_create(
        user_session_id=user_session_id,
        blog_id=blog_id,
        defaults={'vote_type': vote_type}
    )
    return Response({'status': 'vote saved'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def undo_vote(request):
    user_session_id = request.data.get('user_session_id')
    blog_id = request.data.get('blog_id')

    vote = get_object_or_404(Vote, user_session_id=user_session_id, blog_id=blog_id)
    vote.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)