import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { applicationAPI } from './api';

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    application_type: 'Loan',
    applicant_name: '',
    applicant_email: '',
    amount_requested: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadApplication();
    }
  }, [id]);

  const loadApplication = async () => {
    try {
      const response = await applicationAPI.getById(id);
      const app = response.data;
      setFormData({
        application_type: app.application_type,
        applicant_name: app.applicant_name,
        applicant_email: app.applicant_email,
        amount_requested: app.amount_requested || '',
        description: app.description
      });
    } catch (error) {
      console.error('Error loading application:', error);
      alert('Failed to load application');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount_requested: formData.amount_requested ? parseFloat(formData.amount_requested) : null
      };

      if (isEditMode) {
        await applicationAPI.update(id, payload);
        alert('Application updated successfully!');
      } else {
        await applicationAPI.create(payload);
        alert('Application created successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving application:', error);
      alert(error.response?.data?.error || 'Failed to save application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{isEditMode ? 'Edit Application' : 'Create New Application'}</h1>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Application Type *</label>
          <select
            name="application_type"
            value={formData.application_type}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="Loan">Loan</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Mortgage">Mortgage</option>
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Applicant Name *</label>
          <input
            type="text"
            name="applicant_name"
            value={formData.applicant_name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Applicant Email *</label>
          <input
            type="email"
            name="applicant_email"
            value={formData.applicant_email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Amount Requested</label>
          <input
            type="number"
            name="amount_requested"
            value={formData.amount_requested}
            onChange={handleChange}
            step="0.01"
            min="0"
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{...inputStyle, resize: 'vertical'}}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const formGroupStyle = {
  marginBottom: '15px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  fontSize: '14px'
};

export default ApplicationForm;
