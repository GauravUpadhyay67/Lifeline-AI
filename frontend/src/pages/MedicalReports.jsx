import { API_URL, ML_URL } from '../config';
import axios from 'axios';
import { Activity, Calendar, ChevronDown, ChevronUp, Clock, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MedicalReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const token = userInfo?.token;
    if (!token) return;

    try {
      const response = await axios.get('${API_URL}/api/reports', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '85vh',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '1.1rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
      gap: '2rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    imageContainer: {
        position: 'relative',
        height: '220px',
        overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    badge: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#0f172a',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
    },
    content: {
      padding: '1.5rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        color: '#64748b',
        fontSize: '0.85rem',
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
    },
    divider: {
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '0.5rem 0 1rem 0',
    },
    analysisBox: {
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '1rem',
        fontSize: '0.95rem',
        color: '#334155',
        lineHeight: '1.6',
        marginBottom: '1rem',
    },
    expandButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#f0f9ff',
      color: '#0284c7',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s',
      marginTop: 'auto'
    },
    emptyState: {
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'white',
        borderRadius: '24px',
        border: '2px dashed #e2e8f0',
        maxWidth: '600px',
        margin: '2rem auto'
    }
  };

  const ReportCard = ({ report }) => {
    const [expanded, setExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        style={{...styles.card, ...(isHovered ? styles.cardHover : {})}}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.imageContainer}>
             <img 
               src={`${API_URL}${report.imageUrl}`} 
               alt="Medical Scan" 
               style={styles.image} 
             />
             <div style={styles.badge}>
                 <Activity size={12} color="#0ea5e9" />
                 AI Analyzed
             </div>
        </div>
        
        <div style={styles.content}>
          <div style={styles.metaRow}>
            <div style={styles.metaItem}>
                <Calendar size={14} />
                {new Date(report.createdAt).toLocaleDateString()}
            </div>
            <div style={styles.metaItem}>
                <Clock size={14} />
                {new Date(report.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>

          <div style={styles.divider} />
          
          <div style={{
              ...styles.analysisBox, 
              maxHeight: expanded ? 'none' : '100px', 
              overflow: 'hidden',
              maskImage: expanded ? 'none' : 'linear-gradient(to bottom, black 60%, transparent 100%)'
          }}>
             <ReactMarkdown 
                components={{
                    p: ({node, ...props}) => <p style={{margin: 0, marginBottom: '0.5rem'}} {...props} />,
                    strong: ({node, ...props}) => <strong style={{color: '#0f172a', fontWeight: '700'}} {...props} />
                }}
             >
                 {report.analysis}
             </ReactMarkdown>
          </div>

          <button 
            style={{...styles.expandButton, backgroundColor: expanded ? '#f1f5f9' : '#f0f9ff', color: expanded ? '#64748b' : '#0284c7'}}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
                <>Show Less <ChevronUp size={16} /></>
            ) : (
                <>Read Full Analysis <ChevronDown size={16} /></>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Medical Reports</h1>
        <p style={styles.subtitle}>Securely stored history of your AI-powered diagnostics</p>
      </div>
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '4rem'}}>
            <p style={{color: '#64748b'}}>Loading your records...</p>
        </div>
      ) : reports.length === 0 ? (
        <div style={styles.emptyState}>
            <div style={{
                background: '#f1f5f9', width: '80px', height: '80px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'
            }}>
                <Search size={32} color="#94a3b8" />
            </div>
            <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b'}}>No Reports Found</h3>
            <p style={{color: '#64748b', marginBottom: '1.4rem'}}>
              You haven't uploaded any medical images for analysis yet.
            </p>
            <a 
                href="/disease-detection" 
                style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600'
                }}
            >
                Start New Analysis
            </a>
        </div>
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
