# blogs/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BlogCardListView,
    BlogDetailView,
    CommentViewSet,
    submit_vote,
    undo_vote
)

router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('blogs/', BlogCardListView.as_view(), name='blog-card-list'),
    path('blogs/<int:pk>/', BlogDetailView.as_view(), name='blog-detail'),
    path('votes/submit/', submit_vote, name='submit-vote'),
    path('votes/undo/', undo_vote, name='undo-vote'),
    path('', include(router.urls)),
]