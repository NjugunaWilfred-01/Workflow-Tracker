"""
URL configuration for workflow_project project.
"""
from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from applications.api import router as applications_router

api = NinjaAPI()
api.add_router("", applications_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
