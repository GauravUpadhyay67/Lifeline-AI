import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../../context/ThemeContext';
import { Activity, Calendar, Clipboard, Clock, Upload, Users, Building, ShieldCheck, UserCircle2 } from 'lucide-react';
import { API_URL } from '../../config';

const DoctorDashboard = ({ user }) => {
  const { darkMode } = useTheme();
  
  const [profileData, setProfileData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
      total: 0,
      pending: 0,
      today: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, [user.token]);

  const fetchProfile = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/api/users/profile`, config);
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${API_URL}/api/appointments/my`, config);
        setAppointments(data);
        
        // Calculate Stats
        const today = new Date().toDateString();
        const todayCount = data.filter(a => new Date(a.date).toDateString() === today).length;
        const pendingCount = data.filter(a => a.status === 'pending').length;
        
        setStats({
            total: data.length,
            pending: pendingCount,
            today: todayCount
        });

    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
        setPreview(URL.createObjectURL(selectedFile));
    }
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = user.token;

    try {
      const response = await axios.post('${API_URL}/api/reports/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Error analyzing image.');
    } finally {
      setLoading(false);
    }
  };

  const c = {
    bg: darkMode
      ? 'linear-gradient(180deg, #020617 0%, #0f172a 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #f0f4ff 100%)',
    cardBg: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    cardBorder: darkMode ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    textHighlight: darkMode ? '#ffffff' : '#0f172a',
    muted: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0,0,0,0.05)',
    primary: darkMode ? '#38bdf8' : '#2563eb',
    primaryBg: darkMode ? 'rgba(56, 189, 248, 0.1)' : 'rgba(37, 99, 235, 0.1)',
    danger: darkMode ? '#ef4444' : '#e11d48',
    dangerBg: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(225, 29, 72, 0.08)',
    success: darkMode ? '#10b981' : '#10b981',
    successBg: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
    caution: darkMode ? '#f59e0b' : '#d97706',
    cautionBg: darkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(217, 119, 6, 0.1)',
    inputBg: darkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
    buttonGradient: darkMode 
      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
      : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    boxShadow: darkMode 
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.05)' 
      : '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
    backdrop: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(15,23,42,0.4)',
  };

  const badgeStyles = (status) => {
      let bg, textColor;
      if (status === 'pending') {
          bg = c.cautionBg;
          textColor = c.caution;
      } else {
          bg = c.successBg;
          textColor = c.success;
      }
      return {
        background: bg,
        color: textColor,
        padding: '0.35rem 0.85rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      };
  };

  const displayName = profileData?.name || user?.name || '';
  const cleanName = displayName.replace(/^Dr\.\s*/i, ''); // Strip leading "Dr. " to avoid "Dr. Dr."

  return (
    <div style={{ background: c.bg, minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Ornaments */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%',
        background: darkMode ? 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%',
        background: darkMode ? 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem', position: 'relative', zIndex: 10, fontFamily: "'Inter', sans-serif" }}>
        
        {/* Header & Affiliation */}
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', color: c.textHighlight, marginBottom: '0.5rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                Welcome back, Dr. {cleanName} <span role="img" aria-label="wave">👋</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: c.muted, margin: 0 }}>Here is your daily activity and patient overview.</p>
          </div>
          
          {/* Affiliation Badge */}
          {profileData && (
              <div style={{
                  background: c.cardBg, 
                  border: c.cardBorder, 
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '16px', 
                  padding: '1rem 1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  boxShadow: c.boxShadow
              }}>
                  <div style={{ background: profileData.isVerified ? c.successBg : c.cautionBg, padding: '0.75rem', borderRadius: '12px', color: profileData.isVerified ? c.success : c.caution }}>
                      {profileData.practiceType === 'hospital_affiliated' ? <Building size={24} /> : <UserCircle2 size={24} />}
                  </div>
                  <div>
                      <h4 style={{ margin: 0, color: c.textHighlight, fontSize: '0.95rem', fontWeight: '700' }}>
                          {profileData.practiceType === 'hospital_affiliated' ? profileData.hospitalName : 'Independent Clinic'}
                      </h4>
                      <p style={{ margin: 0, color: c.muted, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                          {profileData.isVerified ? <ShieldCheck size={14} color={c.success} /> : <Clock size={14} color={c.caution} />}
                          {profileData.isVerified ? 'Verified Affiliation' : 'Pending Verification'}
                      </p>
                  </div>
              </div>
          )}
        </header>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            
            <div style={{ background: c.cardBg, padding: '1.5rem', borderRadius: '24px', boxShadow: c.boxShadow, border: c.cardBorder, display: 'flex', alignItems: 'center', gap: '1.5rem', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: c.primaryBg, color: c.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={28} />
                </div>
                <div>
                    <p style={{ margin: 0, color: c.muted, fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>Total Consultations</p>
                    <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '800', color: c.textHighlight }}>{stats.total}</h3>
                </div>
            </div>

            <div style={{ background: c.cardBg, padding: '1.5rem', borderRadius: '24px', boxShadow: c.boxShadow, border: c.cardBorder, display: 'flex', alignItems: 'center', gap: '1.5rem', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: c.dangerBg, color: c.danger, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={28} />
                </div>
                <div>
                    <p style={{ margin: 0, color: c.muted, fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>Pending Requests</p>
                    <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '800', color: c.textHighlight }}>{stats.pending}</h3>
                </div>
            </div>

            <div style={{ background: c.cardBg, padding: '1.5rem', borderRadius: '24px', boxShadow: c.boxShadow, border: c.cardBorder, display: 'flex', alignItems: 'center', gap: '1.5rem', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: c.successBg, color: c.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={28} />
                </div>
                <div>
                    <p style={{ margin: 0, color: c.muted, fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>Today's Schedule</p>
                    <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '800', color: c.textHighlight }}>{stats.today}</h3>
                </div>
            </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', alignItems: 'start'}}>
            {/* Main Content - Appointments */}
            <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: c.textHighlight, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Clipboard size={24} color={c.primary} /> Upcoming Appointments
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {appointments.length > 0 ? appointments.map(appt => (
                        <div key={appt._id} style={{ background: c.cardBg, padding: '1.5rem', borderRadius: '20px', border: c.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: c.boxShadow }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <div style={{
                                  width: '52px', height: '52px', borderRadius: '14px', 
                                  background: c.inputBg, border: c.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '1.25rem', fontWeight: '800', color: c.muted
                                }}>
                                    {appt.patientName?.charAt(0).toUpperCase() || 'P'}
                                </div>
                                <div>
                                    <h3 style={{margin: 0, color: c.textHighlight, fontSize: '1.1rem', fontWeight: '700'}}>{appt.patientName}</h3>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: c.muted, fontSize: '0.85rem', marginTop: '0.35rem', fontWeight: '500'}}>
                                      <Calendar size={14} /> 
                                      {new Date(appt.date).toLocaleDateString()} at {new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                  <span style={badgeStyles(appt.status)}>{appt.status}</span>
                                  <p style={{margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: c.muted, maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500'}}>
                                      {appt.reason}
                                  </p>
                            </div>
                        </div>
                    )) : (
                        <div style={{textAlign: 'center', padding: '3.5rem 2rem', background: c.cardBg, borderRadius: '24px', border: c.cardBorder, borderStyle: 'dashed', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'}}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: c.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: c.muted }}>
                                <Calendar size={28} />
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: c.textHighlight, fontSize: '1.1rem' }}>No Appointments Today</h3>
                            <p style={{color: c.muted, margin: 0, fontSize: '0.9rem'}}>You have a clear schedule. Enjoy your shift!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar - Quick Actions */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: c.textHighlight, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Activity size={24} color={c.primary} /> Quick Actions
              </h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                  <div 
                      onClick={() => setShowUploadModal(true)}
                      style={{ background: c.cardBg, padding: '2.5rem 2rem', borderRadius: '24px', border: c.cardBorder, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: c.boxShadow }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = c.primary; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = c.cardBorder.split(' ')[2]; }}
                  >
                      <div style={{
                          width: '72px', height: '72px', margin: '0 auto 1.25rem', 
                          background: c.primaryBg, borderRadius: '20px', color: c.primary,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                          <Upload size={32} />
                      </div>
                      <h3 style={{margin: 0, marginBottom: '0.5rem', color: c.textHighlight, fontSize: '1.25rem', fontWeight: '700'}}>Analyze Document</h3>
                      <p style={{margin: 0, color: c.muted, fontSize: '0.9rem', lineHeight: '1.5'}}>Upload patient medical imagery or text reports for AI-assisted diagnostics.</p>
                  </div>

                  <div 
                      style={{ background: c.cardBg, padding: '2.5rem 2rem', borderRadius: '24px', border: c.cardBorder, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: c.boxShadow }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = c.caution; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = c.cardBorder.split(' ')[2]; }}
                  >
                      <div style={{
                          width: '72px', height: '72px', margin: '0 auto 1.25rem', 
                          background: c.cautionBg, borderRadius: '20px', color: c.caution,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                          <Users size={32} />
                      </div>
                      <h3 style={{margin: 0, marginBottom: '0.5rem', color: c.textHighlight, fontSize: '1.25rem', fontWeight: '700'}}>Patient Records</h3>
                      <p style={{margin: 0, color: c.muted, fontSize: '0.9rem', lineHeight: '1.5'}}>Access and manage comprehensive medical history and active prescriptions.</p>
                  </div>
              </div>
            </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.backdrop, backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh', zIndex: 1000, padding: '3rem 1rem' }} onClick={() => setShowUploadModal(false)}>
            <div style={{ background: c.cardBg, border: c.cardBorder, borderRadius: '24px', padding: '0', width: '100%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', WebkitBackdropFilter: 'blur(24px)', backdropFilter: 'blur(24px)' }} onClick={e => e.stopPropagation()}>
              
              <div style={{ padding: '1.5rem 2rem', borderBottom: c.cardBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ color: c.textHighlight, fontSize: '1.25rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <Activity size={20} color={c.primary}/> Diagnostic AI Upload
                 </h3>
                 <button 
                  onClick={() => setShowUploadModal(false)}
                  style={{ background: c.inputBg, border: c.cardBorder, borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: c.muted, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = c.danger; }}
                  onMouseLeave={e => { e.currentTarget.style.color = c.muted; }}
                 >
                   &times;
                 </button>
              </div>
              
              <div style={{ padding: '2rem' }}>
                  <div style={{textAlign: 'center', padding: '3rem 2rem', border: `2px dashed ${c.border}`, borderRadius: '16px', background: c.inputBg, marginBottom: '2rem'}}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: c.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: c.primary }}>
                        <Upload size={28} />
                    </div>
                    <h4 style={{ color: c.textHighlight, fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Select Patient Imagery</h4>
                    <p style={{ color: c.muted, fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '300px', margin: '0 auto 1.5rem auto' }}>Supported formats: PNG, JPG, or DICOM exports.</p>
                    
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      style={{
                          display: 'block', margin: '0 auto', color: c.muted,
                          fontSize: '0.9rem', outline: 'none'
                      }}
                    />

                    {preview && (
                      <div style={{ marginTop: '2rem', padding: '1rem', background: c.cardBg, borderRadius: '12px', border: c.cardBorder, display: 'inline-block' }}>
                        <img src={preview} alt="Upload Preview" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px' }} />
                      </div>
                    )}
                  </div>

                  {file && (
                    <button 
                      style={{
                          display: 'block', width: '100%',
                          background: c.buttonGradient, color: 'white', padding: '1.15rem', 
                          borderRadius: '16px', border: 'none', fontWeight: '700', fontSize: '1rem', 
                          cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                          boxShadow: '0 8px 25px rgba(37,99,235,0.25)',
                          opacity: loading ? 0.7 : 1
                      }} 
                      onClick={handleSubmit} 
                      disabled={loading}
                    >
                      {loading ? 'Initializing Local AI Engine (This may take a moment)...' : 'Run Diagnostics'}
                    </button>
                  )}
              </div>

              {result && (
                <div style={{ padding: '0 2rem 2rem 2rem' }}>
                    <div style={{ borderTop: c.cardBorder, paddingTop: '2rem' }}>
                        <h4 style={{ color: c.success, marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={20} /> Analysis Results
                        </h4>
                        <div style={{ background: c.inputBg, padding: '1.5rem', borderRadius: '16px', border: c.cardBorder, color: c.muted, fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {result.analysis ? (
                                <ReactMarkdown 
                                    components={{
                                        p: ({node, ...props}) => <p style={{margin: 0, marginBottom: '0.75rem'}} {...props} />,
                                        strong: ({node, ...props}) => <strong style={{color: c.textHighlight, fontWeight: '700'}} {...props} />,
                                        ul: ({node, ...props}) => <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}} {...props} />,
                                        li: ({node, ...props}) => <li style={{marginBottom: '0.4rem', color: c.textHighlight}} {...props} />,
                                    }}
                                >
                                    {result.analysis}
                                </ReactMarkdown>
                            ) : (
                                <p>No analysis generated. Please ensure the image is clear.</p>
                            )}
                        </div>
                    </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
