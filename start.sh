#!/bin/bash
# Workflow Tracker - Quick Start Script

echo "Starting Workflow Tracker..."
echo ""

# Check if backend server is running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Backend already running on http://localhost:8000"
else
    echo "Starting Django backend..."
    cd backend
    source venv/bin/activate
    python manage.py runserver &
    cd ..
    echo "Backend started on http://localhost:8000"
fi

# Check if frontend server is running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "Frontend already running on http://localhost:5173"
else
    echo "Starting React frontend..."
    cd frontend
    npm run dev &
    cd ..
    echo "Frontend started on http://localhost:5173"
fi

echo ""
echo "Workflow Tracker is ready!"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000/api"
echo "API Docs: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
wait
