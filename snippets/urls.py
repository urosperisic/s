# snippets/urls.py

from django.urls import path

from .views import (
    CreateSnippetView,
    DeleteSnippetView,
    MySnippetsView,
    PublicSnippetsView,
    SnippetDetailView,
    UpdateSnippetView,
)

urlpatterns = [
    path('', CreateSnippetView.as_view(), name='create_snippet'),
    path('my/', MySnippetsView.as_view(), name='my_snippets'),
    path('public/', PublicSnippetsView.as_view(), name='public_snippets'),
    path('<int:id>/', SnippetDetailView.as_view(), name='snippet_detail'),
    path('<int:id>/update/', UpdateSnippetView.as_view(), name='update_snippet'),
    path('<int:id>/delete/', DeleteSnippetView.as_view(), name='delete_snippet'),
]
