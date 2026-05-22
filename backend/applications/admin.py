from django.contrib import admin
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['tracking_number', 'applicant_name', 'application_type', 'status', 'created_at']
    list_filter = ['status', 'application_type', 'created_at']
    search_fields = ['applicant_name', 'applicant_email', 'tracking_number']
    readonly_fields = ['tracking_number', 'created_at', 'updated_at', 'submitted_at', 'reviewed_at']
