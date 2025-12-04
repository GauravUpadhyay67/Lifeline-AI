import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const MedicalReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const token = userInfo?.token;

      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/reports', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#1f2937',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderBottom: '1px solid #e5e7eb',
    },
    content: {
      padding: '1.5rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    date: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem',
    },
    analysisPreview: {
      fontSize: '0.95rem',
      color: '#374151',
      lineHeight: '1.5',
      flex: 1,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
    },
    expandButton: {
      marginTop: '1rem',
      color: '#0ea5e9',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      padding: 0,
      textAlign: 'left',
    },
    fullAnalysis: {
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e5e7eb',
    }
  };

  const ReportCard = ({ report }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div style={styles.card}>
        <img 
          src={`http://localhost:5000${report.imageUrl}`} 
          alt="Medical Report" 
          style={styles.image} 
        />
        <div style={styles.content}>
          <div style={styles.date}>
            {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
          </div>
          
          {expanded ? (
            <div style={styles.fullAnalysis}>
               <ReactMarkdown 
                  components={{
                    p: ({node, ...props}) => <p style={{margin: 0, marginBottom: '0.5rem'}} {...props} />,
                    ul: ({node, ...props}) => <ul style={{paddingLeft: '1.5rem', margin: '0.5rem 0'}} {...props} />,
                    li: ({node, ...props}) => <li style={{marginBottom: '0.25rem'}} {...props} />,
                    strong: ({node, ...props}) => <strong style={{fontWeight: '600'}} {...props} />
                  }}
               >
                 {report.analysis}
               </ReactMarkdown>
            </div>
          ) : (
            <div style={styles.analysisPreview}>
              <ReactMarkdown>{report.analysis}</ReactMarkdown>
            </div>
          )}

          <button 
            style={styles.expandButton}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Read Full Report'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Medical Reports</h1>
      
      {loading ? (
        <p style={{textAlign: 'center'}}>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p style={{textAlign: 'center', color: '#6b7280'}}>
          No reports found. Use the <strong>AI Disease Detection</strong> feature to analyze your first report.
        </p>
      ) : (
        <div style={styles.grid}>
          {reports.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalReports;
