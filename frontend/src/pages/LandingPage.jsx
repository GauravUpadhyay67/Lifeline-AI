import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/landing_background.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path, type) => {
    navigate(path, { state: { type } });
  };


  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem',
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem',
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '1rem',
      letterSpacing: '-0.05em',
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6',
    },
    cardsContainer: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
      maxWidth: '1000px',
      width: '100%',
    },
    card: {
      flex: '1 1 300px',
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '3rem 2rem',
      textAlign: 'center',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    cardIcon: {
      fontSize: '4rem',
      marginBottom: '1.5rem',
    },
    cardTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#334155',
      marginBottom: '1rem',
    },
    cardDescription: {
      color: '#64748b',
      marginBottom: '2rem',
      lineHeight: '1.5',
    },
    button: {
      padding: '0.75rem 2rem',
      borderRadius: '9999px',
      fontWeight: '600',
      fontSize: '1rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    bloodButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
    },
    aiButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Lifeline AI</h1>
        <p style={styles.subtitle}>
          Bridging the gap between advanced AI healthcare and efficient blood management. Choose your path to get started.
        </p>
      </div>

      <div style={styles.cardsContainer}>
        {/* Blood Management Card */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }}
          onClick={() => handleNavigation('/login', 'blood')}
        >
          <div style={styles.cardIcon}>🩸</div>
          <h2 style={styles.cardTitle}>Blood Management</h2>
          <p style={styles.cardDescription}>
            Connect hospitals with donors, manage inventory, and save lives with efficient blood tracking.
          </p>
          <button style={{...styles.button, ...styles.bloodButton}}>
            Get Started
          </button>
        </div>

        {/* AI Health Care Card */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }}
          onClick={() => handleNavigation('/login', 'ai')}
        >
          <div style={styles.cardIcon}>🤖</div>
          <h2 style={styles.cardTitle}>AI Health Care</h2>
          <p style={styles.cardDescription}>
            Advanced disease detection, AI-powered health guidance, and patient management.
          </p>
          <button style={{...styles.button, ...styles.aiButton}}>
            Explore AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
