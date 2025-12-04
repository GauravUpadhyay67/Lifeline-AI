import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { register, reset } from '../redux/slices/authSlice';

import bgImage from '../assets/medical_background.png';

const Register = () => {
  const location = useLocation();
  const type = location.state?.type || 'ai'; // Default to AI if no state

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: type === 'blood' ? 'donor' : 'patient',
    // New fields
    phone: '',
    address: '',
    bloodType: '',
    age: '',
    gender: '',
    specialization: '',
    licenseNumber: '',
    hospitalName: '',
  });

  const { 
    name, email, password, confirmPassword, role,
    phone, address, bloodType, age, gender,
    specialization, licenseNumber, hospitalName
  } = formData;

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

    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      const userData = {
        name,
        email,
        password,
        role,
        phone,
        address,
        bloodType,
        age,
        gender,
        specialization,
        licenseNumber,
        hospitalName
      };
      dispatch(register(userData));
    }
  };

  // Define roles based on type
  const roles = type === 'blood' 
    ? [
        { value: 'donor', label: 'Blood Donor' },
        { value: 'hospital', label: 'Hospital' }
      ]
    : [
        { value: 'patient', label: 'Patient' },
        { value: 'doctor', label: 'Doctor' }
      ];


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
      padding: '40px 20px',
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '3rem',
      borderRadius: '16px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      width: '100%',
      maxWidth: '600px',
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
    select: {
      width: '100%',
      padding: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      boxSizing: 'border-box',
      outline: 'none',
      cursor: 'pointer',
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

  const renderAdditionalFields = () => {
    switch (role) {
      case 'patient':
      case 'donor':
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Blood Type</label>
              <select name="bloodType" value={bloodType} onChange={onChange} style={styles.select}>
                <option value="">Select Blood Type</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Age</label>
                <input 
                  type="number" 
                  name="age" 
                  value={age} 
                  onChange={onChange} 
                  style={styles.input} 
                  placeholder="Age" 
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Gender</label>
                <select name="gender" value={gender} onChange={onChange} style={styles.select}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Address</label>
              <input 
                type="text" 
                name="address" 
                value={address} 
                onChange={onChange} 
                style={styles.input} 
                placeholder="Full Address" 
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={phone} 
                onChange={onChange} 
                style={styles.input} 
                placeholder="Phone Number" 
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </>
        );
      case 'doctor':
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Specialization</label>
              <input 
                type="text" 
                name="specialization" 
                value={specialization} 
                onChange={onChange} 
                style={styles.input} 
                placeholder="e.g. Cardiologist" 
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>License Number</label>
              <input 
                type="text" 
                name="licenseNumber" 
                value={licenseNumber} 
                onChange={onChange} 
                style={styles.input} 
                placeholder="Medical License Number" 
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hospital Affiliation</label>
              <input 
                type="text" 
                name="hospitalName" 
                value={hospitalName} 
                onChange={onChange} 
                style={styles.input} 
                placeholder="Hospital Name" 
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </>
        );
      case 'hospital':
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hospital Address</label>
              <input 
                type="text" 
                name="address" 
                value={address} 
                onChange={onChange} 
                style={styles.input} 
                placeholder="Full Hospital Address" 
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Contact Phone</label>
              <input 
                type="tel" 
                name="phone" 
                value={phone} 
                onChange={onChange} 
                style={styles.input} 
                placeholder="Emergency Contact Number" 
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>License/Registration Number</label>
              <input 
                type="text" 
                name="licenseNumber" 
                value={licenseNumber} 
                onChange={onChange} 
                style={styles.input} 
                placeholder="Registration Number" 
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.header}>Create Account</h1>
        <p style={{textAlign: 'center', color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem'}}>
          {type === 'blood' ? 'Blood Management Portal' : 'AI Health Care Portal'}
        </p>
        <form onSubmit={onSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Enter your full name"
              onChange={onChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
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
            <label style={styles.label}>I am a...</label>
            <select
              name="role"
              value={role}
              onChange={onChange}
              style={styles.select}
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Additional Fields based on Role */}
          {renderAdditionalFields()}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Create a password"
              onChange={onChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm your password"
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
            Create Account
          </button>
        </form>
         <p style={styles.linkText}>
            Already have an account? <span style={{...styles.link, cursor: 'pointer'}} onClick={() => navigate('/login', { state: { type } })}>Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
