# snippets/views.py

from rest_framework import generics, status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response

from .models import Snippet
from .serializers import SnippetSerializer


class CreateSnippetView(generics.CreateAPIView):
    serializer_class = SnippetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class MySnippetsView(generics.ListAPIView):
    serializer_class = SnippetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Snippet.objects.filter(author=self.request.user)


class PublicSnippetsView(generics.ListAPIView):
    serializer_class = SnippetSerializer
    permission_classes = [AllowAny]
    queryset = Snippet.objects.filter(visibility='public')


class SnippetDetailView(generics.RetrieveAPIView):
    serializer_class = SnippetSerializer
    permission_classes = [AllowAny]
    queryset = Snippet.objects.all()
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        snippet = self.get_object()

        # Check visibility
        if snippet.visibility == 'private' and snippet.author != request.user:
            return Response(
                {'detail': 'You do not have permission to view this snippet'},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(snippet)
        return Response(serializer.data)


class UpdateSnippetView(generics.UpdateAPIView):
    serializer_class = SnippetSerializer
    permission_classes = [IsAuthenticated]
    queryset = Snippet.objects.all()
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        snippet = self.get_object()

        # Check ownership
        if snippet.author != request.user:
            return Response(
                {'detail': 'You do not have permission to edit this snippet'},
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)


class DeleteSnippetView(generics.DestroyAPIView):
    serializer_class = SnippetSerializer
    permission_classes = [IsAuthenticated]
    queryset = Snippet.objects.all()
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        snippet = self.get_object()

        # Check ownership
        if snippet.author != request.user:
            return Response(
                {'detail': 'You do not have permission to delete this snippet'},
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().destroy(request, *args, **kwargs)
