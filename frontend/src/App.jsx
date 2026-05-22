import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApplicationList from './ApplicationList';
import ApplicationForm from './ApplicationForm';
import ApplicationDetail from './ApplicationDetail';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <nav style={{
          backgroundColor: '#0d6efd',
          color: 'white',
          padding: '15px 20px',
          marginBottom: '0'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Workflow Tracker</h1>
        </nav>
        
        <Routes>
          <Route path="/" element={<ApplicationList />} />
          <Route path="/create" element={<ApplicationForm />} />
          <Route path="/edit/:id" element={<ApplicationForm />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
