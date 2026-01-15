# snippets/serializers.py

from rest_framework import serializers
from .models import Snippet, SnippetSection
from django.contrib.auth import get_user_model

User = get_user_model()


class SnippetSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SnippetSection
        fields = ['id', 'order', 'title', 'description', 'code', 'language']
        
    def validate_title(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Section title must be at least 2 characters long')
        return value
    
    def validate_code(self, value):
        if len(value.strip()) == 0:
            raise serializers.ValidationError('Section code cannot be empty')
        return value


class SnippetSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    sections = SnippetSectionSerializer(many=True, required=False)

    class Meta:
        model = Snippet
        fields = [
            'id',
            'title',
            'description',
            'code',
            'language',
            'visibility',
            'author',
            'author_id',
            'author_username',
            'created_at',
            'updated_at',
            'sections',
        ]
        read_only_fields = ['id', 'author', 'author_id', 'author_username', 'created_at', 'updated_at']

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError('Title must be at least 3 characters long')
        return value
    
    def validate(self, data):
        # Either main code or sections must be present
        code = data.get('code', '').strip()
        sections = data.get('sections', [])
        
        if not code and not sections:
            raise serializers.ValidationError('Snippet must have either code or sections')
        
        return data
    
    def create(self, validated_data):
        sections_data = validated_data.pop('sections', [])
        snippet = Snippet.objects.create(**validated_data)
        
        # Create sections
        for section_data in sections_data:
            SnippetSection.objects.create(snippet=snippet, **section_data)
        
        return snippet
    
    def update(self, instance, validated_data):
        sections_data = validated_data.pop('sections', None)
        
        # Update snippet fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update sections if provided
        if sections_data is not None:
            # Delete existing sections
            instance.sections.all().delete()
            
            # Create new sections
            for section_data in sections_data:
                SnippetSection.objects.create(snippet=instance, **section_data)
        
        return instance