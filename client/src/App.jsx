// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import UserRegisterPage from './pages/Auth/UserRegisterPage';
import ClinicRegisterPage from './pages/Auth/ClinicRegisterPage';
import { useAuth } from './contexts/AuthContext';

// Dummy Home pages – replace with your actual components.
const UserHome = () => <div>User Home Page</div>;
const ClinicHome = () => <div>Clinic Home Page</div>;
const DoctorHome = () => <div>Doctor Home Page</div>;

/**
 * RequireAuth component:
 * - Checks if the user is authenticated.
 * - Checks if the user's role is allowed for the current route.
 * - If not authenticated, redirects to "/" (LoginPage).
 * - If role mismatch, redirects to the appropriate home page.
 */
function RequireAuth({ allowedRoles }) {
  const { auth } = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (!allowedRoles.includes(auth.user.role)) {
    // Redirect to user's home page based on role.
    return <Navigate to={`/${auth.user.role.toLowerCase()}/home`} replace />;
  }
  return <Outlet />;
}

function App() {
  const { auth } = useAuth();
  
  return (
    <Router>
      <Routes>
        {/* Public Route: If logged in, redirect based on role; otherwise, show LoginPage */}
        <Route
          path="/"
          element={
            auth.isAuthenticated
              ? <Navigate to={`/${auth.user.role.toLowerCase()}/home`} replace />
              : <LoginPage />
          }
        />
        {/* Registration Routes */}
        <Route path="/register/user" element={<UserRegisterPage />} />
        <Route path="/register/clinic" element={<ClinicRegisterPage />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth allowedRoles={['USER']} />}>
          <Route path="/user/home" element={<UserHome />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={['CLINIC']} />}>
          <Route path="/clinic/home" element={<ClinicHome />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={['DOCTOR']} />}>
          <Route path="/doctor/home" element={<DoctorHome />} />
        </Route>

        {/* Catch-all: redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
