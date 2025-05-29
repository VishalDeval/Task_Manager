// client/src/components/board/ConfirmClearDoneModal.jsx
import React from 'react';

// Styles (can be refactored to a common modal style or CSS classes)
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.65)', display: 'flex', // Slightly darker overlay
  alignItems: 'center', justifyContent: 'center', zIndex: 1050,
};
const modalContentStyle = {
  backgroundColor: '#fff', padding: '30px 35px', borderRadius: '8px',
  boxShadow: '0 7px 20px rgba(0,0,0,0.25)', maxWidth: '420px',
  width: '90%', textAlign: 'center',
};
const modalTitleStyle = { 
    fontSize: '1.5em', fontWeight: '600', marginBottom: '15px', color: '#2c3e50' // Dark blue/grey
};
const modalMessageStyle = { 
    fontSize: '1em', marginBottom: '30px', color: '#555', lineHeight: 1.6,
    wordWrap: 'break-word' 
};
const modalActionsStyle = { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' };
const buttonBaseStyle = {
  padding: '10px 22px', border: 'none', borderRadius: '5px',
  cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95em',
  transition: 'background-color 0.2s ease, opacity 0.2s ease, transform 0.1s ease-out'
};
const confirmButtonStyle = { 
    ...buttonBaseStyle, 
    backgroundColor: '#d32f2f', // Material Design Red 700
    color: 'white',
    '&:hover': { backgroundColor: '#c62828' } // Darker red on hover (for CSS class)
};
const cancelButtonStyle = { 
    ...buttonBaseStyle, 
    backgroundColor: '#757575', // Material Design Grey 600
    color: 'white',
    '&:hover': { backgroundColor: '#616161' } // Darker grey on hover (for CSS class)
};

const ConfirmClearDoneModal = ({ isOpen, onClose, onConfirm, doneTasksCount }) => {
  if (!isOpen) {
    return null;
  }

  // Inline hover effect for buttons (alternative to CSS classes)
  const handleButtonHover = (e, color, hoverColor) => {
    e.currentTarget.style.backgroundColor = color;
  };
  const handleButtonLeave = (e, originalColor) => {
    e.currentTarget.style.backgroundColor = originalColor;
  };


  return (
    <div style={modalOverlayStyle} onClick={onClose}> {/* Close on overlay click */}
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside modal */}
        <h3 style={modalTitleStyle}>Confirm Action</h3>
        <p style={modalMessageStyle}>
          Are you sure you want to delete all <strong>{doneTasksCount}</strong> task(s)
          currently in the "Done" column? <br/>This action cannot be undone.
        </p>
        <div style={modalActionsStyle}>
          <button 
            style={cancelButtonStyle} 
            onClick={onClose}
            onMouseEnter={(e) => handleButtonHover(e, '#616161')}
            onMouseLeave={(e) => handleButtonLeave(e, '#757575')}
          >
            Cancel
          </button>
          <button 
            style={confirmButtonStyle} 
            onClick={onConfirm} 
            disabled={doneTasksCount === 0}
            onMouseEnter={(e) => ! (doneTasksCount === 0) && handleButtonHover(e, '#c62828')}
            onMouseLeave={(e) => ! (doneTasksCount === 0) && handleButtonLeave(e, '#d32f2f')}
          >
            {doneTasksCount === 0 ? "Nothing to Clear" : `Clear ${doneTasksCount} Task(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmClearDoneModal;
