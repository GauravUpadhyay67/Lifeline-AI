import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#0ea5e9',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
    },
    link: {
      textDecoration: 'none',
      color: '#374151',
      fontWeight: '500',
      fontSize: '1rem',
      transition: 'color 0.3s ease',
      position: 'relative',
    },
    activeLink: {
      color: '#0ea5e9',
    },
    button: {
      padding: '0.5rem 1.5rem',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    loginBtn: {
      backgroundColor: 'transparent',
      color: '#0ea5e9',
      border: '2px solid #0ea5e9',
    },
    logoutBtn: {
      backgroundColor: '#ef4444',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
    },
    mobileMenuBtn: {
      display: 'none', // Hidden on desktop
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#374151',
    },
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        <span>❤️</span> Lifeline AI
      </Link>

      <div style={styles.navLinks}>
        <Link 
          to="/" 
          style={{...styles.link, ...(isActive('/') ? styles.activeLink : {})}}
        >
          Home
        </Link>
        
        {user ? (
          <>
            <Link 
              to="/dashboard" 
              style={{...styles.link, ...(isActive('/dashboard') ? styles.activeLink : {})}}
            >
              Dashboard
            </Link>
            <button 
              style={{...styles.button, ...styles.logoutBtn}} 
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              style={{...styles.button, ...styles.loginBtn}}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
