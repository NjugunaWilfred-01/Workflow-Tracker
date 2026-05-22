import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from './api';

function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationAPI.getAll();
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
      alert('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Applications</h1>
        <button 
          onClick={() => navigate('/create')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New Application
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <th style={tableHeaderStyle}>Tracking Number</th>
            <th style={tableHeaderStyle}>Applicant Name</th>
            <th style={tableHeaderStyle}>Type</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Created</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={tableCellStyle}>{app.tracking_number}</td>
              <td style={tableCellStyle}>{app.applicant_name}</td>
              <td style={tableCellStyle}>{app.application_type}</td>
              <td style={tableCellStyle}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: getStatusColor(app.status),
                  color: 'white',
                  fontSize: '12px'
                }}>
                  {app.status}
                </span>
              </td>
              <td style={tableCellStyle}>
                {new Date(app.created_at).toLocaleDateString()}
              </td>
              <td style={tableCellStyle}>
                <button
                  onClick={() => navigate(`/applications/${app.id}`)}
                  style={{
                    padding: '5px 15px',
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                >
                  View
                </button>
                {(app.status === 'Draft' || app.status === 'Need More Information') && (
                  <button
                    onClick={() => navigate(`/edit/${app.id}`)}
                    style={{
                      padding: '5px 15px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {applications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          No applications found. Create your first application!
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tableCellStyle = {
  padding: '12px'
};

export default ApplicationList;
