import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connectSocket, disconnectSocket, socket } from '../../utils/socket';

const DonorDashboard = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [camps, setCamps] = useState([]);
  const [showCampsModal, setShowCampsModal] = useState(false);

  const [locationStatus, setLocationStatus] = useState('Initializing...');

  useEffect(() => {
    fetchNotifications();
    
    // Connect Socket
    if (user && user._id) {
        connectSocket(user._id);

        // Track Location
        if (navigator.geolocation) {
            setLocationStatus('Requesting Location Access...');
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Updating location:", latitude, longitude);
                    setLocationStatus('Location Active & Tracking');
                    socket.emit('update_location', {
                        userId: user._id,
                        lat: latitude,
                        lng: longitude
                    });
                },
                (error) => {
                    console.error("Error watching location:", error);
                    setLocationStatus(`Location Error: ${error.message}`);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );

            return () => {
                navigator.geolocation.clearWatch(watchId);
                socket.off('new_blood_request');
                disconnectSocket();
            };
        } else {
            setLocationStatus('Geolocation not supported');
        }
    }

    // Listen for new requests
    socket.on('new_blood_request', (data) => {
        console.log('New Blood Request Received:', data);
        setIncomingRequest(data);
        // Play sound or vibrate here
    });

    return () => {
        socket.off('new_blood_request');
        disconnectSocket();
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const token = user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get('http://localhost:5000/api/notifications', config);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchCamps = async () => {
    try {
      const token = user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get('http://localhost:5000/api/camps', config);
      setCamps(response.data);
      setShowCampsModal(true);
    } catch (error) {
      console.error('Error fetching camps:', error);
      alert('Failed to fetch camps');
    }
  };

  const handleDismissNotification = async (id) => {
    try {
      const token = user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, config);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const handleAcceptRequest = async () => {
    if (!incomingRequest) return;
    try {
        const token = user.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        await axios.put(`http://localhost:5000/api/requests/${incomingRequest.requestId}/accept`, {}, config);
        alert('Thank you! The hospital has been notified. Please proceed to the location.');
        setIncomingRequest(null);
        // Navigate to map or show directions
    } catch (error) {
        console.error('Error accepting request:', error);
        alert('Failed to accept request. It might have been taken.');
    }
  };

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem',
      marginTop: '1rem',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '2rem',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      gap: '1rem',
    },
    icon: {
      fontSize: '2rem',
      padding: '1rem',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      color: '#0284c7',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1f2937',
      margin: 0,
    },
    cardText: {
      color: '#6b7280',
      marginBottom: '2rem',
      lineHeight: '1.6',
      flex: 1,
    },
    button: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#0ea5e9',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'background-color 0.2s ease',
      marginTop: 'auto',
      boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)',
    },
    notificationList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      maxHeight: '200px',
      overflowY: 'auto',
    },
    notificationItem: {
      padding: '1rem',
      borderBottom: '1px solid #f3f4f6',
      fontSize: '0.95rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '8px',
      marginBottom: '0.5rem',
    },
    alert: {
      color: '#ef4444',
      fontWeight: 'bold',
    },
    dismissBtn: {
      background: 'none',
      border: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      fontSize: '1.2rem',
      lineHeight: '1',
      padding: '0 0 0 10px',
      transition: 'color 0.2s',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '2.5rem',
      borderRadius: '16px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    campItem: {
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem',
      backgroundColor: '#f9fafb',
      transition: 'background-color 0.2s',
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0}}>Blood Donor Dashboard</h2>
        <div style={{
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            backgroundColor: locationStatus.includes('Error') ? '#fee2e2' : '#dcfce7',
            color: locationStatus.includes('Error') ? '#dc2626' : '#166534',
            fontWeight: '600',
            fontSize: '0.9rem'
        }}>
            {locationStatus}
        </div>
      </div>
      <div style={styles.grid}>
        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.cardHeader}>
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#dc2626'}}>🔔</div>
            <h3 style={styles.cardTitle}>Notifications</h3>
          </div>
          {notifications.length > 0 ? (
            <ul style={styles.notificationList}>
              {notifications.map((notif) => (
                <li key={notif._id} style={styles.notificationItem}>
                  <div>
                    <span style={notif.type === 'alert' ? styles.alert : {}}>
                      {notif.message}
                    </span>
                    <div style={{fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px'}}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <button 
                    style={styles.dismissBtn}
                    onClick={() => handleDismissNotification(notif._id)}
                    title="Dismiss"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.cardText}>No new notifications. You're all caught up!</p>
          )}
        </div>

        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.cardHeader}>
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)', color: '#e11d48'}}>🩸</div>
            <h3 style={styles.cardTitle}>Donate Blood</h3>
          </div>
          <p style={styles.cardText}>Find nearby blood donation camps and hospitals to save lives today.</p>
          <button style={{...styles.button, backgroundColor: '#f43f5e', boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.39)'}} onClick={fetchCamps}>Find Camps</button>
        </div>

        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.cardHeader}>
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb'}}>📜</div>
            <h3 style={styles.cardTitle}>Donation History</h3>
          </div>
          <p style={styles.cardText}>Track your past donations, view certificates, and see your impact.</p>
          <button style={{...styles.button, backgroundColor: '#3b82f6', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'}}>View History</button>
        </div>
      </div>

      {incomingRequest && (
        <div style={styles.modalOverlay}>
            <div style={{...styles.modalContent, border: '2px solid #ef4444'}}>
                <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                    <div style={{fontSize: '3rem'}}>🚨</div>
                    <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444'}}>Urgent Blood Request!</h3>
                </div>
                
                <div style={{marginBottom: '1.5rem'}}>
                    <p><strong>Hospital:</strong> {incomingRequest.hospitalName}</p>
                    <p><strong>Blood Type:</strong> <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#dc2626'}}>{incomingRequest.bloodType}</span></p>
                    <p><strong>Urgency:</strong> {incomingRequest.urgency}</p>
                    <p><strong>Location:</strong> {incomingRequest.location?.address || 'View on Map'}</p>
                </div>

                <div style={{display: 'flex', gap: '1rem'}}>
                    <button 
                        style={{...styles.button, backgroundColor: '#10b981', fontSize: '1.1rem'}}
                        onClick={handleAcceptRequest}
                    >
                        Accept & Navigate
                    </button>
                    <button 
                        style={{...styles.button, backgroundColor: '#6b7280'}}
                        onClick={() => setIncomingRequest(null)}
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
      )}

      {showCampsModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{...styles.cardTitle, marginBottom: '1.5rem'}}>Nearby Donation Camps</h3>
            {camps.length > 0 ? (
              <div>
                {camps.map(camp => (
                  <div key={camp._id} style={styles.campItem}>
                    <h4 style={{margin: '0 0 0.5rem 0', color: '#111827'}}>{camp.name}</h4>
                    <p style={{margin: '0 0 0.25rem 0', color: '#4b5563'}}><strong>Location:</strong> {camp.location}, {camp.city}</p>
                    <p style={{margin: '0 0 0.25rem 0', color: '#4b5563'}}><strong>Date:</strong> {new Date(camp.date).toLocaleDateString()}</p>
                    <p style={{margin: '0 0 0.25rem 0', color: '#4b5563'}}><strong>Time:</strong> {camp.time}</p>
                    <p style={{margin: '0 0 0.25rem 0', color: '#4b5563'}}><strong>Organizer:</strong> {camp.organizer}</p>
                    <p style={{margin: '0', color: '#4b5563'}}><strong>Contact:</strong> {camp.contact}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No upcoming camps found.</p>
            )}
            <div style={{marginTop: '1.5rem', textAlign: 'right'}}>
              <button 
                style={{...styles.button, backgroundColor: '#6b7280'}}
                onClick={() => setShowCampsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
