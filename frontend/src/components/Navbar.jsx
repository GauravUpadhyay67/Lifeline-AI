import { Activity, ChevronDown, LayoutDashboard, LogOut, Menu, Moon, Settings, Sun, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { logout, reset } from '../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { darkMode, toggleTheme } = useTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navBg = darkMode
    ? (isScrolled ? 'rgba(15, 23, 42, 0.88)' : 'rgba(15, 23, 42, 0.4)')
    : (isScrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.7)');

  const borderColor = isScrolled
    ? (darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.06)')
    : 'transparent';

  const textColor = darkMode ? '#cbd5e1' : '#475569';
  const accentColor = '#38bdf8';

  const mobileMenuBg = darkMode ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)';

  return (
    <>
      <nav className="navbar-main" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isScrolled ? '0.55rem 2.5rem' : '0.85rem 2.5rem',
        backgroundColor: navBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: isScrolled ? (darkMode ? '0 4px 30px rgba(0,0,0,0.3)' : '0 1px 20px rgba(0,0,0,0.06)') : 'none',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Logo — always visible */}
        <Link to="/" style={{
          fontSize: '1.35rem',
          fontWeight: '800',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: darkMode ? '#38bdf8' : '#0284c7',
          letterSpacing: '-0.02em',
        }}>
          <Activity size={24} strokeWidth={2.5} />
          <span>Lifeline AI</span>
        </Link>

        {/* Desktop Right side */}
        <div className="nav-links-desktop" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Home Link */}
          <Link 
            to="/" 
            style={{
              textDecoration: 'none',
              color: isActive('/') ? accentColor : textColor,
              fontWeight: '500',
              fontSize: '0.88rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              transition: 'all 0.2s',
              backgroundColor: isActive('/') ? (darkMode ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.06)') : 'transparent',
            }}
          >
            Home
          </Link>
          
          {/* Theme Toggle */}
          <button 
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: textColor,
              padding: '0.45rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onClick={toggleTheme}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          
          {user ? (
            /* Logged-in user — always shows profile pill */
            <div style={{position: 'relative'}} ref={dropdownRef}>
              <button 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
                  padding: '0.3rem 0.55rem 0.3rem 0.3rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s',
                }}
                onClick={() => setProfileOpen(!profileOpen)}
                onMouseEnter={e => e.currentTarget.style.borderColor = darkMode ? 'rgba(56, 189, 248, 0.3)' : '#bfdbfe'}
                onMouseLeave={e => e.currentTarget.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.2))'
                    : 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                  color: darkMode ? '#38bdf8' : '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                <ChevronDown size={14} color={textColor} style={{
                  transition: 'transform 0.2s',
                  transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)',
                }} />
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  borderRadius: '14px',
                  boxShadow: darkMode
                    ? '0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(148, 163, 184, 0.1)'
                    : '0 16px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
                  width: '210px',
                  padding: '0.4rem',
                  animation: 'dropIn 0.2s ease-out',
                }}>
                  {/* User Info */}
                  <div style={{
                    padding: '0.65rem 0.8rem',
                    borderBottom: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : '#f1f5f9'}`,
                    marginBottom: '0.3rem',
                  }}>
                    <p style={{ margin: 0, fontWeight: '700', color: darkMode ? '#f1f5f9' : '#0f172a', fontSize: '0.9rem' }}>{user.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: darkMode ? '#64748b' : '#94a3b8', textTransform: 'capitalize' }}>{user.role}</p>
                  </div>

                  {[
                    { to: '/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
                    { to: '/profile', icon: <Settings size={15} />, label: 'Profile' },
                  ].map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 0.8rem',
                        color: isActive(item.to) ? accentColor : (darkMode ? '#cbd5e1' : '#334155'),
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        borderRadius: '9px',
                        transition: 'all 0.15s',
                        backgroundColor: isActive(item.to) ? (darkMode ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff') : 'transparent',
                      }}
                      onClick={() => setProfileOpen(false)}
                      onMouseEnter={e => { if (!isActive(item.to)) e.currentTarget.style.backgroundColor = darkMode ? 'rgba(56, 189, 248, 0.06)' : '#f8fafc'; }}
                      onMouseLeave={e => { if (!isActive(item.to)) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  
                  <div style={{ borderTop: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : '#f1f5f9'}`, margin: '0.3rem 0' }} />

                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.6rem 0.8rem',
                      color: '#f87171',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      borderRadius: '9px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onClick={onLogout}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(248, 113, 113, 0.06)' : '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={15} /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{
              padding: '0.5rem 1.4rem',
              borderRadius: '10px',
              background: darkMode
                ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              boxShadow: darkMode ? '0 4px 12px rgba(56, 189, 248, 0.2)' : '0 4px 12px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.2s',
              border: 'none',
            }}>
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile: Theme toggle + Hamburger */}
        <div className="mobile-menu-btn" style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, padding: '0.45rem', borderRadius: '10px', display: 'flex', alignItems: 'center' }}
            onClick={toggleTheme}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: textColor,
              padding: '0.4rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: mobileMenuBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          padding: '5rem 2rem 2rem',
          animation: 'mobileMenuIn 0.25s ease-out',
        }}>
          {/* Close button at top right */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              color: textColor,
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <X size={28} />
          </button>

          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
              borderBottom: `1px solid ${darkMode ? 'rgba(148,163,184,0.1)' : '#f1f5f9'}`,
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.2))'
                  : 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                color: darkMode ? '#38bdf8' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '1.1rem',
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: '700', color: darkMode ? '#f1f5f9' : '#0f172a', fontSize: '1.1rem' }}>{user.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: darkMode ? '#64748b' : '#94a3b8', textTransform: 'capitalize' }}>{user.role}</p>
              </div>
            </div>
          )}

          {/* Mobile Nav Links */}
          {[
            { to: '/', label: 'Home' },
            ...(user ? [
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/disease-detection', label: 'AI Health Checkup' },
              { to: '/chatbot', label: 'Health Assistant' },
              { to: '/medical-reports', label: 'Medical Reports' },
              { to: '/profile', label: 'Profile' },
            ] : []),
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: isActive(item.to) ? accentColor : (darkMode ? '#f1f5f9' : '#1e293b'),
                fontWeight: isActive(item.to) ? '700' : '500',
                fontSize: '1.15rem',
                padding: '1rem 0.5rem',
                borderBottom: `1px solid ${darkMode ? 'rgba(148,163,184,0.08)' : '#f1f5f9'}`,
                display: 'block',
                transition: 'color 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}

          {/* Bottom actions */}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
            {user ? (
              <button
                onClick={onLogout}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: darkMode ? 'rgba(248, 113, 113, 0.1)' : '#fef2f2',
                  color: '#f87171',
                  border: `1px solid ${darkMode ? 'rgba(248, 113, 113, 0.2)' : '#fecaca'}`,
                  borderRadius: '14px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem',
                  background: darkMode
                    ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '1rem',
                  borderRadius: '14px',
                  boxSizing: 'border-box',
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
