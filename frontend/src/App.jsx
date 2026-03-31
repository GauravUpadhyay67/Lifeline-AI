import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Chatbot from './pages/Chatbot';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import MedicalReports from './pages/MedicalReports';
import Profile from './pages/Profile';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import AdminDashboard from './pages/AdminDashboard';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RoleSelection />} />
            <Route path="/register/:role" element={<Register />} />

            {/* Admin Route */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
            <Route path="/medical-reports" element={<ProtectedRoute><MedicalReports /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
