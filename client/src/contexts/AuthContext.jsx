import { useState, createContext, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  const checkLocalStorageForUser = async () => {
    const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (userInfo) {
      const { user, token } = JSON.parse(userInfo);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuth({ isAuthenticated: true, user });
    }
  }

  useEffect(() => {
    checkLocalStorageForUser();
  }, []);

  /**
   * @desc Login user
   * @param {*} email 
   * @param {*} password 
   * @returns 
   */
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data;
    localStorage
      ? localStorage.setItem('userInfo', JSON.stringify({ user, token }))
      : sessionStorage.setItem('userInfo', JSON.stringify({ user, token }));

    setAuth({ isAuthenticated: true, user });
    return response.data;
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('userInfo');
        setAuth({ isAuthenticated: false, user: null });
    };

    const registerUser = async (firstName, lastName, email, password, phoneNumber) => {
        const response = await api.post('/auth/register/user', { firstName, lastName, email, password, phoneNumber });
        const { user, token } = response.data;
        localStorage
            ? localStorage.setItem('userInfo', JSON.stringify({ user, token }))
            : sessionStorage.setItem('userInfo', JSON.stringify({ user, token }));

        setAuth({ isAuthenticated: true, user });
        return response.data;
    };

    const registerClinic = async (name, email, password, phoneNumber, address) => {
        const response = await api.post('/auth/register/clinic', { name, email, password, phoneNumber, address });
        const { user, token } = response.data;
        localStorage
            ? localStorage.setItem('userInfo', JSON.stringify({ user, token }))
            : sessionStorage.setItem('userInfo', JSON.stringify({ user, token }));

        setAuth({ isAuthenticated: true, user });
        return response.data;
    };
    
    const registerDoctor = async (firstName, lastName, email, password, phoneNumber, specialty, clinicId) => {
        const response = await api.post('/auth/register/doctor', { firstName, lastName, email, password, phoneNumber, specialty, clinicId });
        const { user } = response.data;
        
        return response.data;
    };
    

    return (
        <AuthContext.Provider value={{ auth, checkLocalStorageForUser, login, logout, registerUser, registerClinic, registerDoctor }}>
            {children}
        </AuthContext.Provider>
    );
};