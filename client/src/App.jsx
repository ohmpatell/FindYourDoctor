import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import UserRegisterPage from './pages/Auth/UserRegisterPage';
import ClinicRegisterPage from './pages/Auth/ClinicRegisterPage';
import DoctorRegisterPage from './pages/Auth/DoctorRegisterPage';
import Navbar from './components/Navbar';
import { useAuth } from './contexts/AuthContext';
import SearchDoctor from './pages/SearchDoctor';
import ClinicDashboardPage from './pages/ClinicDashboardPage';
import ManageAppointmentsPage from './pages/ManageAppointmentsPage';

function App() {
  const { auth } = useAuth();

  const UserHome = () => <div>User Home</div>;
  const DoctorHome = () => <div>Doctor Home</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            auth.isAuthenticated
              ? <Navigate to={`/${auth.user.role.toLowerCase()}/dashboard`} replace />
              : <LoginPage />
          }
        />
        <Route path="/register/user" element={<UserRegisterPage />} />
        <Route path="/register/clinic" element={<ClinicRegisterPage />} />
        <Route path="/register/doctor" element={<DoctorRegisterPage />} />
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
        <Route path="/clinic/home" element={<Navigate to="/clinic/dashboard" replace />} />

        <Route
          path="/clinic/dashboard"
          element={
            auth.isAuthenticated && auth.user.role === 'CLINIC'
              ? (<><Navbar /><ClinicDashboardPage /></>)
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/clinic/appointments/:doctorId"
          element={
            auth.isAuthenticated && auth.user.role === 'CLINIC'
              ? (<><Navbar /><ManageAppointmentsPage /></>)
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
          path="/doctor/home"
          element={
            auth.isAuthenticated && auth.user.role === 'DOCTOR'
              ? (<><Navbar /><DoctorHome /></>)
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
