import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DoctorDashboard from './dashboards/DoctorDashboard';
import DonorDashboard from './dashboards/DonorDashboard';
import HospitalDashboard from './dashboards/HospitalDashboard';
import PatientDashboard from './dashboards/PatientDashboard';
import PendingVerification from './PendingVerification';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Block unverified doctors/hospitals
  if ((user.role === 'doctor' || user.role === 'hospital') && user.isVerified === false) {
    return <PendingVerification />;
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
    <div style={{ width: '100%', padding: 0 }}>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;

