import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import UserRegisterPage from './pages/Auth/UserRegisterPage';
import ClinicRegisterPage from './pages/Auth/ClinicRegisterPage';
import DoctorRegisterPage from './pages/Auth/DoctorRegisterPage';
import Navbar from './components/Navbar';
import { useAuth } from './contexts/AuthContext';
import SearchDoctor from './pages/SearchDoctor';

function App() {
  const { auth } = useAuth();

  const UserHome = () => <div>User Home</div>;
  const ClinicHome = () => <div>Clinic Home</div>;
  const DoctorHome = () => <div>Doctor Home</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            auth.isAuthenticated 
              ? <Navigate to={`/${auth.user.role.toLowerCase()}/home`} replace />
              : <LoginPage />
          } 
        />
        <Route path="/register/user" element={<UserRegisterPage />} />
        <Route path="/register/clinic" element={<ClinicRegisterPage />} />
        <Route path="/search" element={<SearchDoctor />} />


        {/* Protected Routes */}
        <Route 
          path="/user/home" 
          element={
            auth.isAuthenticated && auth.user.role === 'USER'
              ? (<><Navbar /><UserHome /></>)
              : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/clinic/home" 
          element={
            auth.isAuthenticated && auth.user.role === 'CLINIC'
              ? (<><Navbar /><ClinicHome /></>)
              : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/doctor/home" 
          element={
            auth.isAuthenticated && auth.user.role === 'DOCTOR'
              ? (<><Navbar /><DoctorHome /></>)
              : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/clinic/register-doctor" 
          element={
            auth.isAuthenticated && auth.user.role === 'CLINIC'
              ? (<><Navbar /><DoctorRegisterPage /></>)
              : <Navigate to="/" replace />
          } 
        />

<Route 
          path="/search" 
          element={
            auth.isAuthenticated
              ? (<><Navbar /><SearchDoctorPage /></>)
              : <Navigate to="/" replace />
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
