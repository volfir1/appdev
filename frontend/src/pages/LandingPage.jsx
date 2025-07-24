import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import '../assets/css/dashboard.min.css';


export default function LandingPage() {
  // Fetch role from localStorage, default to 'user' if not found
  const role = localStorage.getItem('role') || 'user';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (!token && role === 'user') {
      navigate('/login');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'ngo_staff') {
      navigate('/ngo/dashboard');
    } else if (role === 'worker') {
      navigate('/worker/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="dashboard-page">
        {!token && <Navbar />}
        <div className="dashboard-container">
          <div className="content-wrapper">
            <div className="text-content">
              <h1 className="main-title">Predict. Prevent. Empower.</h1>
              <h2 className="subtitle">ActOnPov: Real-Time Insight for Targeted Action</h2>
              
              <p className="description">
                A powerful, student-friendly AI system that uses BERT and geospatial NLP 
                to transform global news into poverty risk forecasts. Empower governments, 
                NGOs, and communities with live data, localized alerts, and actionable 
                maps—bridging headlines to humanitarian action for SDG.
              </p>
              
              {/* Button that redirects based on user role */}
              <button 
                className="cta-button" 
                onClick={handleButtonClick}
              >
                {role === 'admin' ? 'Manage Data' : 'Explore Insights'}
                <span className="arrow">→</span>
              </button>
            </div>

            {/* Placeholder for SVG illustration */}
            <div className="image-content">
              <div className="image-placeholder">
                <div className="svg-placeholder">
                  <span>SVG Illustration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    
      {/* SVG Definitions for Smooth Curves */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* Desktop smooth curve */}
          <clipPath id="smooth-curve" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.8 C 0.05,0.82 0.1,0.85 0.15,0.87 C 0.2,0.89 0.25,0.91 0.3,0.92 C 0.4,0.93 0.6,0.7 1,0.4 L 1,1 L 0,1 Z" />
          </clipPath>

          {/* Tablet smooth curve */}
          <clipPath id="smooth-curve-tablet" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.85 C 0.06,0.87 0.12,0.9 0.18,0.92 C 0.24,0.94 0.3,0.96 0.35,0.97 C 0.45,0.98 0.65,0.75 1,0.5 L 1,1 L 0,1 Z" />
          </clipPath>

          {/* Mobile smooth curve */}
          <clipPath id="smooth-curve-mobile" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.9 C 0.08,0.92 0.15,0.94 0.22,0.96 C 0.28,0.97 0.35,0.98 0.4,0.99 C 0.5,0.995 0.7,0.8 1,0.6 L 1,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>


      
    </>
  );
}