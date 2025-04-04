import React, { useState, createContext, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Start with a loading state while we verify the user.
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });
  
  const navigate = useNavigate();
  

  // This function calls the backend to check if a valid httpOnly cookie is present.
  const fetchUser = async () => {
    if (auth.isAuthenticated) return;

    try {
      const response = await api.get('/auth/me');
      const { user } = response.data;
      setAuth({
        isAuthenticated: true,
        user,
        loading: false,
      });

      if (user) {
        navigate(`/${user.role.toLowerCase()}/home`); // Redirect based on user role
      }

    } catch (error) {
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * Login user. On success, the server sets an httpOnly cookie, and we fetch the user.
   */
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    await fetchUser(); // Refresh auth state after login.
    return response.data;
  };

  /**
   * Logout user. This calls an endpoint to clear the cookie.
   */
  const logout = async () => {
    await api.post('/auth/logout');
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  /**
   * Register a new user. On success, the server sets an httpOnly cookie, auto-logging in the user.
   */
  const registerUser = async (firstName, lastName, email, password, phoneNumber, profileImage) => {
    const response = await api.post(
      '/auth/register/user',
      { firstName, lastName, email, password, phoneNumber, profileImage }
    );
    await fetchUser();
    return response.data;
  };

  /**
   * Register a new clinic. On success, the server sets an httpOnly cookie, auto-logging in the clinic.
   */
  const registerClinic = async (name, email, password, phoneNumber, address, profileImage) => {
    const response = await api.post(
      '/auth/register/clinic',
      { name, email, password, phoneNumber, address, profileImage }
    );
    await fetchUser();
    return response.data;
  };

  /**
   * Register a new doctor.
   * Note: If you don't intend to auto-login a doctor after registration,
   * you might not call fetchUser() here.
   */
  const registerDoctor = async (
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    specialization,
    clinicId,
    profileImage
  ) => {
    const response = await api.post(
      '/auth/register/doctor',
      { firstName, lastName, email, password, phoneNumber, specialization, clinicId, profileImage }
    );
    return response.data;
  };

  // Optionally, while loading you can show a spinner or any placeholder.
  if (auth.loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, registerUser, registerClinic, registerDoctor }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
