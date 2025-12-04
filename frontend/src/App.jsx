import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import DiseaseDetection from './pages/DiseaseDetection';
import Chatbot from './pages/Chatbot';
import MedicalReports from './pages/MedicalReports';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/medical-reports" element={<MedicalReports />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
