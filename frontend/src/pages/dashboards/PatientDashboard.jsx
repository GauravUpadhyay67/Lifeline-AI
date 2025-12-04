import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = ({ user }) => {
  const navigate = useNavigate();

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem',
      marginTop: '1rem',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '2rem',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      gap: '1rem',
    },
    icon: {
      fontSize: '2rem',
      padding: '1rem',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      color: '#0284c7',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1f2937',
      margin: 0,
    },
    cardText: {
      color: '#6b7280',
      marginBottom: '2rem',
      lineHeight: '1.6',
      flex: 1,
    },
    button: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#0ea5e9',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'background-color 0.2s ease',
      marginTop: 'auto',
      boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)',
    },
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <div style={styles.grid}>
        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.cardHeader}>
            <div style={styles.icon}>🧬</div>
            <h3 style={styles.cardTitle}>AI Disease Detection</h3>
          </div>
          <p style={styles.cardText}>Upload X-rays or enter symptoms to get an instant, AI-powered analysis of your health condition.</p>
          <button style={styles.button} onClick={() => navigate('/disease-detection')}>Start Checkup</button>
        </div>

        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.cardHeader}>
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #dcfce7 0%, #86efac 100%)', color: '#15803d'}}>💬</div>
            <h3 style={styles.cardTitle}>Health Chatbot</h3>
          </div>
          <p style={styles.cardText}>Chat with our intelligent AI assistant for immediate health advice, tips, and guidance.</p>
          <button style={{...styles.button, backgroundColor: '#22c55e', boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.39)'}} onClick={() => navigate('/chatbot')}>Chat Now</button>
        </div>

        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.cardHeader}>
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 100%)', color: '#7e22ce'}}>📄</div>
            <h3 style={styles.cardTitle}>My Reports</h3>
          </div>
          <p style={styles.cardText}>Access and manage your complete medical history, past reports, and AI diagnosis results.</p>
          <button style={{...styles.button, backgroundColor: '#a855f7', boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.39)'}} onClick={() => navigate('/medical-reports')}>View Reports</button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
