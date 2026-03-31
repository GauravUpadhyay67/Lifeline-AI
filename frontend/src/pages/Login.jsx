import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { login, reset } from '../redux/slices/authSlice';

const Login = () => {
  const location = useLocation();
  const type = location.state?.type; 
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

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
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
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
    const userData = { email, password };
    dispatch(login(userData));
  };

  const c = {
    bg: darkMode
      ? 'linear-gradient(180deg, #020617 0%, #0f172a 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #f0f4ff 100%)',
    cardBg: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    cardBorder: darkMode ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    muted: darkMode ? '#94a3b8' : '#64748b',
    inputBg: darkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
    inputBorder: darkMode ? '1px solid rgba(148, 163, 184, 0.15)' : '1px solid #e2e8f0',
    inputFocusBorder: darkMode ? 'rgba(56, 189, 248, 0.5)' : '#3b82f6',
    inputFocusRing: darkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(59, 130, 246, 0.1)',
    buttonGradient: darkMode 
      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
      : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    link: darkMode ? '#38bdf8' : '#2563eb',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: c.bg,
      padding: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Ornaments matching Landing Page */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%',
        background: darkMode ? 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%', width: '400px', height: '400px', borderRadius: '50%',
        background: darkMode ? 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: c.cardBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '3rem 2.5rem',
        borderRadius: '24px',
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.05)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        border: c.cardBorder,
        width: '100%',
        maxWidth: '420px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            color: c.text,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>Welcome Back</h1>
          <p style={{ color: c.muted, fontSize: '0.95rem', margin: 0 }}>
            {type === 'blood' ? 'Log in to manage blood inventory' : 'Sign in to your account to continue'}
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: c.text, fontSize: '0.85rem', fontWeight: '600' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: c.muted, pointerEvents: 'none' }} />
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={onChange}
                required
                style={{
                  width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem',
                  backgroundColor: c.inputBg, border: c.inputBorder, borderRadius: '14px',
                  color: c.text, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = c.inputFocusBorder;
                  e.target.style.boxShadow = `0 0 0 4px ${c.inputFocusRing}`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = c.inputBorder.split(' ')[2];
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: c.text, fontSize: '0.85rem', fontWeight: '600' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: c.muted, pointerEvents: 'none' }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={onChange}
                required
                style={{
                  width: '100%', padding: '0.85rem 2.8rem 0.85rem 2.8rem',
                  backgroundColor: c.inputBg, border: c.inputBorder, borderRadius: '14px',
                  color: c.text, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = c.inputFocusBorder;
                  e.target.style.boxShadow = `0 0 0 4px ${c.inputFocusRing}`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = c.inputBorder.split(' ')[2];
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', 
                  color: c.muted, cursor: 'pointer', display: 'flex', alignItems: 'center' 
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%', padding: '0.9rem',
              background: c.buttonGradient, color: 'white',
              border: 'none', borderRadius: '14px',
              fontSize: '1rem', fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem', transition: 'all 0.3s',
              boxShadow: '0 8px 25px rgba(37,99,235,0.25)',
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if(!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,99,235,0.35)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(37,99,235,0.25)';
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: c.muted }}>
          Don't have an account?{' '}
          <span 
            onClick={() => navigate('/register', { state: { type } })}
            style={{ color: c.link, fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
