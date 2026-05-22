import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { applicationAPI } from './api';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviewer action states
  const [reviewerName, setReviewerName] = useState('');
  const [decision, setDecision] = useState('');
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      const response = await applicationAPI.getById(id);
      setApplication(response.data);
    } catch (error) {
      console.error('Error loading application:', error);
      alert('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit this application?')) return;
    
    setActionLoading(true);
    try {
      await applicationAPI.submit(id);
      alert('Application submitted successfully!');
      loadApplication();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartReview = async () => {
    if (!reviewerName.trim()) {
      alert('Please enter reviewer name');
      return;
    }
    
    setActionLoading(true);
    try {
      await applicationAPI.startReview(id, reviewerName);
      alert('Review started successfully!');
      loadApplication();
      setReviewerName('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to start review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecision = async () => {
    if (!decision) {
      alert('Please select a decision');
      return;
    }
    
    if ((decision === 'rejected' || decision === 'need_more_info') && !comment.trim()) {
      alert('Comment is required for rejection or requesting more information');
      return;
    }
    
    setActionLoading(true);
    try {
      await applicationAPI.makeDecision(id, decision, comment);
      alert('Decision recorded successfully!');
      loadApplication();
      setDecision('');
      setComment('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to record decision');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (!application) return <div style={{ padding: '20px' }}>Application not found</div>;

  const getStatusColor = (status) => {
    const colors = {
      'Draft': '#6c757d',
      'Submitted': '#0dcaf0',
      'In Review': '#ffc107',
      'Need More Information': '#fd7e14',
      'Approved': '#198754',
      'Rejected': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '8px 15px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ← Back to List
      </button>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Application Details</h1>
          <span style={{
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: getStatusColor(application.status),
            color: 'white',
            fontSize: '14px'
          }}>
            {application.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <DetailField label="Tracking Number" value={application.tracking_number} />
          <DetailField label="Application Type" value={application.application_type} />
          <DetailField label="Applicant Name" value={application.applicant_name} />
          <DetailField label="Applicant Email" value={application.applicant_email} />
          <DetailField label="Amount Requested" value={application.amount_requested ? `$${application.amount_requested}` : 'N/A'} />
          <DetailField label="Created At" value={new Date(application.created_at).toLocaleString()} />
          {application.submitted_at && (
            <DetailField label="Submitted At" value={new Date(application.submitted_at).toLocaleString()} />
          )}
          {application.reviewer_name && (
            <DetailField label="Reviewer" value={application.reviewer_name} />
          )}
        </div>

        {application.description && (
          <div style={{ marginTop: '15px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Description</div>
            <div style={{ color: '#495057' }}>{application.description}</div>
          </div>
        )}

        {application.reviewer_comment && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Reviewer Comment</div>
            <div>{application.reviewer_comment}</div>
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Actions</h2>

        {/* Submit Application */}
        {application.status === 'Draft' && (
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={handleSubmit}
              disabled={actionLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0d6efd',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                marginRight: '10px'
              }}
            >
              Submit Application
            </button>
            <button
              onClick={() => navigate(`/edit/${id}`)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Edit
            </button>
          </div>
        )}

        {/* Start Review */}
        {application.status === 'Submitted' && (
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Reviewer Name
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              style={{
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                marginRight: '10px',
                width: '250px'
              }}
            />
            <button
              onClick={handleStartReview}
              disabled={actionLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: actionLoading ? 'not-allowed' : 'pointer'
              }}
            >
              Start Review
            </button>
          </div>
        )}

        {/* Make Decision */}
        {application.status === 'In Review' && (
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Decision
            </label>
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              style={{
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                marginBottom: '10px',
                width: '100%'
              }}
            >
              <option value="">Select decision...</option>
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
              <option value="need_more_info">Need More Information</option>
            </select>

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Comment {(decision === 'rejected' || decision === 'need_more_info') && '*'}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment..."
              rows="4"
              style={{
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                width: '100%',
                resize: 'vertical',
                marginBottom: '10px'
              }}
            />

            <button
              onClick={handleDecision}
              disabled={actionLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#198754',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: actionLoading ? 'not-allowed' : 'pointer'
              }}
            >
              Submit Decision
            </button>
          </div>
        )}

        {/* Edit for Need More Info */}
        {application.status === 'Need More Information' && (
          <div style={{ marginTop: '15px' }}>
            <p style={{ marginBottom: '10px' }}>
              The reviewer has requested more information. Please update your application.
            </p>
            <button
              onClick={() => navigate(`/edit/${id}`)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0d6efd',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Update Application
            </button>
          </div>
        )}

        {(application.status === 'Approved' || application.status === 'Rejected') && (
          <div style={{ marginTop: '15px', color: '#6c757d' }}>
            This application has been {application.status.toLowerCase()}. No further actions available.
          </div>
        )}
      </div>
    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</div>
      <div style={{ color: '#495057' }}>{value}</div>
    </div>
  );
}

export default ApplicationDetail;
