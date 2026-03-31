import { Clock, FileCheck, Mail, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

const PendingVerification = () => {
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const styles = {
    container: {
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    },
    card: {
      maxWidth: '560px',
      width: '100%',
      background: darkMode
        ? 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'
        : 'white',
      borderRadius: '28px',
      padding: '3rem',
      textAlign: 'center',
      boxShadow: darkMode
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
    },
    iconWrapper: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: darkMode
        ? 'rgba(251, 191, 36, 0.1)'
        : '#fffbeb',
      border: darkMode
        ? '2px solid rgba(251, 191, 36, 0.3)'
        : '2px solid #fde68a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '800',
      color: darkMode ? '#f8fafc' : '#0f172a',
      marginBottom: '0.75rem',
    },
    subtitle: {
      fontSize: '1.05rem',
      color: darkMode ? '#94a3b8' : '#64748b',
      lineHeight: '1.6',
      marginBottom: '2rem',
    },
    stepsContainer: {
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginBottom: '2rem',
    },
    step: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '14px',
      background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
      border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
    },
    stepIcon: (done) => ({
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: done
        ? (darkMode ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7')
        : (darkMode ? 'rgba(251, 191, 36, 0.15)' : '#fef9c3'),
      color: done ? '#22c55e' : '#f59e0b',
      flexShrink: 0,
    }),
    stepText: {
      fontSize: '0.95rem',
      color: darkMode ? '#e2e8f0' : '#334155',
      fontWeight: '500',
    },
    stepSub: {
      fontSize: '0.8rem',
      color: darkMode ? '#94a3b8' : '#94a3b8',
      marginTop: '2px',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      background: darkMode ? 'rgba(251, 191, 36, 0.1)' : '#fffbeb',
      color: '#f59e0b',
      fontWeight: '700',
      fontSize: '0.85rem',
      border: '1px solid rgba(251, 191, 36, 0.3)',
    },
  };

  const roleLabel = user?.role === 'doctor' ? 'Doctor' : 'Hospital';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <Clock size={36} color="#f59e0b" />
        </div>

        <h1 style={styles.title}>Verification Pending</h1>
        <p style={styles.subtitle}>
          Thank you for registering as a <strong>{roleLabel}</strong>. Your account
          is currently under review by our Trust & Safety team.
        </p>

        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepIcon(true)}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={styles.stepText}>Account Created</div>
              <div style={styles.stepSub}>Your registration was received successfully</div>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.stepIcon(true)}>
              <FileCheck size={20} />
            </div>
            <div>
              <div style={styles.stepText}>Credentials Submitted</div>
              <div style={styles.stepSub}>
                {user?.role === 'doctor'
                  ? 'Medical license number under review'
                  : 'Registration number under review'}
              </div>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.stepIcon(false)}>
              <Clock size={20} />
            </div>
            <div>
              <div style={styles.stepText}>Admin Approval</div>
              <div style={styles.stepSub}>Typically takes 24–48 hours</div>
            </div>
          </div>
        </div>

        <div style={styles.badge}>
          <Mail size={14} />
          You'll be notified once approved
        </div>

        <button 
          onClick={handleLogout}
          style={{
            display: 'block', width: '100%', padding: '0.85rem', marginTop: '1.5rem',
            background: 'transparent', border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            color: darkMode ? '#f1f5f9' : '#1e293b', borderRadius: '12px', fontWeight: '600',
            cursor: 'pointer', transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default PendingVerification;
