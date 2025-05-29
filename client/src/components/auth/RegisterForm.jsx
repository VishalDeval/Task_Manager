// client/src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import useAuth from '../../hooks/useAuth'; // Import useAuth
import { register as registerService } from '../../services/authService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = ({ onRegistrationSuccess }) => { // onRegistrationSuccess might not be needed anymore
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  // const [success, setSuccess] = useState(''); // Success message can be removed if redirecting immediately
  const [loading, setLoading] = useState(false);

  const { login: authLogin } = useAuth(); // Get the login function from AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  // Determine where to redirect after successful registration and login
  const from = location.state?.from?.pathname || "/board"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // setSuccess(''); // No longer needed if auto-logging in

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // The registerService now returns a response containing the token
      const response = await registerService({ username, password });
      
      // If registration is successful and token is received
      if (response.data && response.data.token) {
        authLogin(response.data.token); // Use AuthContext's login to set token and user state
        navigate(from, { replace: true }); // Navigate to the board or intended page
      } else {
        // This case should ideally not happen if backend sends token on 201
        setError('Registration successful, but auto-login failed. Please try logging in manually.');
      }
      // Clear form fields (optional, as we are redirecting)
      // setUsername('');
      // setPassword('');
      // setConfirmPassword('');

      // The onRegistrationSuccess prop to switch view to login is no longer primary
      // if (onRegistrationSuccess) {
      //   onRegistrationSuccess(); 
      // }

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Styles (can be refactored into a common style object or CSS classes)
  const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
  const inputStyle = { width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };
  const passwordInputContainerStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
  const passwordInputStyle = { ...inputStyle, paddingRight: '40px' };
  const passwordToggleStyle = {
    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: '0',
    display: 'flex', alignItems: 'center', color: '#555'
  };
  const buttonStyle = { padding: '12px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1em' };
  const errorStyle = { color: 'red', fontSize: '0.9em', textAlign: 'center' };
  // const successStyle = { color: 'green', fontSize: '0.9em', textAlign: 'center' }; // Not displaying success message if redirecting
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500' };


  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>Register</h2>
      {error && <p style={errorStyle}>{error}</p>}
      {/* {success && <p style={successStyle}>{success}</p>} */}
      <div>
        <label htmlFor="register-username" style={labelStyle}>Username:</label>
        <input
          type="text" id="register-username" value={username}
          onChange={(e) => setUsername(e.target.value)} required style={inputStyle}
          placeholder="Choose a username"
        />
      </div>
      <div>
        <label htmlFor="register-password" style={labelStyle}>Password:</label>
        <div style={passwordInputContainerStyle}>
          <input
            type={showPassword ? 'text' : 'password'} id="register-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            required minLength="6" style={passwordInputStyle}
            placeholder="Create a password (min. 6 characters)"
          />
          <button type="button" onClick={togglePasswordVisibility} style={passwordToggleStyle} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="confirm-password" style={labelStyle}>Confirm Password:</label>
        <div style={passwordInputContainerStyle}>
          <input
            type={showConfirmPassword ? 'text' : 'password'} id="confirm-password"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            required style={passwordInputStyle} placeholder="Confirm your password"
          />
          <button type="button" onClick={toggleConfirmPasswordVisibility} style={passwordToggleStyle} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
