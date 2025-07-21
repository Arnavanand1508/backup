# reviews/models.py
from django.db import models
from blogs.models import Blog # Import the Blog model

class Review(models.Model):
    VOTE_CHOICES = [(1, 'Like'), (-1, 'Dislike')]

    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='reviews')
    user_session_id = models.CharField(max_length=255)
    
    # Fields for comments (can be blank)
    author_name = models.CharField(max_length=100, blank=True)
    text = models.TextField(blank=True)
    
    # Field for votes (can be null if it's only a comment)
    vote_type = models.SmallIntegerField(choices=VOTE_CHOICES, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensures one user can only leave one review (vote/comment) per blog
        unique_together = ('user_session_id', 'blog')

    def __str__(self):
        return f"Review by {self.author_name or self.user_session_id} on {self.blog.title}"