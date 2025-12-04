import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const HospitalDashboard = ({ user }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    bloodType: 'A+',
    quantity: 1,
    urgency: 'High',
    location: { lat: 28.6139, lng: 77.2090, address: 'AIIMS, New Delhi' },
    notes: ''
  });

  const [inventory, setInventory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStock, setEditStock] = useState({});

  const [showForecastModal, setShowForecastModal] = useState(false);
  const [forecast, setForecast] = useState('');
  const [loadingForecast, setLoadingForecast] = useState(false);

  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    fetchInventory();
    fetchMyRequests();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get('http://localhost:5000/api/inventory', config);
      setInventory(response.data);
      setEditStock(response.data.stock);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleUpdateStock = async () => {
    try {
      const token = user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.put('http://localhost:5000/api/inventory', { stock: editStock }, config);
      setInventory(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Failed to update stock');
    }
  };

  const handleStockChange = (type, value) => {
    setEditStock(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
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
          // Optional: You could call a reverse geocoding API here to get the address
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
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      
      const payload = {
        bloodType: requestData.bloodType,
        unitsRequired: requestData.quantity,
        urgency: requestData.urgency.toLowerCase(),
        location: requestData.location,
        notes: requestData.notes
      };

      await axios.post('http://localhost:5000/api/requests', payload, config);
      alert('Emergency request broadcasted successfully!');
      setShowRequestModal(false);
      setRequestData({ 
        bloodType: 'A+', 
        quantity: 1, 
        urgency: 'High',
        location: { lat: 28.6139, lng: 77.2090, address: 'AIIMS, New Delhi' },
        notes: ''
      });
      fetchMyRequests(); // Refresh list
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request');
    }
  };

  const fetchMyRequests = async () => {
    try {
      const token = user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get('http://localhost:5000/api/requests/my-requests', config);
      setMyRequests(response.data.filter(req => req.status === 'open'));
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleFulfillRequest = async (id) => {
    if (!window.confirm('Are you sure you want to mark this request as fulfilled? This will remove alerts from donors.')) return;
    try {
      const token = user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(`http://localhost:5000/api/requests/${id}/fulfill`, {}, config);
      fetchMyRequests(); // Refresh list
      alert('Request fulfilled and notifications removed.');
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
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get('http://localhost:5000/api/forecast', config);
      setForecast(response.data.forecast);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      setForecast('Failed to load forecast.');
    } finally {
      setLoadingForecast(false);
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
    stockGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        marginTop: '1.5rem',
        marginBottom: '1.5rem'
    },
    stockItem: {
        background: 'rgba(255, 255, 255, 0.6)',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e5e7eb',
    },
    input: {
      width: '60px',
      padding: '4px',
      marginTop: '4px',
      textAlign: 'center',
      border: '1px solid #d1d5db',
      borderRadius: '4px'
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
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#374151',
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: '#f9fafb',
    },
    numberInput: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: '#f9fafb',
    }
  };
  
  const requestItemStyle = {
    padding: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    marginBottom: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <div>
      <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem'}}>Hospital Dashboard</h2>
      <div style={styles.grid}>
        {/* Inventory Card */}
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
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #dcfce7 0%, #86efac 100%)', color: '#15803d'}}>🏥</div>
            <h3 style={styles.cardTitle}>Blood Inventory</h3>
          </div>
          <p style={styles.cardText}>Manage current blood stock levels and update availability.</p>
          
          {inventory ? (
            <div style={styles.stockGrid}>
              {Object.entries(isEditing ? editStock : inventory.stock).map(([type, count]) => (
                <div key={type} style={styles.stockItem}>
                  <span style={{color: '#ef4444'}}>{type}</span>
                  {isEditing ? (
                    <input 
                      type="number" 
                      value={count} 
                      onChange={(e) => handleStockChange(type, e.target.value)}
                      style={styles.input}
                    />
                  ) : (
                    <span style={{color: '#1f2937'}}>{count}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Loading inventory...</p>
          )}

          <div style={{marginTop: 'auto', display: 'flex', gap: '0.5rem'}}>
            {isEditing ? (
              <>
                <button style={{...styles.button, backgroundColor: '#10b981', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'}} onClick={handleUpdateStock}>Save Changes</button>
                <button 
                  style={{...styles.button, backgroundColor: '#6b7280', boxShadow: '0 4px 14px 0 rgba(107, 114, 128, 0.39)'}} 
                  onClick={() => {
                    setIsEditing(false);
                    setEditStock(inventory.stock);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button style={{...styles.button, backgroundColor: '#10b981', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'}} onClick={() => setIsEditing(true)}>Update Stock</button>
            )}
          </div>
        </div>
        
        {/* Emergency Request Card */}
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
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#dc2626'}}>🚨</div>
            <h3 style={styles.cardTitle}>Emergency Request</h3>
          </div>
          <p style={styles.cardText}>Broadcast an emergency blood request to nearby donors immediately.</p>
          <button 
            style={{...styles.button, backgroundColor: '#ef4444', marginBottom: '1.5rem', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)'}}
            onClick={() => setShowRequestModal(true)}
          >
            Create Request
          </button>

          <h4 style={{marginTop: '1rem', marginBottom: '1rem', color: '#374151', fontSize: '1.1rem'}}>Active Requests</h4>
          {myRequests.length > 0 ? (
            <div style={{maxHeight: '200px', overflowY: 'auto', width: '100%'}}>
              {myRequests.map(req => (
                <div key={req._id} style={requestItemStyle}>
                  <div>
                    <div style={{fontWeight: 'bold', color: '#ef4444'}}>{req.bloodType} ({req.unitsRequired} units)</div>
                    <div style={{fontSize: '0.8rem', color: '#6b7280'}}>{req.urgency} Urgency</div>
                  </div>
                  <button 
                    style={{...styles.button, backgroundColor: '#10b981', padding: '0.5rem 1rem', fontSize: '0.8rem', width: 'auto', marginTop: 0}}
                    onClick={() => handleFulfillRequest(req._id)}
                  >
                    Fulfill
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{fontSize: '0.9rem', color: '#9ca3af', fontStyle: 'italic'}}>No active requests.</p>
          )}
        </div>

        {/* Demand Forecast Card */}
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
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', color: '#4338ca'}}>📈</div>
            <h3 style={styles.cardTitle}>Demand Forecast</h3>
          </div>
          <p style={styles.cardText}>View AI-predicted blood demand for the upcoming week to optimize inventory.</p>
          <button style={{...styles.button, backgroundColor: '#6366f1', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'}} onClick={handleViewForecast}>View Forecast</button>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{...styles.cardTitle, marginBottom: '1.5rem'}}>Create Emergency Request</h3>
            <form onSubmit={handleCreateRequest}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Blood Type</label>
                <select 
                  style={styles.select}
                  value={requestData.bloodType}
                  onChange={(e) => setRequestData({...requestData, bloodType: e.target.value})}
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Quantity (Units)</label>
                <input 
                  type="number" 
                  min="1"
                  style={styles.numberInput}
                  value={requestData.quantity}
                  onChange={(e) => setRequestData({...requestData, quantity: e.target.value})}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Urgency</label>
                <select 
                  style={styles.select}
                  value={requestData.urgency}
                  onChange={(e) => setRequestData({...requestData, urgency: e.target.value})}
                >
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location (Lat, Lng)</label>
                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <input 
                      type="number" 
                      placeholder="Lat"
                      style={styles.numberInput}
                      value={requestData.location.lat}
                      onChange={(e) => setRequestData({...requestData, location: {...requestData.location, lat: parseFloat(e.target.value)}})}
                    />
                    <input 
                      type="number" 
                      placeholder="Lng"
                      style={styles.numberInput}
                      value={requestData.location.lng}
                      onChange={(e) => setRequestData({...requestData, location: {...requestData.location, lng: parseFloat(e.target.value)}})}
                    />
                    <button 
                      type="button" 
                      onClick={getCurrentLocation}
                      style={{
                        padding: '0.5rem', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                      title="Get Current Location"
                    >
                      📍 Use Current
                    </button>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                <input 
                  type="text" 
                  style={styles.select}
                  value={requestData.location.address}
                  onChange={(e) => setRequestData({...requestData, location: {...requestData.location, address: e.target.value}})}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Notes</label>
                <textarea 
                  style={{...styles.select, minHeight: '80px'}}
                  value={requestData.notes}
                  onChange={(e) => setRequestData({...requestData, notes: e.target.value})}
                  placeholder="Additional details..."
                />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" style={{...styles.button, backgroundColor: '#ef4444', flex: 1}}>
                  Broadcast Request
                </button>
                <button 
                  type="button" 
                  style={{...styles.button, backgroundColor: '#6b7280', flex: 1}}
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forecast Modal */}
      {showForecastModal && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modalContent, maxWidth: '700px'}}>
            <h3 style={{...styles.cardTitle, marginBottom: '1.5rem'}}>AI Demand Forecast</h3>
            
            {loadingForecast ? (
              <p>Generating forecast...</p>
            ) : (
              <div style={{lineHeight: '1.6', color: '#374151', maxHeight: '60vh', overflowY: 'auto'}}>
                 <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p style={{margin: 0, marginBottom: '0.5rem'}} {...props} />,
                      ul: ({node, ...props}) => <ul style={{paddingLeft: '1.5rem', margin: '0.5rem 0'}} {...props} />,
                      li: ({node, ...props}) => <li style={{marginBottom: '0.25rem'}} {...props} />,
                      strong: ({node, ...props}) => <strong style={{fontWeight: '600'}} {...props} />
                    }}
                 >
                   {forecast}
                 </ReactMarkdown>
              </div>
            )}

            <div style={{marginTop: '2rem', textAlign: 'right'}}>
              <button 
                style={{...styles.button, backgroundColor: '#6b7280'}}
                onClick={() => setShowForecastModal(false)}
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

export default HospitalDashboard;
