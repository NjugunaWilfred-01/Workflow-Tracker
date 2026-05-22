from ninja import Router
from django.shortcuts import get_object_or_404
from django.utils import timezone
from typing import List
from .models import Application
from .schemas import (
    ApplicationCreateSchema,
    ApplicationUpdateSchema,
    ApplicationSubmitSchema,
    ReviewStartSchema,
    ReviewDecisionSchema,
    ApplicationOutSchema
)

router = Router()


@router.post("/applications", response=ApplicationOutSchema)
def create_application(request, payload: ApplicationCreateSchema):
    """Create a new application in Draft status"""
    application = Application.objects.create(
        application_type=payload.application_type,
        applicant_name=payload.applicant_name,
        applicant_email=payload.applicant_email,
        amount_requested=payload.amount_requested,
        description=payload.description or "",
        status=Application.Status.DRAFT
    )
    return application


@router.get("/applications", response=List[ApplicationOutSchema])
def list_applications(request):
    """List all applications"""
    return Application.objects.all()


@router.get("/applications/{application_id}", response=ApplicationOutSchema)
def get_application(request, application_id: int):
    """Get a single application by ID"""
    return get_object_or_404(Application, id=application_id)


@router.put("/applications/{application_id}", response=ApplicationOutSchema)
def update_application(request, application_id: int, payload: ApplicationUpdateSchema):
    """Update an application - only allowed in Draft or Need More Information status"""
    application = get_object_or_404(Application, id=application_id)
    
    # Workflow rule: Can only update if status is Draft or Need More Information
    if application.status not in [Application.Status.DRAFT, Application.Status.NEED_MORE_INFO]:
        return router.create_response(
            request,
            {"error": f"Cannot update application in {application.status} status"},
            status=400
        )
    
    # Update fields
    if payload.application_type is not None:
        application.application_type = payload.application_type
    if payload.applicant_name is not None:
        application.applicant_name = payload.applicant_name
    if payload.applicant_email is not None:
        application.applicant_email = payload.applicant_email
    if payload.amount_requested is not None:
        application.amount_requested = payload.amount_requested
    if payload.description is not None:
        application.description = payload.description
    
    application.save()
    return application


@router.post("/applications/{application_id}/submit", response=ApplicationOutSchema)
def submit_application(request, application_id: int, payload: ApplicationSubmitSchema):
    """Submit an application - changes status from Draft to Submitted"""
    application = get_object_or_404(Application, id=application_id)
    
    # Workflow rule: Can only submit if status is Draft
    if application.status != Application.Status.DRAFT:
        return router.create_response(
            request,
            {"error": f"Cannot submit application in {application.status} status"},
            status=400
        )
    
    application.status = Application.Status.SUBMITTED
    application.submitted_at = timezone.now()
    application.save()
    return application


@router.post("/applications/{application_id}/start-review", response=ApplicationOutSchema)
def start_review(request, application_id: int, payload: ReviewStartSchema):
    """Start review - changes status from Submitted to In Review"""
    application = get_object_or_404(Application, id=application_id)
    
    # Workflow rule: Can only start review if status is Submitted
    if application.status != Application.Status.SUBMITTED:
        return router.create_response(
            request,
            {"error": f"Cannot start review for application in {application.status} status"},
            status=400
        )
    
    application.status = Application.Status.IN_REVIEW
    application.reviewer_name = payload.reviewer_name
    application.save()
    return application


@router.post("/applications/{application_id}/decision", response=ApplicationOutSchema)
def make_decision(request, application_id: int, payload: ReviewDecisionSchema):
    """Make a review decision - Approve, Reject, or Need More Info"""
    application = get_object_or_404(Application, id=application_id)
    
    # Workflow rule: Can only make decision if status is In Review
    if application.status != Application.Status.IN_REVIEW:
        return router.create_response(
            request,
            {"error": f"Cannot make decision for application in {application.status} status"},
            status=400
        )
    
    # Validate decision
    decision = payload.decision.lower()
    if decision not in ['approved', 'rejected', 'need_more_info']:
        return router.create_response(
            request,
            {"error": "Invalid decision. Must be 'approved', 'rejected', or 'need_more_info'"},
            status=400
        )
    
    # Require comment for rejection or need more info
    if decision in ['rejected', 'need_more_info'] and not payload.reviewer_comment:
        return router.create_response(
            request,
            {"error": "Reviewer comment is required for rejection or requesting more information"},
            status=400
        )
    
    # Update application based on decision
    if decision == 'approved':
        application.status = Application.Status.APPROVED
    elif decision == 'rejected':
        application.status = Application.Status.REJECTED
    elif decision == 'need_more_info':
        application.status = Application.Status.NEED_MORE_INFO
    
    application.reviewer_comment = payload.reviewer_comment or ""
    application.reviewed_at = timezone.now()
    application.save()
    return application
