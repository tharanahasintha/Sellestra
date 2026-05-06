import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Ensure token hasn't expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({ ...decoded, role: decoded.role || 'USER' }); 
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const loginContext = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({ ...decoded, role: decoded.role || 'USER' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Generic dummy data for demonstration if microservices are offline 
  const setDummyUser = () => {
      setUser({ email: 'user@sellestra.com', role: 'USER' });
      localStorage.setItem('token', 'dummy.jwt.token');
  }
  
  const setDummyAdmin = () => {
      setUser({ email: 'admin@sellestra.com', role: 'ADMIN' });
      localStorage.setItem('token', 'dummy.jwt.token');
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginContext, logout, setDummyUser, setDummyAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
