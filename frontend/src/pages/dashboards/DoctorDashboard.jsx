import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const DoctorDashboard = ({ user }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
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
      const response = await axios.post('http://localhost:5000/api/reports/analyze', formData, {
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
    // ... (modal styles remain similar but updated for consistency if needed)
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
      maxWidth: '800px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    preview: {
      maxWidth: '100%',
      maxHeight: '300px',
      marginTop: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    resultSection: {
      marginTop: '2rem',
      backgroundColor: '#f0fdf4',
      padding: '2rem',
      borderRadius: '12px',
      border: '1px solid #bbf7d0',
    },
    resultTitle: {
      color: '#166534',
      marginBottom: '1rem',
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    analysisText: {
      lineHeight: '1.8',
      color: '#374151',
      fontSize: '1.05rem',
    }
  };

  return (
    <div>
      <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem'}}>Doctor Dashboard</h2>
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
            <div style={styles.icon}>🩺</div>
            <h3 style={styles.cardTitle}>Upload Patient Report</h3>
          </div>
          <p style={styles.cardText}>Upload X-rays, lab reports, or other medical documents for instant AI analysis and insights.</p>
          <button style={styles.button} onClick={() => setShowUploadModal(true)}>Upload Report</button>
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
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#d97706'}}>📂</div>
            <h3 style={styles.cardTitle}>Patient Records</h3>
          </div>
          <p style={styles.cardText}>Securely access and manage comprehensive patient medical histories and past treatments.</p>
          <button style={{...styles.button, backgroundColor: '#f59e0b', boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)'}}>View Records</button>
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
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', color: '#4338ca'}}>📅</div>
            <h3 style={styles.cardTitle}>Appointments</h3>
          </div>
          <p style={styles.cardText}>View your upcoming schedule, manage patient appointments, and set availability.</p>
          <button style={{...styles.button, backgroundColor: '#6366f1', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'}}>Check Schedule</button>
        </div>
      </div>

      {showUploadModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{...styles.cardTitle, marginBottom: 0}}>Upload Patient Report</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280'}}
              >
                &times;
              </button>
            </div>
            
            <div style={{textAlign: 'center', padding: '2rem', border: '2px dashed #e5e7eb', borderRadius: '8px', marginBottom: '1rem'}}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{marginBottom: '1rem'}}
              />
              {preview && (
                <div>
                  <img src={preview} alt="Preview" style={styles.preview} />
                </div>
              )}
              {file && (
                <button 
                  style={{...styles.button, marginTop: '1rem', backgroundColor: '#0ea5e9'}} 
                  onClick={handleSubmit} 
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze Report'}
                </button>
              )}
            </div>

            {result && (
              <div style={styles.resultSection}>
                <h2 style={styles.resultTitle}>Analysis Results</h2>
                <div style={styles.analysisText}>
                  {result.analysis ? (
                     <ReactMarkdown 
                        components={{
                          p: ({node, ...props}) => <p style={{margin: 0, marginBottom: '0.5rem'}} {...props} />,
                          ul: ({node, ...props}) => <ul style={{paddingLeft: '1.5rem', margin: '0.5rem 0'}} {...props} />,
                          li: ({node, ...props}) => <li style={{marginBottom: '0.25rem'}} {...props} />,
                          strong: ({node, ...props}) => <strong style={{fontWeight: '600'}} {...props} />
                        }}
                     >
                       {result.analysis}
                     </ReactMarkdown>
                  ) : (
                     <p>No analysis available.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
