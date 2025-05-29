// client/src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaSearch } from 'react-icons/fa'; // Ensure react-icons is installed

const Navbar = ({ searchTerm, onSearchChange }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#333',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    fontSize: '1.6em',
    fontWeight: 'bold',
  };

  const userInfoStyle = {
    marginRight: '20px',
    fontSize: '0.9em',
  };

  const buttonStyle = {
    padding: '8px 15px',
    cursor: 'pointer',
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9em',
  };

  const authLinkStyle = {
    marginRight: '10px',
    textDecoration: 'none',
    color: '#007bff',
    padding: '8px 12px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    fontWeight: '500'
  };

  const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#4a4a4a', // Slightly lighter than navbar for contrast
    borderRadius: '20px',
    padding: '6px 12px',
    margin: '0 20px', // Add some margin
    flexGrow: 0.4, // Allow it to take some space but not too much
    maxWidth: '450px', // Max width for search bar
  };

  const searchInputStyle = {
    border: 'none',
    background: 'transparent',
    color: 'white',
    outline: 'none',
    marginLeft: '10px',
    fontSize: '0.95em',
    width: '100%', // Take full width within its container
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>KanbanFlow</Link>
      
      {isAuthenticated && (
        <div style={searchContainerStyle}>
          <FaSearch style={{ color: '#aaa' }} /> {/* Icon color */}
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={searchInputStyle}
          />
        </div>
      )}

      <div>
        {isAuthenticated && user ? (
          <>
            <span style={userInfoStyle}>Welcome, {user.username}!</span>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <Link to="/auth" style={authLinkStyle}>Login / Register</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
