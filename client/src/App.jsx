// client/src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import BoardPage from './pages/BoardPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';

function App() {
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '20px', minHeight: 'calc(100vh - 70px)' /* Adjust based on navbar height */ }}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/board" 
            element={
              <ProtectedRoute>
                <BoardPage searchTerm={searchTerm} /> {/* Pass search term to BoardPage */}
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/board" />} />
          <Route path="*" element={<Navigate to="/board" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
