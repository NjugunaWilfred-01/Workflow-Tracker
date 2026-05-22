from ninja import Schema
from typing import Optional
from datetime import datetime
from uuid import UUID


# Input Schemas
class ApplicationCreateSchema(Schema):
    application_type: str
    applicant_name: str
    applicant_email: str
    amount_requested: Optional[float] = None
    description: Optional[str] = ""


class ApplicationUpdateSchema(Schema):
    application_type: Optional[str] = None
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    amount_requested: Optional[float] = None
    description: Optional[str] = None


class ApplicationSubmitSchema(Schema):
    pass  # No fields needed for submission


class ReviewStartSchema(Schema):
    reviewer_name: str


class ReviewDecisionSchema(Schema):
    decision: str  # 'approved', 'rejected', 'need_more_info'
    reviewer_comment: Optional[str] = ""


# Output Schema
class ApplicationOutSchema(Schema):
    id: int
    tracking_number: UUID
    application_type: str
    applicant_name: str
    applicant_email: str
    amount_requested: Optional[float]
    description: str
    status: str
    reviewer_name: str
    reviewer_comment: str
    created_at: datetime
    updated_at: datetime
    submitted_at: Optional[datetime]
    reviewed_at: Optional[datetime]
