import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const applicationAPI = {
  // List all applications
  getAll: () => api.get('/applications'),
  
  // Get single application
  getById: (id) => api.get(`/applications/${id}`),
  
  // Create new application
  create: (data) => api.post('/applications', data),
  
  // Update application (Draft or Need More Info only)
  update: (id, data) => api.put(`/applications/${id}`, data),
  
  // Submit application (Draft -> Submitted)
  submit: (id) => api.post(`/applications/${id}/submit`, {}),
  
  // Start review (Submitted -> In Review)
  startReview: (id, reviewerName) => 
    api.post(`/applications/${id}/start-review`, { reviewer_name: reviewerName }),
  
  // Make decision (In Review -> Approved/Rejected/Need More Info)
  makeDecision: (id, decision, comment) => 
    api.post(`/applications/${id}/decision`, { 
      decision, 
      reviewer_comment: comment 
    }),
};

export default api;
