# blogs/views.py
from rest_framework import generics, viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Blog, Comment, Vote
from .serializers import BlogCardSerializer, BlogDetailSerializer, CommentSerializer, VoteSerializer

# --- View for the Homepage Blog Cards ---
class BlogCardListView(generics.ListAPIView):
    queryset = Blog.objects.all().order_by('-upload_date')
    serializer_class = BlogCardSerializer

# --- View for a Single, Detailed Blog Post ---
class BlogDetailView(generics.RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogDetailSerializer
    lookup_field = 'pk'

# --- ViewSet for Comments ---
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer

    # This custom logic filters comments based on the blog_id from the URL
    def get_queryset(self):
        queryset = super().get_queryset()
        blog_id = self.request.query_params.get('blog_id')
        if blog_id is not None:
            # The field on the Comment model is 'blog', so we filter by 'blog_id'
            queryset = queryset.filter(blog_id=blog_id)
        return queryset

# --- API Views for Votes ---

@api_view(['GET'])
def get_vote_counts(request, blog_id):
    """
    Calculates and returns the number of likes and dislikes for a given blog_id.
    """
    likes = Vote.objects.filter(blog_id=blog_id, vote_type=1).count()
    dislikes = Vote.objects.filter(blog_id=blog_id, vote_type=-1).count()
    return Response({'likes': likes, 'dislikes': dislikes})


@api_view(['POST'])
def submit_vote(request):
    """
    Manually handles creating or updating a vote to bypass
    the default serializer's unique_together validation.
    """
    # Manually get the data from the request
    user_session_id = request.data.get('user_session_id')
    blog_id = request.data.get('blog_id')
    vote_type = request.data.get('vote_type')

    # Basic validation to ensure all data is present
    if not all([user_session_id, blog_id, vote_type]):
        return Response({"error": "Missing data"}, status=status.HTTP_400_BAD_REQUEST)

    # Use update_or_create to either create a new vote or update an existing one
    vote, created = Vote.objects.update_or_create(
        user_session_id=user_session_id,
        blog_id=blog_id,
        # 'defaults' contains the fields to update if the record is found
        defaults={'vote_type': vote_type}
    )

    return Response({'status': 'vote saved'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def undo_vote(request):
    """
    Finds and deletes a user's vote for a blog post.
    """
    user_session_id = request.data.get('user_session_id')
    blog_id = request.data.get('blog_id')

    # Find the specific vote to delete
    vote = get_object_or_404(Vote, user_session_id=user_session_id, blog_id=blog_id)
    vote.delete()
    
    return Response({"detail": "Vote deleted successfully."}, status=status.HTTP_204_NO_CONTENT)