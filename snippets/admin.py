# snippets/admin.py

from django.contrib import admin
from .models import Snippet, SnippetSection


class SnippetSectionInline(admin.TabularInline):
    model = SnippetSection
    extra = 1
    fields = ('order', 'title', 'language', 'description', 'code')


@admin.register(Snippet)
class SnippetAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'language', 'visibility', 'created_at', 'has_sections')
    list_filter = ('language', 'visibility', 'created_at')
    search_fields = ('title', 'description', 'author__username')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [SnippetSectionInline]
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'description', 'author')
        }),
        ('Main Code (Optional if using sections)', {
            'fields': ('code', 'language')
        }),
        ('Settings', {
            'fields': ('visibility',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def has_sections(self, obj):
        return obj.sections.count() > 0
    has_sections.boolean = True
    has_sections.short_description = 'Sections'


@admin.register(SnippetSection)
class SnippetSectionAdmin(admin.ModelAdmin):
    list_display = ('snippet', 'order', 'title', 'language')
    list_filter = ('language',)
    search_fields = ('title', 'snippet__title')
    ordering = ('snippet', 'order')