import { Activity, ChevronDown, LayoutDashboard, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
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

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    setProfileOpen(false);
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

  return (
    <>
      <nav style={{
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

        {/* Right side */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
      </nav>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default Navbar;
