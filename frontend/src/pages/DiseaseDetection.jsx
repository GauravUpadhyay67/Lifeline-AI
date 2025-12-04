import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const DiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null); // Clear previous result
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const userInfo = JSON.parse(localStorage.getItem('user'));
    const token = userInfo?.token;

    if (!token) {
      alert('Please login to use this feature.');
      return;
    }

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
    container: {
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#1f2937',
    },
    uploadSection: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      border: '2px dashed #e5e7eb',
    },
    preview: {
      maxWidth: '100%',
      maxHeight: '300px',
      marginTop: '1rem',
      borderRadius: '4px',
    },
    button: {
      marginTop: '1rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#0ea5e9',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
    },
    resultSection: {
      marginTop: '2rem',
      backgroundColor: '#f0fdf4',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #bbf7d0',
    },
    resultTitle: {
      color: '#166534',
      marginBottom: '1rem',
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
    analysisText: {
      lineHeight: '1.6',
      color: '#1f2937',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>AI Disease Detection</h1>
      
      <div style={styles.uploadSection}>
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
            style={styles.button} 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        )}
      </div>

      {result && (
        <div style={styles.resultSection}>
          <h2 style={styles.resultTitle}>Analysis Results</h2>
          <div style={styles.analysisText}>
            {result.analysis ? (
               <ReactMarkdown>{result.analysis}</ReactMarkdown>
            ) : (
               <p>No analysis available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;
