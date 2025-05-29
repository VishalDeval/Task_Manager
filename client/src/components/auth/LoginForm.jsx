// client/src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { login as loginService } from '../../services/authService';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Make sure you've run: npm install react-icons

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/board";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginService({ username, password });
      authLogin(response.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Styles
  const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
  const inputStyle = { width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };
  const passwordInputContainerStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
  const passwordInputStyle = { ...inputStyle, paddingRight: '40px' /* Make space for the icon */ };
  const passwordToggleStyle = {
    position: 'absolute',
    right: '10px', // Position icon inside the input field
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0', // Remove default button padding
    display: 'flex',
    alignItems: 'center',
    color: '#555' // Icon color
  };
  const buttonStyle = { padding: '12px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1em' };
  const errorStyle = { color: 'red', fontSize: '0.9em', textAlign: 'center' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500' };


  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>Login</h2>
      {error && <p style={errorStyle}>{error}</p>}
      <div>
        <label htmlFor="login-username" style={labelStyle}>Username:</label>
        <input
          type="text"
          id="login-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
          placeholder="Enter your username"
        />
      </div>
      <div>
        <label htmlFor="login-password" style={labelStyle}>Password:</label>
        <div style={passwordInputContainerStyle}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={passwordInputStyle}
            placeholder="Enter your password"
          />
          <button 
            type="button" // Important: type="button" to prevent form submission
            onClick={togglePasswordVisibility} 
            style={passwordToggleStyle} 
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
