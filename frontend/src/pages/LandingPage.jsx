import { Activity, ArrowRight, CheckCircle2, Clock, Droplet, FileText, Heart, MessageCircle, Shield, Stethoscope, Users, Zap } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user } = useSelector((state) => state.auth);

  const c = {
    text: darkMode ? '#f1f5f9' : '#1e293b',
    muted: darkMode ? '#94a3b8' : '#64748b',
    subtle: darkMode ? '#475569' : '#94a3b8',
    cardBg: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.7)',
    cardBorder: darkMode ? 'rgba(148, 163, 184, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    sectionAlt: darkMode ? '#0f172a' : '#f8fafc',
  };

  const features = [
    { icon: <Activity size={26} />, color: '#38bdf8', bg: darkMode ? 'rgba(56,189,248,0.1)' : '#e0f2fe', title: 'AI Disease Detection', desc: 'Upload X-rays and MRI scans for instant AI-powered analysis. Get detailed reports identifying potential conditions with confidence levels.' },
    { icon: <Droplet size={26} />, color: '#f43f5e', bg: darkMode ? 'rgba(244,63,94,0.1)' : '#ffe4e6', title: 'Blood Management', desc: 'Hospitals manage blood inventory in real-time. Donors get instant emergency notifications. Life-saving coordination made simple.' },
    { icon: <Stethoscope size={26} />, color: '#10b981', bg: darkMode ? 'rgba(16,185,129,0.1)' : '#dcfce7', title: 'Doctor Consultations', desc: 'Book appointments with verified specialists. Manage your health records and prescriptions all in one secure, accessible portal.' },
    { icon: <FileText size={26} />, color: '#a78bfa', bg: darkMode ? 'rgba(167,139,250,0.1)' : '#f3e8ff', title: 'Smart Report Analysis', desc: 'Upload complex lab reports and get plain-language explanations. Understand your health better without medical jargon.' },
  ];

  const stats = [
    { value: '99.2%', label: 'Detection Accuracy' },
    { value: 'Instant', label: 'Emergency Alerts' },
    { value: '8+', label: 'Blood Types Tracked' },
    { value: '24/7', label: 'AI Health Assistant' },
  ];

  const howItWorks = [
    { step: '01', icon: <Users size={24} />, title: 'Create Your Account', desc: 'Sign up as a Patient, Doctor, or Hospital. Patients get instant access. Doctors and Hospitals undergo a secure admin verification process.' },
    { step: '02', icon: <Activity size={24} />, title: 'Access AI-Powered Tools', desc: 'Use our disease detection AI, smart report analysis, or chat with our health assistant. All tools are available from your personalized dashboard.' },
    { step: '03', icon: <Stethoscope size={24} />, title: 'Connect with Experts', desc: 'Book appointments with verified doctors, manage prescriptions, and build your complete digital health profile.' },
    { step: '04', icon: <Heart size={24} />, title: 'Save Lives Together', desc: 'Toggle blood donor status to receive emergency requests. Hospitals coordinate blood inventory. Every action makes a difference.' },
  ];

  const ctaAction = () => navigate(user ? '/dashboard' : '/register');
  const ctaLabel = user ? 'Go to Dashboard' : 'Get Started Free';

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: darkMode
        ? 'linear-gradient(180deg, #020617 0%, #0f172a 40%, #020617 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f0f4ff 40%, #ffffff 100%)',
      color: c.text,
      overflowX: 'hidden',
    }}>
      
      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '350px', borderRadius: '50%',
          background: darkMode
            ? 'radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(37,99,235,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: '9999px',
          backgroundColor: darkMode ? 'rgba(56,189,248,0.08)' : 'rgba(37,99,235,0.06)',
          border: `1px solid ${darkMode ? 'rgba(56,189,248,0.2)' : 'rgba(37,99,235,0.12)'}`,
          color: darkMode ? '#38bdf8' : '#2563eb',
          fontSize: '0.8rem', fontWeight: '600', marginBottom: '2rem',
          position: 'relative',
        }}>
          <Zap size={14} fill="currentColor" />
          AI-Powered Healthcare Platform
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)', fontWeight: '800',
          marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: '1.1',
          maxWidth: '850px', position: 'relative', color: c.text,
        }}>
          Intelligent Healthcare,<br />
          <span style={{
            backgroundImage: darkMode
              ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)'
              : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #9333ea 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}>Unified for Everyone.</span>
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', color: c.muted,
          maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: '1.7',
          position: 'relative',
        }}>
          AI diagnostics, verified doctor consultations, and life-saving blood management — all in one secure platform built for patients, doctors, and hospitals.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
          <button 
            style={{
              padding: '0.85rem 2.2rem', fontSize: '1rem', fontWeight: '700',
              color: 'white',
              background: darkMode
                ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              border: 'none', borderRadius: '14px', cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(37,99,235,0.3)',
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
            }}
            onClick={ctaAction}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(37,99,235,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(37,99,235,0.3)'; }}
          >
            {ctaLabel} <ArrowRight size={18} />
          </button>
          
          <button 
            style={{
              padding: '0.85rem 2.2rem', fontSize: '1rem', fontWeight: '600',
              color: c.text, backgroundColor: 'transparent',
              border: `1px solid ${darkMode ? 'rgba(148,163,184,0.2)' : '#d1d5db'}`,
              borderRadius: '14px', cursor: 'pointer', transition: 'all 0.3s',
            }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.02)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Learn More
          </button>
        </div>

        {/* Trust Badges */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: <Shield size={18} />, text: 'Verified Doctors & Hospitals' },
            { icon: <Heart size={18} />, text: 'Integrated Donor Network' },
            { icon: <CheckCircle2 size={18} />, text: 'Secure & Private' },
          ].map((tp, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              color: c.muted, fontSize: '0.82rem', fontWeight: '500',
            }}>
              <span style={{ color: darkMode ? '#38bdf8' : '#2563eb' }}>{tp.icon}</span>
              {tp.text}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section style={{ display: 'flex', justifyContent: 'center', padding: '0 2rem', maxWidth: '900px', margin: '-2rem auto 0', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', width: '100%',
          background: darkMode ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)', borderRadius: '18px',
          border: `1px solid ${darkMode ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.06)'}`,
          boxShadow: darkMode ? '0 8px 30px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.06)',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '1.4rem 1rem', textAlign: 'center',
              borderRight: i < 3 ? `1px solid ${darkMode ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.05)'}` : 'none',
            }}>
              <div style={{
                fontSize: '1.25rem', fontWeight: '800',
                backgroundImage: darkMode
                  ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem',
              }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: c.muted, fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" style={{ padding: '7rem 2rem 5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: darkMode ? '#38bdf8' : '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          PLATFORM FEATURES
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', color: c.text, marginBottom: '0.75rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
          Everything You Need in One Place
        </h2>
        <p style={{ color: c.muted, fontSize: '1rem', marginBottom: '3.5rem', maxWidth: '520px', textAlign: 'center', lineHeight: '1.6' }}>
          From AI-powered diagnostics to blood bank management — tools that make healthcare smarter, faster, and more accessible.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem', maxWidth: '1100px', width: '100%' }}>
          {features.map((f, i) => (
            <div 
              key={i}
              style={{
                padding: '1.75rem', borderRadius: '18px',
                background: c.cardBg, border: `1px solid ${c.cardBorder}`,
                backdropFilter: 'blur(8px)', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'default', position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = darkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 16px 40px rgba(0,0,0,0.07)';
                e.currentTarget.style.borderColor = darkMode ? 'rgba(56,189,248,0.15)' : 'rgba(37,99,235,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = c.cardBorder;
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`, opacity: 0.5 }} />
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: f.bg, color: f.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.1rem',
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: c.text, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: c.muted, lineHeight: '1.6', fontSize: '0.88rem', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section style={{
        padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: c.sectionAlt,
        borderTop: `1px solid ${darkMode ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.04)'}`,
        borderBottom: `1px solid ${darkMode ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.04)'}`,
      }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: darkMode ? '#38bdf8' : '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          HOW IT WORKS
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', color: c.text, marginBottom: '0.75rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
          Get Started in 4 Simple Steps
        </h2>
        <p style={{ color: c.muted, fontSize: '1rem', marginBottom: '3.5rem', maxWidth: '500px', textAlign: 'center', lineHeight: '1.6' }}>
          Whether you're a patient, doctor, or hospital — getting started takes less than 2 minutes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', maxWidth: '1100px', width: '100%' }}>
          {howItWorks.map((item, i) => (
            <div key={i} style={{
              padding: '1.75rem', borderRadius: '18px',
              background: c.cardBg, border: `1px solid ${c.cardBorder}`,
              backdropFilter: 'blur(8px)', position: 'relative',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                fontSize: '2.5rem', fontWeight: '900',
                color: darkMode ? 'rgba(56,189,248,0.08)' : 'rgba(37,99,235,0.06)',
                position: 'absolute', top: '1rem', right: '1.25rem',
                lineHeight: 1,
              }}>{item.step}</div>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: darkMode ? 'rgba(56,189,248,0.08)' : 'rgba(37,99,235,0.06)',
                color: darkMode ? '#38bdf8' : '#2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
              }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: c.text, marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: c.muted, lineHeight: '1.6', fontSize: '0.85rem', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FOR EACH ROLE ═══════════════ */}
      <section style={{ padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: darkMode ? '#38bdf8' : '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          BUILT FOR EVERYONE
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', color: c.text, marginBottom: '3.5rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
          One Platform, Every Role
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '1000px', width: '100%' }}>
          {[
            {
              role: '🩺 For Patients',
              color: darkMode ? 'rgba(56,189,248,0.08)' : 'rgba(37,99,235,0.04)',
              borderAccent: '#38bdf8',
              items: ['AI-powered disease detection from scans', 'Book appointments with verified doctors', 'Chat with 24/7 AI health assistant', 'Toggle blood donor status anytime', 'View & manage health records'],
            },
            {
              role: '⚕️ For Doctors',
              color: darkMode ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.04)',
              borderAccent: '#10b981',
              items: ['Manage patient appointments', 'Hospital-affiliated or Independent Clinic', 'View patient medical reports', 'Admin-verified credentials for trust', 'Professional dashboard & analytics'],
            },
            {
              role: '🏥 For Hospitals',
              color: darkMode ? 'rgba(167,139,250,0.08)' : 'rgba(124,58,237,0.04)',
              borderAccent: '#a78bfa',
              items: ['Real-time blood inventory management', 'Broadcast emergency blood requests', 'AI demand forecasting for blood supply', 'Manage hospital staff & appointments', 'Verified institution badge'],
            },
          ].map((card, i) => (
            <div key={i} style={{
              padding: '2rem', borderRadius: '18px',
              background: c.cardBg, border: `1px solid ${c.cardBorder}`,
              borderTop: `3px solid ${card.borderAccent}`,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: c.text, marginBottom: '1.25rem' }}>{card.role}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {card.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: c.muted }}>
                    <CheckCircle2 size={16} style={{ color: card.borderAccent, flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section style={{ padding: '4rem 2rem 5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '750px', width: '100%', padding: '3rem 2rem', borderRadius: '22px',
          background: darkMode
            ? 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.5) 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
          border: `1px solid ${darkMode ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.05)'}`,
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-40%', right: '-15%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40%', left: '-15%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: c.text, marginBottom: '0.75rem', letterSpacing: '-0.02em', position: 'relative' }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: c.muted, fontSize: '1rem', marginBottom: '1.75rem', lineHeight: '1.6', position: 'relative' }}>
            Join healthcare professionals and patients using Lifeline AI for smarter diagnostics, efficient blood management, and seamless patient care.
          </p>
          <button
            style={{
              padding: '0.85rem 2.5rem', fontSize: '1rem', fontWeight: '700',
              color: 'white',
              background: darkMode ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              border: 'none', borderRadius: '14px', cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(37,99,235,0.3)',
              transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', position: 'relative',
            }}
            onClick={ctaAction}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(37,99,235,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(37,99,235,0.3)'; }}
          >
            {ctaLabel} <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{
        padding: '2rem', textAlign: 'center',
        color: c.subtle, fontSize: '0.8rem',
        borderTop: `1px solid ${darkMode ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.04)'}`,
      }}>
        <p style={{ margin: 0 }}>© 2026 Lifeline AI — Built for better healthcare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
