import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';

// Public Pages
import LoginPage from './pages/Auth/LoginPage';
import UserRegisterPage from './pages/Auth/UserRegisterPage';
import ClinicRegisterPage from './pages/Auth/ClinicRegisterPage';
import DoctorRegisterPage from './pages/Auth/DoctorRegisterPage';
import ClinicDashboardPage from './pages/ClinicDashboardPage';
import SearchDoctorPage from './pages/SearchDoctor/SearchDoctor';
import UserHome from './pages/UserHome';

// Protected Pages
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import ManageAppointmentsPage from './pages/ManageAppointmentsPage';

// Dummy components for demonstration
const DoctorHome = () => <div>Doctor Home</div>;

const LayoutWithNavbar = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);


function App() {
  const { auth } = useAuth();

  if (auth.loading) {
    return <div>Loading...</div>;
  // const ClinicHome = () => <div>Clinic Home</div>;
  }

  return (

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={auth.isAuthenticated ? <Navigate to={`/${auth.user.role.toLowerCase()}/home`} replace /> : <LoginPage />} />
          <Route path="/register/user" element={<UserRegisterPage />} />
          <Route path="/register/clinic" element={<ClinicRegisterPage />} />
          <Route path="/register/doctor" element={<DoctorRegisterPage />} />

          <Route element={<LayoutWithNavbar />}>
            <Route path="/search" element={<SearchDoctorPage />} />
          </Route>
        
          {/* Protected Routes */}
          {auth.isAuthenticated ? (
            <Route element={<LayoutWithNavbar />}>
              <Route path="/" element={<Navigate to={`/${auth.user.role.toLowerCase()}/home`} replace />} />
              <Route path="/user/home" element={<UserHome />} />
              <Route path="/clinic/home" element={<ClinicDashboardPage />} />
              <Route path="/doctor/home" element={<DoctorHome />} />
              <Route path="/clinic/appointments/:doctorId" element={<ManageAppointmentsPage />} />
              <Route path="/clinic/register-doctor" element={<DoctorRegisterPage />} />
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>

  );
}

export default App;
