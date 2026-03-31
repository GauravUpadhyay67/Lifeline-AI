import { Activity, ArrowLeft, Briefcase, Calendar, ChevronDown, Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { register, reset } from '../redux/slices/authSlice';

// Helper to calculate age from DOB
const calculateAge = (dobString) => {
  if (!dobString) return undefined;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age > 0 ? age : 0;
};

// FormInput — OUTSIDE component to prevent React focus-loss bug
const FormInput = ({ label, name, value, onChange, type = "text", placeholder, icon: Icon, required = false, darkMode, c, isPassword = false, ...props }) => {
  const [showPw, setShowPw] = useState(false);
  const inputType = isPassword ? (showPw ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: '0.4rem', color: c.text, fontSize: '0.85rem', fontWeight: '600' }} htmlFor={`reg-${name}`}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: c.muted, pointerEvents: 'none', zIndex: 1 }} />}
        <input
          id={`reg-${name}`} type={inputType} name={name} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          style={{
            width: '100%', padding: `0.85rem ${isPassword ? '2.8rem' : '1rem'} 0.85rem ${Icon ? '2.8rem' : '1rem'}`,
            backgroundColor: c.inputBg, border: c.inputBorder, borderRadius: '14px',
            color: c.text, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = c.inputFocusBorder; e.target.style.boxShadow = `0 0 0 4px ${c.inputFocusRing}`; }}
          onBlur={e => { e.target.style.borderColor = c.inputBorder.split(' ')[2]; e.target.style.boxShadow = 'none'; }}
          {...props}
        />
        {isPassword && (
          <div onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: c.muted, cursor: 'pointer', zIndex: 1 }}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Select — OUTSIDE component
const CustomSelect = ({ label, options, value, onChange, name, placeholder, icon: Icon, c }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div style={{ marginBottom: '1.25rem' }} ref={ref}>
      {label && <label style={{ display: 'block', marginBottom: '0.4rem', color: c.text, fontSize: '0.85rem', fontWeight: '600' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <div onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%', padding: `0.85rem 2.8rem 0.85rem ${Icon ? '2.8rem' : '1rem'}`,
            backgroundColor: c.inputBg, border: isOpen ? `1px solid ${c.inputFocusBorder}` : c.inputBorder,
            borderRadius: '14px', color: value ? c.text : c.muted, fontSize: '0.95rem', cursor: 'pointer',
            boxShadow: isOpen ? `0 0 0 4px ${c.inputFocusRing}` : 'none',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', boxSizing: 'border-box',
          }}>
          {Icon && <Icon size={18} style={{ position: 'absolute', left: '1rem', color: c.muted }} />}
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selected ? selected.label : (placeholder || 'Select...')}
          </span>
          <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', color: c.muted, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
        {isOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
            backgroundColor: c.dropdownBg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: c.cardBorder, borderRadius: '14px', padding: '0.4rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)', zIndex: 50, maxHeight: '220px', overflowY: 'auto',
          }}>
            {options.map(opt => (
              <div key={opt.value}
                onClick={() => { onChange({ target: { name, value: opt.value } }); setIsOpen(false); }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = c.dropdownHover}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                style={{
                  padding: '0.65rem 1rem', borderRadius: '10px', cursor: 'pointer',
                  color: c.text, fontSize: '0.9rem', transition: 'background-color 0.15s',
                  backgroundColor: value === opt.value ? c.dropdownActive : 'transparent',
                  fontWeight: value === opt.value ? '600' : '400',
                }}>
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Role configurations ───
const roleConfigs = {
  patient: {
    title: 'Create Patient Account',
    subtitle: 'Track your health, chat with AI, and find blood donors',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    nameIcon: User,
  },
  doctor: {
    title: 'Create Doctor Account',
    subtitle: 'Connect with patients and manage your practice digitally',
    nameLabel: 'Doctor Name',
    namePlaceholder: 'e.g. Dr. Anika Sharma',
    nameIcon: User,
  },
  hospital: {
    title: 'Register Hospital',
    subtitle: 'Manage your hospital, verify doctors, and coordinate care',
    nameLabel: 'Hospital Name',
    namePlaceholder: 'e.g. Apollo Hospital Delhi',
    nameIcon: MapPin,
  },
};

const Register = () => {
  const { role: urlRole } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  const role = ['patient', 'doctor', 'hospital'].includes(urlRole) ? urlRole : 'patient';
  const config = roleConfigs[role];

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', bloodType: '', dob: '', gender: '',
    specialization: '', licenseNumber: '', hospitalName: '', practiceType: 'hospital_affiliated',
  });

  const {
    name, email, password, confirmPassword, phone, address, bloodType, dob, gender,
    specialization, licenseNumber, hospitalName, practiceType
  } = formData;

  const { user, isLoading, isError, isSuccess, message } = useSelector(s => s.auth);

  useEffect(() => {
    if (isError) alert(message);
    if (isSuccess || user) navigate('/dashboard');
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    const { name: fn, value: fv } = e.target;
    if (fn === 'phone' && fv && !/^[\d\s+\-()]*$/.test(fv)) return;
    setFormData(prev => ({ ...prev, [fn]: fv }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) { alert('Please fill in all required fields.'); return; }
    if (password.length < 6) { alert('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { alert('Passwords do not match.'); return; }
    if (role === 'doctor' && !specialization.trim()) { alert('Please enter your specialization.'); return; }
    if (role === 'doctor' && !licenseNumber.trim()) { alert('Please enter your license number.'); return; }
    if (role === 'hospital' && !licenseNumber.trim()) { alert('Please enter your registration number.'); return; }

    const userData = {
      name: name.trim(), email: email.trim().toLowerCase(), password, role,
      phone: phone.trim() || undefined, address: address.trim() || undefined,
      bloodType: bloodType || undefined, age: calculateAge(dob),
      gender: gender || undefined, specialization: specialization.trim() || undefined,
      licenseNumber: licenseNumber.trim() || undefined,
      hospitalName: (role === 'doctor' ? hospitalName.trim() : undefined) || undefined,
      practiceType: role === 'doctor' ? practiceType : undefined,
    };
    dispatch(register(userData));
  };

  const c = {
    bg: darkMode ? 'linear-gradient(180deg, #020617 0%, #0f172a 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f0f4ff 100%)',
    cardBg: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    dropdownBg: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.98)',
    dropdownHover: darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.04)',
    dropdownActive: darkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(37, 99, 235, 0.08)',
    cardBorder: darkMode ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid rgba(0, 0, 0, 0.08)',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    muted: darkMode ? '#94a3b8' : '#64748b',
    inputBg: darkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff',
    inputBorder: darkMode ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #cbd5e1',
    inputFocusBorder: darkMode ? 'rgba(56, 189, 248, 0.5)' : '#3b82f6',
    inputFocusRing: darkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(59, 130, 246, 0.15)',
    buttonGradient: darkMode ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    link: darkMode ? '#38bdf8' : '#2563eb',
  };

  const fp = { onChange, darkMode, c };

  return (
    <div style={{
      minHeight: '100vh', background: c.bg, padding: '40px 20px',
      fontFamily: "'Inter', -apple-system, sans-serif", position: 'relative', overflow: 'hidden',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
    }}>
      {/* Background Ornaments */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%', background: darkMode ? 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '400px', height: '400px', borderRadius: '50%', background: darkMode ? 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        position: 'relative', zIndex: 10, backgroundColor: c.cardBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        padding: '2.5rem', borderRadius: '24px',
        boxShadow: darkMode ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 20px 25px -5px rgba(0,0,0,0.05)',
        border: c.cardBorder, width: '100%', maxWidth: '560px',
      }}>
        {/* Back Button */}
        <div
          onClick={() => navigate('/register')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: c.muted, cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: '500' }}
        >
          <ArrowLeft size={16} /> Change account type
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: c.text, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            {config.title}
          </h1>
          <p style={{ color: c.muted, fontSize: '0.9rem', margin: 0 }}>{config.subtitle}</p>
        </div>

        <form onSubmit={onSubmit}>
          {/* Name (contextual) */}
          <FormInput label={config.nameLabel} name="name" placeholder={config.namePlaceholder} icon={config.nameIcon} value={name} required {...fp} />
          <FormInput label="Email Address" name="email" type="email" placeholder="Enter your email" icon={Mail} value={email} required {...fp} />

          {/* Verification notice */}
          {(role === 'doctor' || role === 'hospital') && (
            <div style={{
              padding: '0.85rem 1rem', borderRadius: '12px',
              background: darkMode ? 'rgba(251, 191, 36, 0.1)' : '#fffbeb',
              border: '1px solid rgba(251, 191, 36, 0.3)', color: darkMode ? '#fbbf24' : '#92400e',
              fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.25rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
              <span>
                {role === 'doctor'
                  ? <><strong>Doctor accounts require verification.</strong> Hospital-affiliated doctors are verified by their hospital. Independent practitioners are verified by our admin team.</>
                  : <><strong>Hospital registration requires verification.</strong> Your credentials will be reviewed by our admin team before you can access the dashboard.</>
                }
              </span>
            </div>
          )}

          {/* ─── Patient Fields ─── */}
          {role === 'patient' && (
            <>
              <CustomSelect label="Blood Type" name="bloodType" value={bloodType} onChange={onChange}
                options={[{ value: '', label: 'Select' }, ...['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => ({ value: bt, label: bt }))]}
                c={c} icon={Activity}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormInput label="Date of Birth" name="dob" type="date" icon={Calendar} value={dob} required {...fp} />
                <CustomSelect label="Gender" name="gender" value={gender} onChange={onChange}
                  options={[{ value: '', label: 'Select' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]}
                  c={c}
                />
              </div>
              <FormInput label="Address" name="address" placeholder="Full Address" icon={MapPin} value={address} {...fp} />
              <FormInput label="Phone Number" name="phone" type="tel" placeholder="e.g. +91 9876543210" icon={Phone} value={phone} maxLength="15" {...fp} />
            </>
          )}

          {/* ─── Doctor Fields ─── */}
          {role === 'doctor' && (
            <>
              <FormInput label="Specialization" name="specialization" placeholder="e.g. Cardiology" icon={Briefcase} value={specialization} required {...fp} />
              <FormInput label="Medical License Number" name="licenseNumber" placeholder="e.g. MCI-2024-12345" icon={Activity} value={licenseNumber} required {...fp} />
              <CustomSelect label="Practice Type" name="practiceType" value={practiceType} onChange={onChange}
                options={[
                  { value: 'hospital_affiliated', label: 'Hospital Affiliated' },
                  { value: 'independent_clinic', label: 'Independent / Private Clinic' },
                ]} c={c} icon={Briefcase}
              />
              <FormInput
                label={practiceType === 'independent_clinic' ? 'Clinic Name' : 'Affiliated Hospital Name'}
                name="hospitalName"
                placeholder={practiceType === 'independent_clinic' ? 'Your clinic name' : 'Hospital you are affiliated with'}
                icon={MapPin} value={hospitalName} required {...fp}
              />
              <FormInput label="Phone Number" name="phone" type="tel" placeholder="e.g. +91 9876543210" icon={Phone} value={phone} maxLength="15" {...fp} />
            </>
          )}

          {/* ─── Hospital Fields ─── */}
          {role === 'hospital' && (
            <>
              <FormInput label="Hospital Address" name="address" placeholder="Full Hospital Address" icon={MapPin} value={address} required {...fp} />
              <FormInput label="Contact Phone" name="phone" type="tel" placeholder="Emergency contact number" icon={Phone} value={phone} maxLength="15" required {...fp} />
              <FormInput label="Government Registration Number" name="licenseNumber" placeholder="e.g. HOSP-DL-2024-001" icon={Activity} value={licenseNumber} required {...fp} />
            </>
          )}

          {/* ─── Password ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput label="Password" name="password" placeholder="Min. 6 chars" icon={Lock} value={password} required minLength="6" isPassword {...fp} />
            <FormInput label="Confirm Password" name="confirmPassword" placeholder="Confirm" icon={Lock} value={confirmPassword} required minLength="6" isPassword {...fp} />
          </div>

          <button type="submit" disabled={isLoading}
            style={{
              width: '100%', padding: '0.9rem', background: c.buttonGradient, color: 'white',
              border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '0.5rem', transition: 'all 0.3s',
              boxShadow: '0 8px 25px rgba(37,99,235,0.25)', opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,99,235,0.35)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(37,99,235,0.25)'; }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: c.muted, marginBottom: 0 }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: c.link, fontWeight: '600', cursor: 'pointer' }}>Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
