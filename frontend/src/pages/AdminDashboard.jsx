import { API_URL, ML_URL } from '../config';
import { AlertTriangle, CheckCircle2, ChevronDown, Clock, Shield, Trash2, UserCheck, Users, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const USERS_API_URL = `${API_URL}/api/users`;

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ID of user being acted on
  const [filter, setFilter] = useState('all'); // 'all', 'doctor', 'hospital'
  const [toast, setToast] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${USERS_API_URL}/pending-verification`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPending(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load pending verifications', 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') fetchPending();
  }, [user, fetchPending]);

  const handleVerify = async (id, name) => {
    if (!window.confirm(`Approve ${name}?`)) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${USERS_API_URL}/${id}/verify`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Failed');
      setPending(prev => prev.filter(p => p._id !== id));
      showToast(`${name} has been verified successfully`);
    } catch {
      showToast('Verification failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject and delete ${name}'s registration? This cannot be undone.`)) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${USERS_API_URL}/${id}/reject`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Failed');
      setPending(prev => prev.filter(p => p._id !== id));
      showToast(`${name}'s registration has been rejected`, 'warning');
    } catch {
      showToast('Rejection failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPending = filter === 'all' ? pending : pending.filter(p => p.role === filter);

  const c = {
    bg: darkMode ? '#020617' : '#f8fafc',
    cardBg: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.95)',
    cardBorder: darkMode ? '1px solid rgba(148, 163, 184, 0.12)' : '1px solid rgba(0,0,0,0.06)',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    muted: darkMode ? '#94a3b8' : '#64748b',
    subtle: darkMode ? 'rgba(148, 163, 184, 0.06)' : 'rgba(0, 0, 0, 0.02)',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    accent: darkMode ? '#38bdf8' : '#2563eb',
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{
      minHeight: '100vh', background: c.bg, padding: '80px 24px 40px',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '90px', right: '24px', zIndex: 100,
          padding: '0.85rem 1.25rem', borderRadius: '12px',
          backgroundColor: toast.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : toast.type === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${toast.type === 'error' ? c.danger : toast.type === 'warning' ? c.warning : c.success}40`,
          color: toast.type === 'error' ? c.danger : toast.type === 'warning' ? c.warning : c.success,
          fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem',
          backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          animation: 'slideIn 0.3s ease',
        }}>
          {toast.type === 'error' ? <XCircle size={18} /> : toast.type === 'warning' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {toast.message}
        </div>
      )}

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Shield size={28} color={c.accent} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: c.text, letterSpacing: '-0.02em', margin: 0 }}>
            Admin Dashboard
          </h1>
        </div>
        <p style={{ color: c.muted, fontSize: '0.9rem', marginBottom: '2rem' }}>
          Manage account verifications and platform integrity
        </p>

        {/* Stats Row */}
        <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: Clock, label: 'Pending', value: pending.length, color: c.warning },
            { icon: Users, label: 'Doctors', value: pending.filter(p => p.role === 'doctor').length, color: '#6366f1' },
            { icon: Users, label: 'Hospitals', value: pending.filter(p => p.role === 'hospital').length, color: '#10b981' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: c.cardBg, border: c.cardBorder, borderRadius: '16px', padding: '1.25rem',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <stat.icon size={18} color={stat.color} />
                <span style={{ color: c.muted, fontSize: '0.8rem', fontWeight: '500' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: c.text }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'doctor', label: 'Doctors' },
            { id: 'hospital', label: 'Hospitals' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '10px', border: 'none',
                background: filter === tab.id ? (darkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(37, 99, 235, 0.1)') : c.subtle,
                color: filter === tab.id ? c.accent : c.muted,
                fontWeight: filter === tab.id ? '600' : '400', fontSize: '0.85rem', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pending List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: c.muted }}>Loading...</div>
        ) : filteredPending.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '3rem', background: c.cardBg, border: c.cardBorder,
            borderRadius: '16px', color: c.muted,
          }}>
            <CheckCircle2 size={40} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
            <p style={{ fontSize: '1rem', fontWeight: '600' }}>All caught up!</p>
            <p style={{ fontSize: '0.85rem' }}>No pending verifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredPending.map(p => {
              const isExpanded = expandedId === p._id;
              return (
                <div key={p._id} style={{
                  background: c.cardBg, border: c.cardBorder, borderRadius: '16px', padding: '1.25rem 1.5rem',
                  backdropFilter: 'blur(12px)', transition: 'all 0.2s', cursor: 'pointer',
                  boxShadow: isExpanded ? '0 10px 25px rgba(0,0,0,0.1)' : 'none',
                }}
                onClick={() => setExpandedId(isExpanded ? null : p._id)}>
                  
                  {/* Summary Bar */}
                  <div className="admin-summary-bar" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    
                    {/* Avatar */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                      background: p.role === 'doctor' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #10b981, #14b8a6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      fontSize: '1.1rem', fontWeight: '700',
                    }}>
                      {p.name?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* Basic Info */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="admin-summary-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: '700', color: c.text, fontSize: '1.05rem' }}>{p.name}</span>
                        <span style={{
                          padding: '0.15rem 0.55rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600',
                          background: p.role === 'doctor' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: p.role === 'doctor' ? '#818cf8' : '#34d399',
                          textTransform: 'capitalize',
                        }}>
                          {p.role}
                        </span>
                      </div>
                      
                      <ChevronDown size={20} style={{ color: c.muted, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="admin-expanded-section" style={{
                      marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: `1px solid ${c.cardBorder}`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                    }} onClick={(e) => e.stopPropagation()}>
                      
                      {/* Grid of details */}
                      <div className="admin-detail-grid" style={{ color: c.muted, fontSize: '0.9rem', display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '0.75rem 2rem' }}>
                        <span style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ color: c.text, opacity: 0.6, width: '60px' }}>Email</span>
                          <span style={{ color: c.text, fontWeight: '500' }}>{p.email}</span>
                        </span>
                        
                        {p.licenseNumber && (
                          <span style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ color: c.text, opacity: 0.6, width: '60px' }}>License</span>
                            <span style={{ color: c.text, fontWeight: '500' }}>{p.licenseNumber}</span>
                          </span>
                        )}
                        
                        {p.specialization && (
                          <span style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ color: c.text, opacity: 0.6, width: '60px' }}>Field</span>
                            <span style={{ color: c.text, fontWeight: '500' }}>{p.specialization}</span>
                          </span>
                        )}
                        
                        {p.hospitalName && (
                          <span style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ color: c.text, opacity: 0.6, width: '60px' }}>Hospital</span>
                            <span style={{ color: c.text, fontWeight: '500' }}>{p.hospitalName}</span>
                          </span>
                        )}
                        
                        {p.practiceType && (
                          <span style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ color: c.text, opacity: 0.6, width: '60px' }}>Practice</span>
                            <span style={{ color: c.text, fontWeight: '500' }}>
                               {p.practiceType === 'hospital_affiliated' ? 'Hospital Affiliated' : 'Independent'}
                            </span>
                          </span>
                        )}

                        <span style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ color: c.text, opacity: 0.6, width: '60px' }}>Joined</span>
                          <span style={{ color: c.text, fontWeight: '500' }}>
                            {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="admin-expanded-actions" style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleVerify(p._id, p.name); }}
                          disabled={actionLoading === p._id}
                          style={{
                            padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
                            background: 'rgba(16, 185, 129, 0.15)', color: c.success,
                            fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            transition: 'all 0.2s', opacity: actionLoading === p._id ? 0.5 : 1,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'; }}
                        >
                          <UserCheck size={16} /> Approve
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReject(p._id, p.name); }}
                          disabled={actionLoading === p._id}
                          style={{
                            padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
                            background: 'rgba(239, 68, 68, 0.1)', color: c.danger,
                            fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            transition: 'all 0.2s', opacity: actionLoading === p._id ? 0.5 : 1,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                        >
                          <Trash2 size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Keyframe animation for toast */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
