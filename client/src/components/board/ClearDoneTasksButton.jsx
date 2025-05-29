// client/src/components/board/ClearDoneTasksButton.jsx
import React from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Ensure react-icons is installed

const ClearDoneTasksButton = ({ onClick, disabled }) => {
  const style = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: disabled ? '#b0bec5' : '#e53935', // Material Design Red 600, and a disabled grey
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px', // Adjusted icon size
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    zIndex: 1000, // Ensure it's above other content
    transition: 'background-color 0.2s ease, transform 0.15s ease-out, box-shadow 0.2s ease',
    outline: 'none',
  };

  const hoverTransform = !disabled ? 'scale(1.08)' : 'scale(1)';
  const activeTransform = !disabled ? 'scale(0.95)' : 'scale(1)';

  return (
    <button 
      onClick={onClick} 
      style={style} 
      title={disabled ? "No 'Done' tasks to clear" : "Clear all 'Done' tasks"}
      disabled={disabled}
      onMouseEnter={(e) => e.currentTarget.style.transform = hoverTransform}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseDown={(e) => e.currentTarget.style.transform = activeTransform}
      onMouseUp={(e) => e.currentTarget.style.transform = hoverTransform} // Revert to hover scale after click release
    >
      <FaTrashAlt />
    </button>
  );
};

export default ClearDoneTasksButton;
