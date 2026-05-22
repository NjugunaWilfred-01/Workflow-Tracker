from django.db import models
import uuid
from django.utils import timezone


class Application(models.Model):
    """
    Application model for tracking workflow states
    """
    class ApplicationType(models.TextChoices):
        LOAN = 'Loan', 'Loan'
        CREDIT_CARD = 'Credit Card', 'Credit Card'
        MORTGAGE = 'Mortgage', 'Mortgage'
    
    class Status(models.TextChoices):
        DRAFT = 'Draft', 'Draft'
        SUBMITTED = 'Submitted', 'Submitted'
        IN_REVIEW = 'In Review', 'In Review'
        NEED_MORE_INFO = 'Need More Information', 'Need More Information'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'
    
    # Primary fields
    tracking_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    application_type = models.CharField(max_length=20, choices=ApplicationType.choices)
    applicant_name = models.CharField(max_length=255)
    applicant_email = models.EmailField()
    amount_requested = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True)
    
    # Status and workflow fields
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.DRAFT)
    
    # Reviewer fields
    reviewer_name = models.CharField(max_length=255, blank=True)
    reviewer_comment = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.tracking_number} - {self.applicant_name} ({self.status})"
