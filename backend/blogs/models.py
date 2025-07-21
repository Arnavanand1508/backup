# blogs/models.py
from django.db import models
from ckeditor.fields import RichTextField

class Blog(models.Model):
    # --- Fields for both Card and Detail View ---
    title = models.CharField(max_length=255)
    description = models.TextField(help_text="A short description for the blog card.")
    main_content = RichTextField(help_text="The full article content.")
    blog_image = models.ImageField(upload_to='blog_images/')
    upload_date = models.DateTimeField(auto_now_add=True)

    # --- Author Information ---
    author_name = models.CharField(max_length=255, default='Admin')
    author_image = models.ImageField(upload_to='author_images/')
    about_author = models.TextField()

    @property
    def likes(self):
        """Calculates the total number of likes for the blog."""
        return self.votes.filter(vote_type=1).count()

    @property
    def dislikes(self):
        """Calculates the total number of dislikes for the blog."""
        return self.votes.filter(vote_type=-1).count()

    @property
    def rating(self):
        """
        Calculates the rating on a 5-star scale based on likes and dislikes.
        """
        total_votes = self.likes + self.dislikes
        if total_votes == 0:
            return 0  # Default to 0 stars if no votes

        # Calculate the ratio of likes to total votes and scale to 5
        like_ratio = self.likes / total_votes
        return round(like_ratio * 5, 1)

    def __str__(self):
        return self.title

class Comment(models.Model):
    # Link to the specific blog post using a ForeignKey for relational integrity
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    author_name = models.CharField(max_length=100)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author_name} on {self.blog.title}"

class Vote(models.Model):
    # Link to the specific blog post
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='votes')
    # A unique identifier for the user, stored in the browser's localStorage
    user_session_id = models.CharField(max_length=255)
    # The type of vote: 1 for like, -1 for dislike
    vote_type = models.SmallIntegerField(choices=[(1, 'Like'), (-1, 'Dislike')])

    class Meta:
        # Ensures a user can only vote once per blog post
        unique_together = ('user_session_id', 'blog')

    def __str__(self):
        return f"Vote by {self.user_session_id} on {self.blog.title}"