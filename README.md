# Workflow Tracker - Application Management System

A full-stack application for managing workflow-based applications with state transitions, built with Django + Django Ninja (backend) and React (frontend).

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Activate virtual environment (already created):
```bash
source venv/bin/activate
```

3. Run migrations (already done):
```bash
python manage.py migrate
```

4. Start Django server:
```bash
python manage.py runserver
```
Backend runs at: `http://localhost:8000`
API Documentation: `http://localhost:8000/api/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```
Frontend runs at: `http://localhost:5173`

#Features

### Application Workflow States
1. **Draft** - Initial state, editable
2. **Submitted** - Submitted for review
3. **In Review** - Being reviewed by a reviewer
4. **Need More Information** - Reviewer requests changes (editable)
5. **Approved** - Final approved state
6. **Rejected** - Final rejected state

### Core Functionality
- Create, Read, Update application records
- Submit applications for review
- Start review process with reviewer assignment
- Approve/Reject applications with comments
- Request more information (returns to editable state)
- Automatic timestamp tracking (created, submitted, reviewed)
- UUID-based tracking numbers

## Architecture

### Backend (Django + Django Ninja)
```
backend/
├── applications/          # Main Django app
│   ├── models.py         # Application model with workflow states
│   ├── schemas.py        # Pydantic schemas for validation
│   ├── api.py            # 7 API endpoints with workflow logic
│   └── admin.py          # Django admin configuration
├── workflow_project/      # Django project settings
│   ├── settings.py       # CORS, installed apps
│   └── urls.py           # API routes
└── manage.py
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── api.js                  # Axios API client
│   ├── ApplicationList.jsx     # List all applications
│   ├── ApplicationForm.jsx     # Create/Edit form
│   ├── ApplicationDetail.jsx   # Detail view + workflow actions
│   ├── App.jsx                 # Router setup
│   └── index.css               # Global styles
└── package.json
```

## 🔌 API Endpoints

All endpoints are prefixed with `/api`

| Method | Endpoint | Description | Workflow Rule |
|--------|----------|-------------|---------------|
| POST | `/applications` | Create new application | Creates in Draft status |
| GET | `/applications` | List all applications | - |
| GET | `/applications/{id}` | Get single application | - |
| PUT | `/applications/{id}` | Update application | Only Draft or Need More Info |
| POST | `/applications/{id}/submit` | Submit for review | Only Draft → Submitted |
| POST | `/applications/{id}/start-review` | Start review | Only Submitted → In Review |
| POST | `/applications/{id}/decision` | Make decision | Only In Review → Approved/Rejected/Need More Info |

## Workflow Rules

1. **Edit/Update**: Only allowed in `Draft` or `Need More Information` status
2. **Submit**: Only from `Draft` status → `Submitted`
3. **Start Review**: Only from `Submitted` status → `In Review`
4. **Make Decision**: Only from `In Review` status → `Approved`, `Rejected`, or `Need More Information`
5. **Comment Requirement**: Mandatory for `Rejected` or `Need More Information` decisions
6. **Timestamps**: Automatically set `submitted_at` and `reviewed_at` during state transitions

## UI Features

- **Application List**: Table view with status badges, edit/view actions
- **Create/Edit Form**: 
  - Application type selection (Loan, Credit Card, Mortgage)
  - Applicant details (name, email)
  - Amount requested
  - Description
- **Detail Page**: 
  - Full application details
  - Status-dependent action buttons
  - Reviewer workflow interface
  - Comment history

## Database Schema

### Application Model
- `tracking_number` (UUID, auto-generated)
- `application_type` (Choice: Loan, Credit Card, Mortgage)
- `applicant_name` (String)
- `applicant_email` (Email)
- `amount_requested` (Decimal, optional)
- `description` (Text, optional)
- `status` (Choice: Draft, Submitted, In Review, Need More Info, Approved, Rejected)
- `reviewer_name` (String)
- `reviewer_comment` (Text)
- `created_at` (DateTime, auto)
- `updated_at` (DateTime, auto)
- `submitted_at` (DateTime, nullable)
- `reviewed_at` (DateTime, nullable)

## Testing the Workflow

1. **Create Application**: Go to http://localhost:5173, click "Create New Application"
2. **Submit**: View the created application, click "Submit Application"
3. **Start Review**: Enter reviewer name, click "Start Review"
4. **Make Decision**: Choose Approve/Reject/Need More Info with optional comment
5. **Update (if needed)**: If "Need More Info" selected, application becomes editable again

## Technology Stack

**Backend:**
- Django 6.0.5
- Django Ninja 1.6.2 (Fast API-like framework for Django)
- Django CORS Headers 4.9.0
- SQLite (default database)

**Frontend:**
- React 18
- Vite 8.0.14
- React Router DOM 7
- Axios

## Development Notes

- CORS configured for `localhost:5173` and `localhost:3000`
- API uses Pydantic schemas for validation
- All workflow rules enforced at API level (returns 400 errors for invalid state transitions)
- Frontend uses inline styles for rapid development
- UUID tracking numbers ensure unique identification

## Key Workflow Constraints Implemented

1. Applications cannot be edited once submitted (except Need More Info state)
2. Review cannot start unless application is submitted
3. Decisions can only be made during active review
4. Comments are required for rejections and info requests
5. State transitions are uni-directional (except Need More Info loop)
6. Timestamps automatically track submission and review times

## Production Considerations

For production deployment:
1. Change Django `SECRET_KEY` and set `DEBUG = False`
2. Use PostgreSQL instead of SQLite
3. Configure proper CORS origins
4. Set up static file serving
5. Use environment variables for configuration
6. Implement authentication/authorization
7. Add comprehensive error handling and logging
8. Set up monitoring and analytics


## By Wilfred Njuguna
## Email: njugunawilfred447@gmail.com

---