import { API_URL, ML_URL } from '../config';
import axios from 'axios';
import { AlertCircle, CheckCircle, Loader, Upload, X } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const DiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setResult(null);
        setError(null);
    }
  };

  const clearFile = () => {
      setFile(null);
      setPreview(null);
      setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const userInfo = JSON.parse(localStorage.getItem('user'));
    const token = userInfo?.token;

    if (!token) {
      setError('Please login to use this feature.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/reports/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.response?.data?.message || 'Error analyzing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1000px',
      margin: '0 auto',
      minHeight: '80vh',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '2.5rem',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: '800',
      marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '1.1rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
    },
    uploadCard: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '24px',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
    },
    uploadZone: {
      border: '2px dashed #cbd5e1',
      borderRadius: '16px',
      padding: '3rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: '#f8fafc',
    },
    imagePreview: {
        width: '100%',
        borderRadius: '12px',
        marginTop: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    },
    button: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#0ea5e9',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s',
      boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)',
    },
    resultCard: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '24px',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden',
    },
    resultHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #f1f5f9'
    },
    resultContent: {
        color: '#334155',
        lineHeight: '1.7',
        fontSize: '1.05rem',
    },
    errorBox: {
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#991b1b',
        padding: '1rem',
        borderRadius: '12px',
        marginTop: '1rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center'
    }
  };

  return (
    <div className="detection-container" style={styles.container}>
      <div style={styles.header}>
        <h1 className="detection-title" style={styles.title}>AI Disease Detection</h1>
        <p style={styles.subtitle}>Upload medical imaging for instant AI-powered analysis</p>
      </div>

      <div className="detection-grid" style={styles.grid}>
          {/* Upload Section */}
          <div style={styles.uploadCard}>
              <h2 style={{fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1e293b'}}>Upload Image</h2>
              
              {!file ? (
                  <div 
                    style={styles.uploadZone}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#0ea5e9'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  >
                        <Upload size={48} color="#94a3b8" style={{marginBottom: '1rem'}} />
                        <h3 style={{color: '#475569', marginBottom: '0.5rem'}}>Click to upload or drag & drop</h3>
                        <p style={{color: '#94a3b8', fontSize: '0.9rem'}}>Supported: X-Ray, MRI, CT Scan (JPG, PNG)</p>
                        <input 
                            id="fileInput"
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{display: 'none'}}
                        />
                  </div>
              ) : (
                  <div style={{position: 'relative'}}>
                      <button 
                        onClick={clearFile}
                        style={{
                            position: 'absolute', top: '10px', right: '10px', 
                            background: 'rgba(0,0,0,0.5)', color: 'white', 
                            border: 'none', borderRadius: '50%', width: '30px', height: '30px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                          <X size={18} />
                      </button>
                      <img src={preview} alt="Upload Preview" style={styles.imagePreview} />
                      <button 
                        style={{...styles.button, opacity: loading ? 0.7 : 1}} 
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                          {loading ? <Loader className="spin" /> : <Upload size={20} />}
                          {loading ? 'Analyzing...' : 'Analyze Now'}
                      </button>
                  </div>
              )}
            
            {error && (
                <div style={styles.errorBox}>
                    <AlertCircle size={24} />
                    <p>{error}</p>
                </div>
            )}
          </div>

          {/* Results Section */}
          {result && (
              <div style={styles.resultCard}>
                  <div style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '5px',
                      background: 'linear-gradient(90deg, #22c55e, #16a34a)'
                  }} />
                  <div style={styles.resultHeader}>
                      <div style={{background: '#dcfce7', padding: '10px', borderRadius: '50%'}}>
                        <CheckCircle size={32} color="#16a34a" />
                      </div>
                      <div>
                          <h2 style={{color: '#1e293b', margin: 0, fontSize: '1.4rem'}}>Analysis Complete</h2>
                          <p style={{color: '#64748b', margin: 0, fontSize: '0.9rem'}}>Confidence Score: High</p>
                      </div>
                  </div>
                  
                  <div style={styles.resultContent}>
                       <ReactMarkdown>{result.analysis}</ReactMarkdown>
                  </div>
              </div>
          )}
      </div>
      
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        p { margin-bottom: 1rem; }
        strong { color: #0f172a; font-weight: 700; }
        blockquote { border-left: 4px solid #0ea5e9; padding-left: 1rem; margin: 1rem 0; color: #475569; }
      `}</style>
    </div>
  );
};

export default DiseaseDetection;
