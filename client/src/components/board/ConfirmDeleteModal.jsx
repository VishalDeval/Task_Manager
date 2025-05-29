// client/src/components/board/ConfirmDeleteModal.jsx
import React from 'react';

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1050,
};
const modalContentStyle = {
  backgroundColor: '#fff', padding: '25px 30px', borderRadius: '8px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)', maxWidth: '400px',
  width: '90%', textAlign: 'center',
};
const modalTitleStyle = { fontSize: '1.4em', fontWeight: '600', marginBottom: '10px', color: '#333' };
const modalMessageStyle = { fontSize: '1em', marginBottom: '25px', color: '#555', lineHeight: 1.6 };
const modalActionsStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px' };
const buttonBaseStyle = {
  padding: '10px 20px', border: 'none', borderRadius: '5px',
  cursor: 'pointer', fontWeight: '500', fontSize: '0.95em',
  transition: 'background-color 0.2s ease, opacity 0.2s ease'
};
const confirmButtonStyle = { ...buttonBaseStyle, backgroundColor: '#dc3545', color: 'white' };
const cancelButtonStyle = { ...buttonBaseStyle, backgroundColor: '#6c757d', color: 'white' };

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={modalTitleStyle}>Confirm Deletion</h3>
        <p style={modalMessageStyle}>
          Are you sure you want to delete task: <strong>"{taskTitle}"</strong>? This action cannot be undone.
        </p>
        <div style={modalActionsStyle}>
          <button style={cancelButtonStyle} onClick={onClose}>Cancel</button>
          <button style={confirmButtonStyle} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
