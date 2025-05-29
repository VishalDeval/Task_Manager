// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          // Ensure your JWT payload has userId and username
          setUser({ id: decodedToken.userId, username: decodedToken.username }); 
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Invalid token on initial load:", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    try {
        const decodedToken = jwtDecode(token);
        // Ensure your JWT payload has userId and username
        setUser({ id: decodedToken.userId, username: decodedToken.username });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
        console.error("Error decoding token during login:", error);
        logout(); // Clear potentially bad state
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>Loading Application...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated: !!user, isLoading: loading }}>
      {children}
    </AuthContext.Provider>
  );
};
