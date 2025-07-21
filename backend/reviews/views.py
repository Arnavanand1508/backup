# reviews/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def create(self, request, *args, **kwargs):
        # This custom logic handles creating or updating a vote/comment
        user_session_id = request.data.get('user_session_id')
        blog_id = request.data.get('blog_id')

        if not user_session_id or not blog_id:
            return Response({"error": "user_session_id and blog_id are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Prepare data for the review
        defaults = {
            'author_name': request.data.get('author_name'),
            'text': request.data.get('text'),
            'vote_type': request.data.get('vote_type')
        }
        
        # Find existing review or create a new one
        obj, created = Review.objects.update_or_create(
            user_session_id=user_session_id,
            blog_id=blog_id,
            defaults=defaults
        )
        
        serializer = self.get_serializer(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)