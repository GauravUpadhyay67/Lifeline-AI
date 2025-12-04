import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../redux/slices/authSlice';

import PatientDashboard from './dashboards/PatientDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import DonorDashboard from './dashboards/DonorDashboard';
import HospitalDashboard from './dashboards/HospitalDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '3rem',
      padding: '1.5rem 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1f2937',
      margin: 0,
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  };

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'patient':
        return <PatientDashboard user={user} />;
      case 'doctor':
        return <DoctorDashboard user={user} />;
      case 'donor':
        return <DonorDashboard user={user} />;
      case 'hospital':
        return <HospitalDashboard user={user} />;
      default:
        return <PatientDashboard user={user} />;
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome, {user.name}</h1>
      </header>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
