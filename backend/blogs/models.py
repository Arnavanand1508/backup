# blogs/models.py
from django.db import models
from ckeditor.fields import RichTextField
from datetime import date

class Blog(models.Model):
    # ... your Blog model fields ...
    title = models.CharField(max_length=255)
    description = models.TextField(help_text="A short description for the blog card.")
    main_content = RichTextField(help_text="The full article content.")
    blog_image = models.ImageField(upload_to='blog_images/')
    publish_date = models.DateField(
        default=date.today,
        help_text="The date the blog post is published."
    )
    author_name = models.CharField(max_length=255, default='Admin')
    author_image = models.ImageField(upload_to='author_images/')
    about_author = models.TextField()

    @property
    def likes(self):
        return self.votes.filter(vote_type=1).count()

    @property
    def dislikes(self):
        return self.votes.filter(vote_type=-1).count()

    def __str__(self):
        return self.title

class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    author_name = models.CharField(max_length=100)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    # MODIFIED: Added a default value to handle existing rows
    user_session_id = models.CharField(max_length=255, default='')

    def __str__(self):
        return f"Comment by {self.author_name} on {self.blog.title}"

class Vote(models.Model):
    # ... your Vote model fields ...
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='votes')
    user_session_id = models.CharField(max_length=255)
    vote_type = models.SmallIntegerField(choices=[(1, 'Like'), (-1, 'Dislike')])

    class Meta:
        unique_together = ('user_session_id', 'blog')

    def __str__(self):
        return f"Vote by {self.user_session_id} on {self.blog.title}"