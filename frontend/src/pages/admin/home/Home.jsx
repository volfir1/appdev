import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';

const Home = () => {
  const role = localStorage.getItem('role') || 'user';
  const navigate = useNavigate();

  const navigateToGeospatial = () => {
    navigate('/geospatial');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
            Welcome to ActOnPov
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>
            {role === 'admin'
              ? 'Manage and analyze poverty data for Taguig City to drive impactful interventions.'
              : 'Explore poverty insights and support programs in Taguig City.'}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#1e40af')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
            >
              {role === 'admin' ? 'Manage Data' : 'Explore Insights'}
            </button>
            <button
              onClick={navigateToGeospatial}
              style={{
                backgroundColor: '#059669',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#047857')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#059669')}
            >
              Geospatial Map
            </button>
          </div>
        </section>
        <Dashboard role={role} />
      </main>
    </div>
  );
};

export default Home;