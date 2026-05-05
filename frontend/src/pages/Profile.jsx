import { API_URL, ML_URL } from '../config';
import axios from 'axios';
import {
    ArrowLeft,
    Briefcase,
    Building,
    Calendar,
    Camera,
    Droplet,
    Lock,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    User,
    Activity
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const { darkMode } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        age: '',
        bloodType: '',
        gender: '',
        specialization: '',
        hospitalName: '',
        practiceType: '',
        password: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                age: user.age || '',
                bloodType: user.bloodType || '',
                gender: user.gender || '',
                specialization: user.specialization || '',
                hospitalName: user.hospitalName || '',
                practiceType: user.practiceType || '',
            }));
            if (user.profilePic) {
                setPreview(`${API_URL}${user.profilePic}`);
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profilePicFile: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'profilePicFile' && formData[key]) {
                 // Only send specialization/hospital if user is doctor
                if ((key === 'specialization' || key === 'hospitalName' || key === 'practiceType') && user.role !== 'doctor') {
                    return;
                }
                data.append(key, formData[key]);
            }
        });
        
        if (formData.profilePicFile) {
            data.append('profilePic', formData.profilePicFile);
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const res = await axios.put(`${API_URL}/api/users/profile`, data, config);
            dispatch(setCredentials({ ...res.data, token: user.token }));
            setMessage({ type: 'success', text: 'Changes saved successfully!' });
            
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
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
        inputBg: darkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
        buttonGradient: darkMode 
          ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
          : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.05)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
    };

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2.5rem',
            minHeight: '100vh',
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'start',
            fontFamily: "'Inter', sans-serif",
            flexWrap: 'wrap'
        },
        sidebar: {
            flex: '1 1 300px',
            maxWidth: '350px',
            background: c.cardBg,
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            border: c.cardBorder,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: c.boxShadow,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10
        },
        main: {
            flex: '2 1 500px',
            background: c.cardBg,
            borderRadius: '24px',
            padding: '3rem',
            border: c.cardBorder,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: c.boxShadow,
            position: 'relative',
            zIndex: 10
        },
        avatarWrapper: {
            position: 'relative',
            marginBottom: '1.5rem',
        },
        avatar: {
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${c.primary}`,
            background: c.inputBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.textHighlight,
            fontSize: '3.5rem',
            fontWeight: '700'
        },
        cameraBtn: {
            position: 'absolute',
            bottom: '0',
            right: '0',
            background: c.primary,
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        },
        sidebarName: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: c.textHighlight,
            marginBottom: '0.25rem',
            textAlign: 'center'
        },
        sidebarRole: {
            fontSize: '0.8rem',
            color: c.muted,
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.05em',
            marginBottom: '2rem',
            background: c.inputBg,
            border: c.cardBorder,
            padding: '0.25rem 0.75rem',
            borderRadius: '4px'
        },
        navItem: (active) => ({
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '6px',
            background: active ? c.primaryBg : 'transparent',
            color: active ? c.primary : c.text,
            fontWeight: '600',
            border: active ? `1px solid ${c.border}` : '1px solid transparent',
            borderColor: active ? c.primary : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem',
            transition: 'all 0.2s',
            fontSize: '0.9rem'
        }),
        header: {
            borderBottom: c.cardBorder,
            paddingBottom: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        headerTitle: {
            fontSize: '1.4rem',
            fontWeight: '700',
            color: c.textHighlight,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem'
        },
        inputGroup: (fullWidth) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            gridColumn: fullWidth ? '1 / -1' : 'auto'
        }),
        label: {
            fontSize: '0.85rem',
            fontWeight: '600',
            color: c.muted,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        input: {
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            border: c.cardBorder,
            background: c.inputBg,
            fontSize: '0.95rem',
            color: c.textHighlight,
            outline: 'none',
            transition: 'all 0.2s',
        },
        saveBtn: {
            background: c.buttonGradient,
            color: '#ffffff',
            border: 'none',
            padding: '0.9rem 2rem',
            borderRadius: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '2.5rem',
            marginLeft: 'auto',
            fontSize: '1rem',
            boxShadow: '0 8px 25px rgba(37,99,235,0.25)',
            transition: 'all 0.3s'
        },
        message: (type) => ({
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            background: type === 'success' ? c.successBg : c.dangerBg,
            color: type === 'success' ? c.success : c.danger,
            border: type === 'success' ? `1px solid ${c.success}` : `1px solid ${c.danger}`,
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        })
    };

    return (
        <div style={{ background: c.bg, minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
            {/* Background Ornaments */}
            <div style={{
              position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%',
              background: darkMode ? 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '10%', right: '15%', width: '400px', height: '400px', borderRadius: '50%',
              background: darkMode ? 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div className="profile-container" style={styles.container}>
                {/* Sidebar */}
                <div className="profile-sidebar" style={styles.sidebar}>
                    <button onClick={() => navigate('/dashboard')} style={{alignSelf: 'flex-start', background: c.inputBg, border: c.cardBorder, padding: '0.5rem 0.75rem', borderRadius: '10px', cursor: 'pointer', color: c.textHighlight, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s'}}>
                        <ArrowLeft size={16}/> Back
                    </button>
                    
                    <div style={styles.avatarWrapper}>
                         {preview ? (
                            <img src={preview} style={styles.avatar} alt="Profile" />
                         ) : (
                            <div style={styles.avatar}>{user?.name?.charAt(0)}</div>
                         )}
                         <button style={styles.cameraBtn} onClick={() => document.getElementById('pic-upload').click()}>
                            <Camera size={16} />
                         </button>
                         <input type="file" id="pic-upload" hidden accept="image/*" onChange={handleFileChange}/>
                    </div>
                    
                    <h3 style={styles.sidebarName}>{user?.name}</h3>
                    <span style={styles.sidebarRole}>{user?.role}</span>

                    <button style={styles.navItem(activeTab === 'personal')} onClick={() => setActiveTab('personal')}>
                        <User size={18} /> Personal Info
                    </button>
                    {user?.role === 'doctor' && (
                        <button style={styles.navItem(activeTab === 'professional')} onClick={() => setActiveTab('professional')}>
                            <Briefcase size={18} /> Professional Details
                        </button>
                    )}
                     <button style={styles.navItem(activeTab === 'account')} onClick={() => setActiveTab('account')}>
                        <Shield size={18} /> Security
                    </button>
                </div>

                {/* Main Content */}
                <form className="profile-main" style={styles.main} onSubmit={handleSubmit}>
                    <div style={styles.header}>
                        <h2 style={styles.headerTitle}>
                            {activeTab === 'personal' && <><User size={20} color={c.primary}/> Personal Information</>}
                            {activeTab === 'professional' && <><Briefcase size={20} color={c.primary}/> Professional Details</>}
                            {activeTab === 'account' && <><Shield size={20} color={c.primary}/> Account Security</>}
                        </h2>
                    </div>

                    {message && 
                        <div style={styles.message(message.type)}>
                            {message.type === 'success' ? <Save size={18}/> : <Activity size={18}/>}
                            {message.text}
                        </div>
                    }

                    <div className="profile-form-grid" style={styles.grid}>
                        {activeTab === 'personal' && (
                            <>
                                <div style={styles.inputGroup(false)}>
                                    <label style={styles.label}><User size={16}/> Full Name</label>
                                    <input style={styles.input} type="text" name="name" value={formData.name} onChange={handleChange} />
                                </div>
                                <div style={styles.inputGroup(false)}>
                                    <label style={styles.label}><Mail size={16}/> Email (Read-only)</label>
                                    <input style={{...styles.input, background: c.bg, color: c.muted, cursor: 'not-allowed'}} type="email" value={formData.email} disabled />
                                </div>
                                <div style={styles.inputGroup(false)}>
                                    <label style={styles.label}><Phone size={16}/> Phone Number</label>
                                    <input style={styles.input} type="text" name="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                 <div style={styles.inputGroup(false)}>
                                    <label style={styles.label}><Calendar size={16}/> Age</label>
                                    <input style={styles.input} type="number" name="age" value={formData.age} onChange={handleChange} />
                                </div>
                                <div style={styles.inputGroup(true)}>
                                    <label style={styles.label}><MapPin size={16}/> Address</label>
                                    <input style={styles.input} type="text" name="address" value={formData.address} onChange={handleChange} />
                                </div>
                                <div style={styles.inputGroup(false)}>
                                    <label style={styles.label}><Droplet size={16}/> Blood Type</label>
                                    <select style={styles.input} name="bloodType" value={formData.bloodType} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div style={styles.inputGroup(false)}>
                                    <label style={styles.label}><User size={16}/> Gender</label>
                                    <select style={styles.input} name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {activeTab === 'professional' && user.role === 'doctor' && (
                            <>
                                 <div style={styles.inputGroup(true)}>
                                    <label style={styles.label}><Briefcase size={16}/> Specialization</label>
                                    <input style={styles.input} type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Cardiologist" />
                                </div>
                                 <div style={styles.inputGroup(false)}>
                                    <label style={styles.label}><Shield size={16}/> Practice Type</label>
                                    <select style={styles.input} name="practiceType" value={formData.practiceType || 'hospital_affiliated'} onChange={handleChange}>
                                        <option value="hospital_affiliated">Hospital Affiliated</option>
                                        <option value="independent_clinic">Independent Private Clinic</option>
                                    </select>
                                </div>
                                 <div style={styles.inputGroup(false)}>
                                    <label style={styles.label}>
                                        <Building size={16}/> 
                                        {formData.practiceType === 'independent_clinic' ? 'Clinic Name' : 'Hospital Name'}
                                    </label>
                                    <input style={styles.input} type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder={formData.practiceType === 'independent_clinic' ? 'Your clinic name' : 'e.g. City General'} />
                                </div>
                            </>
                        )}

                        {activeTab === 'account' && (
                             <div style={styles.inputGroup(true)}>
                                <label style={styles.label}><Lock size={16}/> New Password</label>
                                <input style={styles.input} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" />
                                <p style={{fontSize: '0.8rem', color: c.muted, margin: '0.5rem 0 0 0'}}>Only enter if you wish to change your login password.</p>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={loading} style={{...styles.saveBtn, opacity: loading ? 0.7 : 1}}>
                        {loading ? 'Saving...' : <><Save size={18}/> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
