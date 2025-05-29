// client/src/pages/AuthPage.jsx
import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated, isLoading } = useAuth(); // Use isLoading from context
  const location = useLocation();
  const from = location.state?.from?.pathname || "/board";

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const pageStyle = {
    maxWidth: '450px',
    margin: '60px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  };

  const toggleButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
    fontSize: '0.9em'
  };

  return (
    <div style={pageStyle}>
      {showLogin ? (
        <>
          <LoginForm />
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em' }}>
            Don't have an account?{' '}
            <button onClick={() => setShowLogin(false)} style={toggleButtonStyle}>
              Register here
            </button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm onRegistrationSuccess={() => setShowLogin(true)} /> {/* Prop to switch to login */}
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em' }}>
            Already have an account?{' '}
            <button onClick={() => setShowLogin(true)} style={toggleButtonStyle}>
              Login here
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthPage;
