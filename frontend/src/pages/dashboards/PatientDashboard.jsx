import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ML_URL } from '../../config';
import { useTheme } from '../../context/ThemeContext';
import { setCredentials } from '../../redux/slices/authSlice';
import { connectSocket, disconnectSocket, socket } from '../../utils/socket';
import {
    Activity, Calendar, Clock, Droplet, FileText,
    Heart, MapPin, MessageCircle, Stethoscope, User,
    ShieldCheck, AlertCircle, PhoneCall
} from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useTheme();

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', reason: '' });

  // Blood Donor state
  const [isDonor, setIsDonor] = useState(user?.isBloodDonor || false);
  const [donorToggleLoading, setDonorToggleLoading] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [showBloodTypeModal, setShowBloodTypeModal] = useState(false);
  const [selectedBloodType, setSelectedBloodType] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, [user.token]);

  // Socket connection for donor notifications
  useEffect(() => {
    if (isDonor && user?._id) {
      connectSocket(user._id);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            socket.emit('update_location', {
              userId: user._id,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => console.error('Location error:', err)
        );
      }

      socket.on('new_blood_request', (data) => {
        setIncomingRequest(data);
      });

      return () => {
        socket.off('new_blood_request');
        disconnectSocket();
      };
    }
  }, [isDonor, user]);

  const handleToggleDonor = async () => {
    if (!isDonor && !user.bloodType) {
      setShowBloodTypeModal(true);
      return;
    }
    await performToggleDonor();
  };

  const performToggleDonor = async (bloodType = null) => {
    setDonorToggleLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${API_URL}/api/users/toggle-donor`, 
        { bloodType: bloodType || user.bloodType }, 
        config
      );
      setIsDonor(data.isBloodDonor);
      dispatch(setCredentials({ 
        ...user, 
        isBloodDonor: data.isBloodDonor,
        bloodType: data.bloodType || user.bloodType 
      }));
      if (bloodType) setShowBloodTypeModal(false);
    } catch (error) {
      console.error('Toggle donor error:', error);
      alert('Failed to update donor status');
    } finally {
      setDonorToggleLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!incomingRequest) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/api/requests/${incomingRequest.requestId}/accept`, {}, config);
      alert('Thank you! The hospital has been notified.');
      setIncomingRequest(null);
    } catch (error) {
      alert('Failed to accept request.');
    }
  };

  const fetchDoctors = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/api/users/doctors`, config);
      setDoctors(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/api/appointments/my`, config);
      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/appointments`, {
        doctorId: selectedDoctor._id,
        date: bookingData.date,
        reason: bookingData.reason
      }, config);
      
      alert('Appointment booked successfully!');
      setShowModal(false);
      fetchAppointments();
      setBookingData({ date: '', reason: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking appointment');
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

  const statusBadgeStyle = (status) => {
      let bg, textColor;
      if (status === 'approved') {
          bg = c.successBg; textColor = c.success;
      } else if (status === 'pending') {
          bg = c.cautionBg; textColor = c.caution;
      } else {
          bg = c.dangerBg; textColor = c.danger;
      }
      return {
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          backgroundColor: bg,
          color: textColor,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
      };
  };

  const ActionCard = ({ icon: Icon, title, desc, btnText, color, onClick }) => {
      const [hover, setHover] = useState(false);
      return (
          <div 
            style={{
                background: c.cardBg, 
                padding: '2rem 1.75rem', 
                borderRadius: '24px', 
                border: hover ? `1px solid ${color}` : c.cardBorder, 
                textAlign: 'center', 
                cursor: 'pointer', 
                transition: 'all 0.3s', 
                backdropFilter: 'blur(16px)', 
                WebkitBackdropFilter: 'blur(16px)', 
                boxShadow: hover ? `0 20px 25px -5px rgba(0,0,0,0.1), 0 0 20px ${color}33` : c.boxShadow,
                transform: hover ? 'translateY(-4px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
          >
              <div style={{
                  width: '64px', height: '64px', margin: '0 auto 1.25rem', 
                  background: `${color}15`, borderRadius: '20px', color: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                  <Icon size={28} />
              </div>
              <h3 style={{margin: 0, marginBottom: '0.75rem', color: c.textHighlight, fontSize: '1.25rem', fontWeight: '800'}}>{title}</h3>
              <p style={{margin: '0 0 2rem 0', color: c.muted, fontSize: '0.9rem', lineHeight: '1.5', flex: 1}}>{desc}</p>
              <button style={{
                  width: '100%', padding: '0.9rem', 
                  background: color, color: '#ffffff', border: 'none', 
                  borderRadius: '12px', fontWeight: '700', fontSize: '0.95rem',
                  boxShadow: `0 4px 14px ${color}40`, transition: 'all 0.2s', cursor: 'pointer'
              }} onMouseEnter={e => e.currentTarget.style.opacity=0.9} onMouseLeave={e => e.currentTarget.style.opacity=1}>
                  {btnText}
              </button>
          </div>
      )
  };

  return (
    <div style={{ background: c.bg, minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Ornaments */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: darkMode ? 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: darkMode ? 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem', position: 'relative', zIndex: 10, fontFamily: "'Inter', sans-serif" }}>
        
        {/* Header */}
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: c.textHighlight, marginBottom: '0.5rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Hello, {user?.name || 'Patient'} <span role="img" aria-label="wave">👋</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: c.muted, margin: 0 }}>Welcome to your personal health command center.</p>
        </header>

        {/* Quick Actions */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: c.textHighlight, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={24} color={c.primary} /> Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <ActionCard icon={Activity} title="AI Health Checkup" desc="Upload X-rays or MRI scans for instant AI-powered disease detection." btnText="Start Analysis" color={c.primary} onClick={() => navigate('/disease-detection')} />
          <ActionCard icon={MessageCircle} title="Health Assistant" desc="Chat with our 24/7 AI assistant for medical advice and symptom checking." btnText="Chat Now" color={c.success} onClick={() => navigate('/chatbot')} />
          <ActionCard icon={FileText} title="Medical Reports" desc="Securely access and manage your complete medical history and analysis results." btnText="View Records" color="#a855f7" onClick={() => navigate('/medical-reports')} />
        </div>

        {/* Donor Section */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: c.textHighlight, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Heart size={24} color={c.danger} /> Blood Donor Registration
        </h2>
        <div style={{
            background: c.cardBg, borderRadius: '24px', padding: '2rem', border: c.cardBorder, 
            boxShadow: c.boxShadow, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            flexWrap: 'wrap', gap: '1.5rem', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', marginBottom: '4rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: '300px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '20px',
                    background: isDonor ? c.dangerBg : c.inputBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isDonor ? c.danger : c.muted,
                    transition: 'all 0.3s',
                    boxShadow: isDonor ? `0 0 20px ${c.danger}40` : 'none'
                }}>
                    <Droplet size={28} />
                </div>
                <div>
                    <h3 style={{ margin: 0, color: c.textHighlight, fontWeight: '800', fontSize: '1.25rem' }}>
                        {isDonor ? 'You are an Active Blood Donor' : 'Become a Lifesaver Today'}
                    </h3>
                    <p style={{ margin: '0.35rem 0 0', color: c.muted, fontSize: '0.95rem' }}>
                        {isDonor 
                            ? 'Your beacon is active. You will receive real-time alerts for local hospital emergencies.' 
                            : 'Opt-in to verify your location and receive ping notifications for urgent nearby blood shortages.'}
                    </p>
                </div>
            </div>
            
            <button
              onClick={handleToggleDonor}
              disabled={donorToggleLoading}
              style={{
                padding: '1rem 2.5rem', borderRadius: '14px', border: 'none', fontWeight: '700', fontSize: '1rem',
                cursor: donorToggleLoading ? 'not-allowed' : 'pointer', opacity: donorToggleLoading ? 0.6 : 1, transition: 'all 0.3s',
                background: isDonor ? c.inputBg : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: isDonor ? c.muted : '#ffffff',
                boxShadow: isDonor ? 'none' : '0 8px 20px rgba(239,68,68,0.3)',
                border: isDonor ? c.cardBorder : 'none'
              }}
              onMouseEnter={e => { if(!isDonor) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { if(!isDonor) e.currentTarget.style.transform = 'none' }}
            >
              {donorToggleLoading ? 'Connecting...' : isDonor ? 'Deactivate Beacon' : 'Activate Donor Beacon'}
            </button>
        </div>

        {/* Find a Doctor */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: c.textHighlight, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Stethoscope size={24} color={c.primary} /> Top Specialists
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {doctors.length > 0 ? doctors.map(doc => (
                <div 
                    key={doc._id} 
                    style={{
                        background: c.cardBg, borderRadius: '24px', border: c.cardBorder, padding: '2rem',
                        boxShadow: c.boxShadow, backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = c.primary }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = c.cardBorder.split(' ')[2] }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: c.inputBg, border: c.cardBorder, color: c.muted, fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {doc.name.charAt(0)}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: c.textHighlight, fontSize: '1.2rem', fontWeight: '800' }}>Dr. {doc.name.replace(/^Dr\.\s*/i, '')}</h3>
                            <span style={{ display: 'inline-block', margin: '0.3rem 0 0 0', padding: '0.2rem 0.6rem', background: c.primaryBg, color: c.primary, borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                {doc.specialization || 'General'}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: c.muted, fontSize: '0.95rem', marginBottom: '2rem', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <MapPin size={18} color={c.primary} /> <span style={{ fontWeight: '500' }}>{doc.hospitalName || 'Independent Practice'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Clock size={16} color={c.success} /> <span>Consultations Available Now</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => { setSelectedDoctor(doc); setShowModal(true); }}
                        style={{
                            width: '100%', padding: '0.9rem', background: c.inputBg, color: c.textHighlight, border: c.cardBorder,
                            borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = c.primary; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = c.inputBg; e.currentTarget.style.color = c.textHighlight }}
                    >
                        <Calendar size={18} /> Book Appointment
                    </button>
                </div>
            )) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: c.cardBg, borderRadius: '24px', border: `2px dashed ${c.border}` }}>
                     <User size={48} color={c.muted} style={{ marginBottom: '1rem' }} />
                     <p style={{ color: c.muted, margin: 0, fontSize: '1.05rem' }}>No specialists found in your direct network.</p>
                </div>
            )}
        </div>

        {/* Your Appointments */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: c.textHighlight, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={24} color={c.success} /> Your Confirmed Appointments
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appointments.length > 0 ? appointments.map(appt => {
                const dateObj = new Date(appt.date);
                const day = dateObj.getDate();
                const month = dateObj.toLocaleString('default', { month: 'short' });
                const time = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                return (
                <div key={appt._id} style={{
                    background: c.cardBg, borderRadius: '20px', border: c.cardBorder, padding: '1.5rem 2rem',
                    boxShadow: c.boxShadow, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '1.5rem', transition: 'transform 0.2s'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ background: c.primaryBg, padding: '0.75rem 1rem', borderRadius: '14px', border: `1px solid ${c.primary}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '80px' }}>
                            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: c.primary, lineHeight: 1 }}>{day}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: c.primary, textTransform: 'uppercase', marginTop: '0.2rem' }}>{month}</span>
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 0.25rem 0', color: c.textHighlight, fontSize: '1.15rem', fontWeight: '800' }}>Dr. {appt.doctorName.replace(/^Dr\.\s*/i, '')}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: c.muted, fontSize: '0.9rem', fontWeight: '500' }}>
                                <Clock size={14} color={c.success} /> {time}
                            </div>
                            <p style={{ margin: '0.5rem 0 0 0', color: c.muted, fontSize: '0.85rem' }}>Reason: {appt.reason}</p>
                        </div>
                    </div>
                    <div>
                        <span style={statusBadgeStyle(appt.status)}>
                           <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                           {appt.status}
                        </span>
                    </div>
                </div>
                )
            }) : (
                <div style={{ textAlign: 'center', padding: '4rem', background: c.cardBg, borderRadius: '24px', border: `2px dashed ${c.border}` }}>
                    <div style={{ background: c.inputBg, width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: c.muted }}>
                        <Calendar size={32} />
                    </div>
                     <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: c.textHighlight }}>No appointments booked</p>
                     <p style={{ margin: '0.5rem 0 0 0', color: c.muted }}>Your schedule is clear. Book an appointment above when needed.</p>
                </div>
            )}
        </div>

        {/* Incoming Blood Request Modal */}
        {incomingRequest && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.backdrop, backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ background: c.cardBg, border: `2px solid ${c.danger}`, borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: `0 20px 40px -10px ${c.danger}40`, textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: c.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: c.danger }}>
                  <AlertCircle size={40} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: c.textHighlight, margin: '0 0 1rem 0' }}>S.O.S Blood Match!</h3>
              <p style={{ color: c.muted, marginBottom: '2rem', lineHeight: '1.5' }}>A nearby hospital urgently needs your exact blood type. Can you deploy?</p>
              
              <div style={{ background: c.inputBg, border: c.cardBorder, borderRadius: '16px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: c.cardBorder, paddingBottom: '0.75rem' }}>
                      <span style={{ color: c.muted, fontWeight: '600' }}>Hospital:</span>
                      <span style={{ color: c.textHighlight, fontWeight: '700' }}>{incomingRequest.hospitalName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: c.cardBorder, paddingBottom: '0.75rem' }}>
                      <span style={{ color: c.muted, fontWeight: '600' }}>Required Type:</span>
                      <span style={{ color: c.danger, fontWeight: '800', fontSize: '1.1rem' }}>{incomingRequest.bloodType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: c.cardBorder, paddingBottom: '0.75rem' }}>
                      <span style={{ color: c.muted, fontWeight: '600' }}>Urgency:</span>
                      <span style={{ color: c.caution, fontWeight: '800', textTransform: 'uppercase' }}>{incomingRequest.urgency}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: c.muted, fontWeight: '600' }}>Location:</span>
                      <span style={{ color: c.textHighlight, textAlign: 'right' }}>{incomingRequest.location?.address || 'Verified Hub'}</span>
                  </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <button 
                    onClick={handleAcceptRequest} 
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 8px 16px rgba(16,185,129,0.3)' }}
                >
                    <MapPin size={18} /> Accept & Dispatch
                </button>
                <button 
                    onClick={() => setIncomingRequest(null)} 
                    style={{ background: c.inputBg, color: c.muted, border: c.cardBorder, padding: '1rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                    Dismiss Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.backdrop, backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setShowModal(false)}>
            <div style={{ background: c.cardBg, border: c.cardBorder, padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '440px', boxShadow: c.boxShadow, color: c.textHighlight }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                      <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '800' }}>Book Consultation</h2>
                      <p style={{ margin: '0.25rem 0 0 0', color: c.muted, fontSize: '0.9rem' }}>with Dr. {selectedDoctor?.name.replace(/^Dr\.\s*/i, '')}</p>
                  </div>
                  <div style={{ background: c.primaryBg, padding: '0.65rem', borderRadius: '12px', color: c.primary }}>
                      <Calendar size={22} />
                  </div>
              </div>
              
              <form onSubmit={handleBook}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: c.textHighlight, fontSize: '0.9rem' }}>Select Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: c.cardBorder, backgroundColor: c.inputBg, color: c.textHighlight, fontSize: '0.95rem', outline: 'none' }}
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  />
                  <style>{`
                      input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                          filter: ${darkMode ? 'invert(1)' : 'none'};
                      }
                  `}</style>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: c.textHighlight, fontSize: '0.9rem' }}>Reason for Visit</label>
                  <textarea 
                    required
                    rows="3"
                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: c.cardBorder, backgroundColor: c.inputBg, color: c.textHighlight, fontSize: '0.95rem', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                    placeholder="Briefly describe your symptoms or query..."
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', background: c.inputBg, border: c.cardBorder, color: c.muted, fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 2, padding: '0.9rem', borderRadius: '12px', background: c.primary, border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)' }}>Confirm Booking</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Blood Type Selection Modal */}
        {showBloodTypeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.backdrop, backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '1rem' }} onClick={() => setShowBloodTypeModal(false)}>
            <div style={{ background: c.cardBg, border: c.cardBorder, padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: c.boxShadow, color: c.textHighlight, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: c.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: c.danger }}>
                  <Droplet size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 1rem 0' }}>Select Blood Type</h3>
              <p style={{ color: c.muted, marginBottom: '2rem', fontSize: '0.95rem' }}>We need your blood type to register you as a donor.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedBloodType(type)}
                        style={{
                            padding: '0.75rem 0',
                            borderRadius: '12px',
                            border: selectedBloodType === type ? `2px solid ${c.danger}` : c.cardBorder,
                            background: selectedBloodType === type ? c.dangerBg : c.inputBg,
                            color: selectedBloodType === type ? c.danger : c.textHighlight,
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                      >
                          {type}
                      </button>
                  ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setShowBloodTypeModal(false)} style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', background: c.inputBg, border: c.cardBorder, color: c.muted, fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                  <button 
                    disabled={!selectedBloodType || donorToggleLoading}
                    onClick={() => performToggleDonor(selectedBloodType)}
                    style={{ flex: 2, padding: '0.9rem', borderRadius: '12px', background: c.danger, border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer', opacity: (!selectedBloodType || donorToggleLoading) ? 0.6 : 1, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                  >
                    {donorToggleLoading ? 'Registering...' : 'Register as Donor'}
                  </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
