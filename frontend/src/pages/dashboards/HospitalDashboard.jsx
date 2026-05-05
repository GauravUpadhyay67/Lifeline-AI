import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../../context/ThemeContext';
import { connectSocket, disconnectSocket, socket } from '../../utils/socket';
import { Activity, AlertCircle, Droplet, Users, BrainCircuit, Edit2, CheckCircle2, MapPin, Search, ChevronRight, Bed, UserCheck } from 'lucide-react';

const HospitalDashboard = ({ user }) => {
  const { darkMode } = useTheme();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    bloodType: 'A+',
    quantity: 1,
    urgency: 'High',
    location: { lat: 28.6139, lng: 77.2090, address: 'AIIMS, New Delhi' },
    notes: ''
  });

  const [inventory, setInventory] = useState(null);
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [editStock, setEditStock] = useState({});

  const [isEditingBeds, setIsEditingBeds] = useState(false);
  const [editBeds, setEditBeds] = useState({
    icu: { total: 0, occupied: 0 },
    general: { total: 0, occupied: 0 }
  });

  const [showForecastModal, setShowForecastModal] = useState(false);
  const [forecast, setForecast] = useState('');
  const [loadingForecast, setLoadingForecast] = useState(false);

  const [myRequests, setMyRequests] = useState([]);

  const [affiliatedDoctors, setAffiliatedDoctors] = useState([]);
  const [verifyingDoctor, setVerifyingDoctor] = useState(null);
  
  const [activeStaffTab, setActiveStaffTab] = useState('active'); // 'active' | 'pending'

  useEffect(() => {
    fetchInventory();
    fetchMyRequests();
    fetchAffiliatedDoctors();

    if (user?._id) {
      connectSocket(user._id);
      
      socket.on('request_accepted', (data) => {
        alert(`Good News! Donor ${data.donorName} has accepted your blood request.`);
        fetchMyRequests();
      });

      return () => {
        socket.off('request_accepted');
        disconnectSocket();
      };
    }
  }, [user.token, user._id]);

  const fetchAffiliatedDoctors = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/affiliated-doctors`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAffiliatedDoctors(response.data);
    } catch (error) {
      console.error('Error fetching affiliated doctors:', error);
    }
  };

  const handleVerifyDoctor = async (id, name) => {
    if (!window.confirm(`Approve Dr. ${name}?`)) return;
    setVerifyingDoctor(id);
    try {
      await axios.put(`${API_URL}/api/users/${id}/hospital-verify`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // Instead of completely removing, we can refetch or manually update local state
      setAffiliatedDoctors(prev => prev.map(d => d._id === id ? { ...d, isVerified: true } : d));
      alert(`Dr. ${name} verified successfully.`);
      setActiveStaffTab('active');
    } catch (error) {
      console.error('Error verifying doctor:', error);
      alert('Failed to verify doctor.');
    } finally {
      setVerifyingDoctor(null);
    }
  };

  const handleRejectDoctor = async (id, name) => {
    if (!window.confirm(`Remove Dr. ${name} from your staff?`)) return;
    setVerifyingDoctor(id);
    try {
      await axios.delete(`${API_URL}/api/users/${id}/hospital-reject`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAffiliatedDoctors(prev => prev.filter(d => d._id !== id));
      alert(`Dr. ${name} removed.`);
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      alert('Failed to remove doctor.');
    } finally {
      setVerifyingDoctor(null);
    }
  };

  const fetchInventory = async () => {
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/api/inventory`, config);
      setInventory(response.data);
      setEditStock(response.data.stock);
      setEditBeds(response.data.beds || { icu: { total: 20, occupied: 0 }, general: { total: 100, occupied: 0 } });
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleUpdateStock = async () => {
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const sanitizedStock = {};
      Object.keys(editStock).forEach(key => {
        sanitizedStock[key] = parseInt(editStock[key], 10) || 0;
      });

      const response = await axios.put(`${API_URL}/api/inventory`, { stock: sanitizedStock }, config);
      setInventory(response.data);
      setIsEditingStock(false);
    } catch (error) {
      console.error('Error updating inventory stock:', error);
      alert('Failed to update stock');
    }
  };

  const handleUpdateBeds = async () => {
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const sanitizedBeds = {
        icu: {
          total: parseInt(editBeds.icu.total, 10) || 0,
          occupied: parseInt(editBeds.icu.occupied, 10) || 0
        },
        general: {
          total: parseInt(editBeds.general.total, 10) || 0,
          occupied: parseInt(editBeds.general.occupied, 10) || 0
        }
      };

      const response = await axios.put(`${API_URL}/api/inventory`, { beds: sanitizedBeds }, config);
      setInventory(response.data);
      setEditBeds(response.data.beds);
      setIsEditingBeds(false);
    } catch (error) {
      console.error('Error updating bed capacity:', error);
      alert('Failed to update beds');
    }
  };

  const handleStockChange = (type, value) => {
    const val = value === '' ? '' : parseInt(value, 10);
    setEditStock(prev => ({
      ...prev,
      [type]: val
    }));
  };

  const handleBedChange = (type, field, value) => {
    const val = value === '' ? '' : parseInt(value, 10);
    setEditBeds(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: val
      }
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRequestData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        bloodType: requestData.bloodType,
        unitsRequired: requestData.quantity,
        urgency: requestData.urgency.toLowerCase(),
        location: requestData.location,
        notes: requestData.notes
      };

      await axios.post(`${API_URL}/api/requests`, payload, config);
      alert('Emergency request broadcasted successfully!');
      setShowRequestModal(false);
      setRequestData({ 
        bloodType: 'A+', 
        quantity: 1, 
        urgency: 'High',
        location: { lat: 28.6139, lng: 77.2090, address: 'AIIMS, New Delhi' },
        notes: ''
      });
      fetchMyRequests();
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request');
    }
  };

  const fetchMyRequests = async () => {
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/api/requests/my-requests`, config);
      setMyRequests(response.data.filter(req => req.status === 'open' || req.status === 'accepted'));
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleFulfillRequest = async (id) => {
    if (!window.confirm('Mark this request as fulfilled?')) return;
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/api/requests/${id}/fulfill`, {}, config);
      fetchMyRequests(); 
    } catch (error) {
      console.error('Error fulfilling request:', error);
      alert('Failed to fulfill request');
    }
  };

  const handleViewForecast = async () => {
    setShowForecastModal(true);
    setLoadingForecast(true);
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/api/forecast`, config);
      setForecast(response.data.forecast);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      setForecast('Failed to load forecast.');
    } finally {
      setLoadingForecast(false);
    }
  };

  const c = {
    bg: darkMode ? '#0e1117' : '#f8fafc',
    cardBg: darkMode ? '#161b22' : '#ffffff',
    cardBorder: darkMode ? '1px solid #30363d' : '1px solid #e2e8f0',
    text: darkMode ? '#c9d1d9' : '#24292e',
    textHighlight: darkMode ? '#ffffff' : '#0f172a',
    muted: darkMode ? '#8b949e' : '#64748b',
    border: darkMode ? '#30363d' : '#e2e8f0',
    primary: darkMode ? '#58a6ff' : '#0ea5e9',
    primaryBg: darkMode ? 'rgba(88, 166, 255, 0.1)' : 'rgba(14, 165, 233, 0.1)',
    danger: darkMode ? '#f85149' : '#e11d48',
    dangerBg: darkMode ? 'rgba(248, 81, 73, 0.1)' : 'rgba(225, 29, 72, 0.08)',
    success: darkMode ? '#3fb950' : '#10b981',
    successBg: darkMode ? 'rgba(63, 185, 80, 0.1)' : 'rgba(16, 185, 129, 0.1)',
    caution: darkMode ? '#d29922' : '#d97706',
    cautionBg: darkMode ? 'rgba(210, 153, 34, 0.1)' : 'rgba(217, 119, 6, 0.1)',
    inputBg: darkMode ? '#0d1117' : '#f8fafc',
    backdrop: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(15,23,42,0.4)',
  };

  const pendingDoctors = affiliatedDoctors.filter(d => !d.isVerified);
  const activeDoctors = affiliatedDoctors.filter(d => d.isVerified);

  const renderBedProgress = (type, data) => {
    const total = data.total || 1;
    const occupied = data.occupied || 0;
    const percentage = Math.min(100, Math.round((occupied / total) * 100));
    
    let statusColor = c.success;
    if (percentage > 80) statusColor = c.danger;
    else if (percentage > 60) statusColor = c.caution;

    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontWeight: '600', color: c.textHighlight, fontSize: '0.9rem', textTransform: 'capitalize' }}>{type === 'icu' ? 'ICU Beds' : 'General Ward'}</span>
          <span style={{ color: c.muted, fontSize: '0.85rem' }}><strong style={{ color: c.textHighlight }}>{occupied}</strong> / {total} Occupied</span>
        </div>
        <div style={{ height: '8px', background: c.inputBg, borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${percentage}%`, background: statusColor, borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
        </div>
      </div>
    );
  };

  const renderBedEditFields = (type, data) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', padding: '1rem', background: c.inputBg, borderRadius: '6px', border: c.cardBorder }}>
      <div style={{ width: '80px', fontWeight: '600', color: c.textHighlight, fontSize: '0.9rem' }}>
        {type === 'icu' ? 'ICU' : 'General'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
        <label style={{ fontSize: '0.8rem', color: c.muted }}>Occupied:</label>
        <input 
          type="number" 
          className="no-spinner" 
          style={{ width: '60px', padding: '0.4rem', borderRadius: '4px', background: 'transparent', border: `1px solid ${c.border}`, color: c.textHighlight, outline: 'none' }} 
          value={data.occupied} 
          onChange={(e) => handleBedChange(type, 'occupied', e.target.value)} 
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
        <label style={{ fontSize: '0.8rem', color: c.muted }}>Total:</label>
        <input 
          type="number" 
          className="no-spinner" 
          style={{ width: '60px', padding: '0.4rem', borderRadius: '4px', background: 'transparent', border: `1px solid ${c.border}`, color: c.textHighlight, outline: 'none' }} 
          value={data.total} 
          onChange={(e) => handleBedChange(type, 'total', e.target.value)} 
        />
      </div>
    </div>
  );

  return (
    <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem', borderBottom: c.cardBorder, paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: c.textHighlight, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <Activity size={24} color={c.primary} />
             Hospital Operations
          </h1>
          <p style={{ color: c.muted, marginTop: '0.5rem', fontSize: '0.95rem' }}>Overview of active inventory, personnel, and emergency dispatch.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
           <button onClick={handleViewForecast} style={{ padding: '0.65rem 1.25rem', background: c.primary, color: '#ffffff', border: 'none', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s', boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={e => e.currentTarget.style.opacity=0.9} onMouseLeave={e => e.currentTarget.style.opacity=1}>
             <BrainCircuit size={16}/> Forecast
           </button>
           <button onClick={() => setShowRequestModal(true)} style={{ padding: '0.65rem 1.25rem', background: c.danger, color: '#ffffff', border: 'none', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s', boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={e => e.currentTarget.style.opacity=0.9} onMouseLeave={e => e.currentTarget.style.opacity=1}>
             <AlertCircle size={16}/> Broadcast Emergency
           </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          
         {/* LEFT COLUMN: Takes up minimum 500px or stretches */}
         <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Inventory Section */}
            <div style={{ background: c.cardBg, border: c.cardBorder, borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: c.cardBorder, paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: c.textHighlight, fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Droplet size={18} color={c.danger} /> Blood Inventory
                </h3>
                <button 
                  onClick={() => {
                    if (isEditingStock) handleUpdateStock();
                    else setIsEditingStock(true);
                  }} 
                  style={{ padding: '0.4rem 0.8rem', background: isEditingStock ? c.primary : 'transparent', color: isEditingStock ? '#fff' : c.primary, border: isEditingStock ? 'none' : `1px solid ${c.cardBorder}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                >
                  {isEditingStock ? <CheckCircle2 size={14}/> : <Edit2 size={14}/>} 
                  {isEditingStock ? 'Save' : 'Manage Stock'}
                </button>
              </div>

              {inventory ? (
                 <div className="inventory-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                   {Object.entries(isEditingStock ? editStock : inventory.stock).map(([type, count]) => (
                     <div key={type} style={{ background: c.inputBg, border: c.cardBorder, padding: '1rem', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', transition: 'border-color 0.2s', borderBottom: isEditingStock ? `2px solid ${c.primary}` : c.cardBorder }}>
                       <span style={{ fontSize: '0.85rem', fontWeight: '600', color: c.muted, marginBottom: '0.5rem' }}>Group {type}</span>
                       {isEditingStock ? (
                         <input 
                           type="number" 
                           className="no-spinner" 
                           style={{ width: '100%', padding: '0', border: 'none', background: 'transparent', color: c.textHighlight, fontWeight: '700', fontSize: '1.5rem', outline: 'none' }} 
                           value={editStock[type]} 
                           onChange={(e) => handleStockChange(type, e.target.value)} 
                           placeholder="0"
                         />
                       ) : (
                         <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                            <span style={{ fontSize: '1.75rem', fontWeight: '700', color: c.textHighlight }}>{count}</span>
                            <span style={{fontSize: '0.85rem', color: c.muted, fontWeight: '500'}}>units</span>
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
              ) : <p style={{ color: c.muted, fontSize: '0.9rem' }}>Loading inventory state...</p>}
            </div>

            {/* Affiliated Doctors Section */}
            <div style={{ background: c.cardBg, border: c.cardBorder, borderRadius: '8px', padding: '0' }}>
              <div style={{ borderBottom: c.cardBorder, display: 'flex', alignItems: 'center' }}>
                 <button 
                  onClick={() => setActiveStaffTab('active')} 
                  style={{ flex: 1, padding: '1.25rem', background: activeStaffTab === 'active' ? 'transparent' : c.inputBg, color: activeStaffTab === 'active' ? c.textHighlight : c.muted, border: 'none', borderBottom: activeStaffTab === 'active' ? `2px solid ${c.primary}` : '2px solid transparent', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                 >
                   <UserCheck size={16} /> Active Staff ({activeDoctors.length})
                 </button>
                 <button 
                  onClick={() => setActiveStaffTab('pending')} 
                  style={{ flex: 1, padding: '1.25rem', background: activeStaffTab === 'pending' ? 'transparent' : c.inputBg, color: activeStaffTab === 'pending' ? c.textHighlight : c.muted, border: 'none', borderBottom: activeStaffTab === 'pending' ? `2px solid ${c.caution}` : '2px solid transparent', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                 >
                   <Users size={16} /> Pending Appeals ({pendingDoctors.length})
                 </button>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                {activeStaffTab === 'active' ? (
                  activeDoctors.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: c.muted, background: c.inputBg, borderRadius: '6px', border: c.cardBorder, fontSize: '0.9rem' }}>No active staff members found.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {activeDoctors.map(doc => (
                        <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', border: c.cardBorder, borderRadius: '6px', background: c.inputBg }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.success }}></div>
                              <span style={{ color: c.textHighlight, fontWeight: '600', fontSize: '0.95rem' }}>Dr. {doc.name}</span>
                            </div>
                            <div style={{ color: c.muted, fontSize: '0.85rem', marginTop: '0.2rem', paddingLeft: '1rem' }}>{doc.specialization || 'General Practitioner'} &bull; LIC: {doc.licenseNumber || 'N/A'}</div>
                          </div>
                          <button onClick={() => handleRejectDoctor(doc._id, doc.name)} style={{ padding: '0.4rem 0.75rem', background: 'transparent', color: c.danger, border: c.cardBorder, borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  pendingDoctors.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: c.muted, background: c.inputBg, borderRadius: '6px', border: c.cardBorder, fontSize: '0.9rem' }}>All affiliations are up to date.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {pendingDoctors.map(doc => (
                        <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', border: c.cardBorder, borderRadius: '6px', background: c.inputBg }}>
                          <div>
                            <div style={{ color: c.textHighlight, fontWeight: '600', fontSize: '0.95rem' }}>{doc.name}</div>
                            <div style={{ color: c.muted, fontSize: '0.85rem', marginTop: '0.2rem' }}>{doc.specialization} &bull; LIC: {doc.licenseNumber}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button disabled={verifyingDoctor === doc._id} onClick={() => handleVerifyDoctor(doc._id, doc.name)} style={{ padding: '0.4rem 0.75rem', background: c.successBg, color: c.success, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Approve</button>
                            <button disabled={verifyingDoctor === doc._id} onClick={() => handleRejectDoctor(doc._id, doc.name)} style={{ padding: '0.4rem 0.75rem', background: 'transparent', color: c.danger, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>Decline</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>

         </div>

         {/* RIGHT COLUMN: Takes up minimum 300px or stretches */}
         <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Active Bed Management */}
            <div style={{ background: c.cardBg, border: c.cardBorder, borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: c.cardBorder, paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: c.textHighlight, fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bed size={18} color={c.primary} /> Bed Capacity
                </h3>
                <button 
                  onClick={() => {
                    if (isEditingBeds) handleUpdateBeds();
                    else setIsEditingBeds(true);
                  }} 
                  style={{ padding: '0.4rem 0.8rem', background: isEditingBeds ? c.primary : 'transparent', color: isEditingBeds ? '#fff' : c.primary, border: isEditingBeds ? 'none' : `1px solid ${c.cardBorder}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                >
                  {isEditingBeds ? <CheckCircle2 size={14}/> : <Edit2 size={14}/>} 
                  {isEditingBeds ? 'Save' : 'Update Beds'}
                </button>
              </div>

              {inventory && inventory.beds ? (
                isEditingBeds ? (
                  <div>
                    {renderBedEditFields('icu', editBeds.icu)}
                    {renderBedEditFields('general', editBeds.general)}
                  </div>
                ) : (
                  <div>
                    {renderBedProgress('icu', inventory.beds.icu)}
                    {renderBedProgress('general', inventory.beds.general)}
                  </div>
                )
              ) : <p style={{ color: c.muted, fontSize: '0.9rem' }}>Loading bed capacity...</p>}
            </div>


            {/* Active Requests */}
            <div style={{ background: c.cardBg, border: c.cardBorder, borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ borderBottom: c.cardBorder, paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                 <h3 style={{ margin: 0, color: c.textHighlight, fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} color={c.danger} /> Active Emergencies</h3>
              </div>
              
              {myRequests.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: c.muted, border: c.cardBorder, borderStyle: 'dashed', borderRadius: '6px', fontSize: '0.9rem' }}>No active dispatches.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {myRequests.map(req => (
                    <div key={req._id} style={{ padding: '1rem', background: c.inputBg, border: c.cardBorder, borderRadius: '6px', borderLeft: `4px solid ${c.danger}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: c.textHighlight, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Type {req.bloodType} 
                            {req.status === 'accepted' && <span style={{ background: c.successBg, color: c.success, padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>Accepted</span>}
                          </div>
                          <div style={{ color: c.muted, fontSize: '0.8rem', marginTop: '0.1rem' }}>{req.unitsRequired} Units Required</div>
                        </div>
                        <span style={{ padding: '0.2rem 0.5rem', background: c.dangerBg, color: c.danger, borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>
                          {req.urgency}
                        </span>
                      </div>
                      <button onClick={() => handleFulfillRequest(req._id)} style={{ width: '100%', padding: '0.5rem', background: 'transparent', color: c.textHighlight, border: `1px solid ${c.cardBorder}`, borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}>Close Request</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

         </div>
      </div>

      {/* Modals */}
      {showRequestModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.backdrop, backdropFilter: 'blur(2px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh', zIndex: 1000, padding: '3rem 1rem' }}>
          <div className="modal-content" style={{ background: c.cardBg, border: c.cardBorder, borderRadius: '8px', padding: '0', width: '100%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)' }}>
            
            <div style={{ padding: '1.5rem', borderBottom: c.cardBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{ color: c.textHighlight, fontSize: '1.1rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={18} color={c.danger}/> Target Emergency Request</h3>
            </div>

            <form onSubmit={handleCreateRequest} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', color: c.muted, fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.4rem' }}>Blood Group</label>
                  <select style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', background: c.inputBg, border: c.cardBorder, color: c.textHighlight, outline: 'none', fontSize: '0.9rem' }} value={requestData.bloodType} onChange={(e) => setRequestData({...requestData, bloodType: e.target.value})}>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: c.muted, fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.4rem' }}>Quantity</label>
                  <input type="number" min="1" className="no-spinner" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', background: c.inputBg, border: c.cardBorder, color: c.textHighlight, outline: 'none', fontSize: '0.9rem' }} value={requestData.quantity} onChange={(e) => setRequestData({...requestData, quantity: e.target.value})} />
                </div>
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: c.muted, fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.4rem' }}>Priority Level</label>
                <select style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', background: c.inputBg, border: c.cardBorder, color: c.textHighlight, outline: 'none', fontSize: '0.9rem' }} value={requestData.urgency} onChange={(e) => setRequestData({...requestData, urgency: e.target.value})}>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: c.muted, fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.4rem' }}>
                   Dispatch Location
                   <span onClick={getCurrentLocation} style={{ color: c.primary, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={12}/> Detect</span>
                </label>
                <input type="text" placeholder="Address..." style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', background: c.inputBg, border: c.cardBorder, color: c.textHighlight, outline: 'none', fontSize: '0.9rem' }} value={requestData.location.address} onChange={(e) => setRequestData({...requestData, location: {...requestData.location, address: e.target.value}})} />
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', color: c.muted, fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.4rem' }}>Internal Notes</label>
                <textarea style={{ width: '100%', minHeight: '80px', padding: '0.6rem', borderRadius: '4px', background: c.inputBg, border: c.cardBorder, color: c.textHighlight, outline: 'none', resize: 'vertical', fontSize: '0.9rem' }} value={requestData.notes} onChange={(e) => setRequestData({...requestData, notes: e.target.value})} placeholder="Patient ID, specific ward..." />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowRequestModal(false)} style={{ flex: 1, padding: '0.6rem', background: 'transparent', color: c.textHighlight, border: c.cardBorder, borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.6rem', background: c.primary, color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForecastModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.backdrop, backdropFilter: 'blur(2px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh', zIndex: 1000, padding: '3rem 1rem' }}>
          <div className="modal-content" style={{ background: c.cardBg, border: c.cardBorder, borderRadius: '8px', padding: '0', width: '100%', maxWidth: '750px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
            
            <div style={{ padding: '1.5rem', borderBottom: c.cardBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{ color: c.textHighlight, fontSize: '1.1rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BrainCircuit size={18} color={c.primary}/> Predictive Analysis</h3>
            </div>

            <div style={{ overflowY: 'auto', padding: '1.5rem' }}>
              {loadingForecast ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: c.muted, fontSize: '0.9rem' }}>Executing forecast models...</div>
              ) : (
                <div style={{ lineHeight: '1.7', color: c.muted, fontSize: '0.9rem' }}>
                  <ReactMarkdown 
                    components={{
                      p: ({...props}) => <p style={{ margin: '0 0 1rem 0' }} {...props} />,
                      strong: ({...props}) => <strong style={{ color: c.textHighlight, fontWeight: '600' }} {...props} />,
                      ul: ({...props}) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }} {...props} />,
                      li: ({...props}) => <li style={{ marginBottom: '0.4rem', color: c.textHighlight }} {...props} />,
                      h1: ({...props}) => <h1 style={{ color: c.textHighlight, fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: c.cardBorder, paddingBottom: '0.5rem' }} {...props} />,
                      h2: ({...props}) => <h2 style={{ color: c.textHighlight, fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />,
                      h3: ({...props}) => <h3 style={{ color: c.textHighlight, fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }} {...props} />
                    }}
                  >
                    {forecast}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            
            <div style={{ padding: '1rem 1.5rem', borderTop: c.cardBorder, display: 'flex', justifyContent: 'flex-end', background: c.inputBg, borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
              <button onClick={() => setShowForecastModal(false)} style={{ padding: '0.5rem 1.25rem', background: c.cardBg, color: c.textHighlight, border: c.cardBorder, borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalDashboard;
