# snippets/models.py

from django.conf import settings
from django.db import models


class Snippet(models.Model):
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('html', 'HTML'),
        ('css', 'CSS'),
        ('java', 'Java'),
        ('cpp', 'C++'),
        ('csharp', 'C#'),
        ('php', 'PHP'),
        ('ruby', 'Ruby'),
        ('go', 'Go'),
        ('rust', 'Rust'),
        ('sql', 'SQL'),
        ('bash', 'Bash'),
        ('other', 'Other'),
    ]

    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    code = models.TextField(blank=True)  # Make optional since sections can have code
    language = models.CharField(
        max_length=20, choices=LANGUAGE_CHOICES, default='python'
    )
    visibility = models.CharField(
        max_length=10, choices=VISIBILITY_CHOICES, default='public'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='snippets'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Snippet'
        verbose_name_plural = 'Snippets'

    def __str__(self):
        return f'{self.title} by {self.author.username}'


class SnippetSection(models.Model):
    snippet = models.ForeignKey(
        Snippet, on_delete=models.CASCADE, related_name='sections'
    )
    order = models.PositiveIntegerField(default=0)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    code = models.TextField()
    language = models.CharField(
        max_length=20, choices=Snippet.LANGUAGE_CHOICES, default='python'
    )

    class Meta:
        ordering = ['order']
        verbose_name = 'Snippet Section'
        verbose_name_plural = 'Snippet Sections'

    def __str__(self):
        return f'{self.snippet.title} - Section {self.order}: {self.title}'
