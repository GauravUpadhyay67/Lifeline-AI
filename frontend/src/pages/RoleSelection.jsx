import { Building2, Heart, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const roles = [
  {
    id: 'patient',
    title: 'Patient',
    icon: Heart,
    tagline: 'Your health, simplified.',
    features: ['AI-powered disease detection', 'Chat with medical AI assistant', 'Find blood donors nearby', 'Manage medical reports'],
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    glow: 'rgba(244, 63, 94, 0.15)',
  },
  {
    id: 'doctor',
    title: 'Doctor',
    icon: Stethoscope,
    tagline: 'Empower your practice.',
    features: ['Connect with patients digitally', 'Manage appointments', 'Access patient reports', 'Hospital or independent practice'],
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    glow: 'rgba(99, 102, 241, 0.15)',
  },
  {
    id: 'hospital',
    title: 'Hospital',
    icon: Building2,
    tagline: 'Manage everything in one place.',
    features: ['Blood inventory management', 'Verify affiliated doctors', 'Emergency request coordination', 'Analytics & forecasting'],
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    glow: 'rgba(20, 184, 166, 0.15)',
  },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [hoveredRole, setHoveredRole] = useState(null);

  const c = {
    bg: darkMode ? 'linear-gradient(180deg, #020617 0%, #0f172a 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f0f4ff 100%)',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    muted: darkMode ? '#94a3b8' : '#64748b',
    cardBg: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.85)',
    cardBorder: darkMode ? 'rgba(148, 163, 184, 0.12)' : 'rgba(0, 0, 0, 0.06)',
    featureText: darkMode ? '#cbd5e1' : '#475569',
    link: darkMode ? '#38bdf8' : '#2563eb',
  };

  return (
    <div style={{
      minHeight: '100vh', background: c.bg, padding: '80px 20px 40px',
      fontFamily: "'Inter', -apple-system, sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Background Ornaments */}
      <div style={{
        position: 'absolute', top: '5%', left: '10%', width: '500px', height: '500px', borderRadius: '50%',
        background: darkMode ? 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', right: '10%', width: '500px', height: '500px', borderRadius: '50%',
        background: darkMode ? 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem', position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontSize: '2.2rem', fontWeight: '800', color: c.text, marginBottom: '0.75rem', letterSpacing: '-0.03em',
        }}>
          Join Lifeline AI
        </h1>
        <p style={{ color: c.muted, fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
          Select your account type to get started. Each profile is tailored to give you exactly the tools you need.
        </p>
      </div>

      {/* Role Cards */}
      <div className="role-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem', maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1,
      }}>
        {roles.map((role) => {
          const isHovered = hoveredRole === role.id;
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              onClick={() => navigate(`/register/${role.id}`)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              style={{
                background: c.cardBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '20px', padding: '2rem 1.75rem',
                border: `1px solid ${isHovered ? 'transparent' : c.cardBorder}`,
                boxShadow: isHovered
                  ? `0 20px 40px ${role.glow}, 0 0 0 1px ${role.glow}`
                  : '0 4px 12px rgba(0,0,0,0.04)',
                cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Gradient accent bar at top */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: role.gradient, opacity: isHovered ? 1 : 0.4,
                transition: 'opacity 0.3s',
              }} />

              {/* Icon */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: role.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem', boxShadow: `0 8px 20px ${role.glow}`,
              }}>
                <Icon size={26} color="white" />
              </div>

              {/* Title & Tagline */}
              <h2 style={{
                fontSize: '1.35rem', fontWeight: '700', color: c.text, marginBottom: '0.35rem',
              }}>
                {role.title}
              </h2>
              <p style={{ color: c.muted, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                {role.tagline}
              </p>

              {/* Feature List */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem' }}>
                {role.features.map((feature, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    fontSize: '0.85rem', color: c.featureText, marginBottom: '0.55rem',
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: role.gradient, flexShrink: 0,
                    }} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div style={{
                padding: '0.7rem', borderRadius: '12px', textAlign: 'center',
                background: isHovered ? role.gradient : (darkMode ? 'rgba(148, 163, 184, 0.08)' : 'rgba(0, 0, 0, 0.03)'),
                color: isHovered ? 'white' : c.muted,
                fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.3s',
              }}>
                Get Started →
              </div>
            </div>
          );
        })}
      </div>

      {/* Login Link */}
      <p style={{ textAlign: 'center', marginTop: '2.5rem', color: c.muted, fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login')}
          style={{ color: c.link, fontWeight: '600', cursor: 'pointer' }}
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default RoleSelection;
