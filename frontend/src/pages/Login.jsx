import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, reset } from '../redux/slices/authSlice';

import bgImage from '../assets/medical_background.png';

const Login = () => {
  const location = useLocation();
  const type = location.state?.type; // Get type from state if available

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };


  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '20px',
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '3rem',
      borderRadius: '16px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      width: '100%',
      maxWidth: '450px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#1f2937',
      fontSize: '2rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    inputGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#374151',
      fontSize: '0.95rem',
      fontWeight: '600',
    },
    input: {
      width: '100%',
      padding: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '1rem',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '1rem',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1.5rem',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '0.95rem',
        color: '#6b7280'
    },
    link: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.2s'
    }
  };

  if (isLoading) {
    return (
      <div style={{...styles.container, color: '#1f2937', fontSize: '1.5rem'}}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.header}>Welcome Back</h1>
        {type && (
          <p style={{textAlign: 'center', color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem'}}>
            {type === 'blood' ? 'Blood Management Portal' : 'AI Health Care Portal'}
          </p>
        )}
        <form onSubmit={onSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={onChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <button 
            type="button" 
            style={styles.button} 
            onClick={onSubmit}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.23)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 14px 0 rgba(14, 165, 233, 0.39)';
            }}
          >
            Sign In
          </button>
        </form>
        <p style={styles.linkText}>
            Don't have an account? <span style={{...styles.link, cursor: 'pointer'}} onClick={() => navigate('/register', { state: { type } })}>Create Account</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
