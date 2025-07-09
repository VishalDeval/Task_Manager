// client/src/pages/BoardPage.jsx
import React from 'react';
import Board from '../components/board/Board';

const BoardPage = ({ searchTerm }) => {
  const pageStyle = {
    padding: '0px 20px 20px 20px', // Reduced top padding as Navbar has padding
    // minHeight: 'calc(100vh - 70px)' // Already handled by App.jsx container
  };

  const headerStyle = {
    textAlign: 'center',
    margin: '20px 0 30px 0', // Adjusted margin
    color: '#333',
    fontSize: '2.5em',
  };

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>My Task Board</h1>
      <Board searchTerm={searchTerm} />
    </div>
  );
};

export default BoardPage;
