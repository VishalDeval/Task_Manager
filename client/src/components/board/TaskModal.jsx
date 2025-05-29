// client/src/components/board/TaskModal.jsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
// import { HexColorPicker } from 'react-colorful';
import "react-datepicker/dist/react-datepicker.css";

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1100,
};
const modalContentStyle = {
  backgroundColor: '#fff', padding: '25px 30px', borderRadius: '10px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.35)', width: '90%', maxWidth: '580px',
  maxHeight: '90vh', overflowY: 'auto'
};
const inputStyle = { width: '100%', padding: '12px', boxSizing: 'border-box', marginBottom: '18px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em' };
const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444', fontSize: '0.9em' };
const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '25px' };
const buttonStyle = { padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95em', transition: 'opacity 0.2s ease' };
const datePickerWrapperStyle = { marginBottom: '18px', width: '100%' };

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit, modalError }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [color, setColor] = useState('#E0E0E0'); // Default to a light grey
  const [internalError, setInternalError] = useState('');

  // Deeper/More Saturated Predefined Colors
  const PREDEFINED_COLORS = [
    '#E0E0E0', // Light Grey (Default)
    '#FFAB91', // Light Salmon/Peach
    '#FFCC80', // Light Orange
    '#FFF59D', // Light Yellow
    '#C5E1A5', // Light Green
    '#80CBC4', // Light Teal
    '#81D4FA', // Light Blue
    '#9FA8DA', // Light Indigo/Lavender
    '#CE93D8', // Light Purple
    '#F48FB1', // Light Pink
    '#BCAAA4', // Light Brown/Taupe
  ];


  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title || '');
        setDescription(taskToEdit.description || '');
        setStartDate(taskToEdit.startDate ? new Date(taskToEdit.startDate) : null);
        setEndDate(taskToEdit.endDate ? new Date(taskToEdit.endDate) : null);
        setColor(taskToEdit.color || '#E0E0E0');
      } else {
        setTitle('');
        setDescription('');
        setStartDate(null);
        setEndDate(null);
        setColor('#E0E0E0'); // Default for new task
      }
      setInternalError('');
    }
  }, [taskToEdit, isOpen]);

  useEffect(() => {
    if (modalError) {
        setInternalError(modalError);
    }
  }, [modalError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setInternalError('Title is required.');
      return;
    }
    if (startDate && endDate && startDate > endDate) {
        setInternalError('End date cannot be earlier than start date.');
        return;
    }
    setInternalError('');
    onSave({
      _id: taskToEdit ? taskToEdit._id : undefined,
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
      color,
      status: taskToEdit ? taskToEdit.status : 'todo'
    });
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ textAlign: 'center', marginBottom: '25px', color: '#2c3e50', fontSize: '1.6em' }}>
          {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
        </h3>
        {(internalError) && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '0.9em' }}>{internalError}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="task-modal-title" style={labelStyle}>Title*:</label>
            <input
              type="text" id="task-modal-title" value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle} placeholder="e.g., Schedule team meeting"
            />
          </div>
          <div>
            <label htmlFor="task-modal-description" style={labelStyle}>Description:</label>
            <textarea
              id="task-modal-description" value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Add more details, notes, or context..."
            />
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '18px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="task-modal-startdate" style={labelStyle}>Start Date:</label>
              <div style={datePickerWrapperStyle}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  isClearable
                  placeholderText="Optional"
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker-input"
                  wrapperClassName="date-picker-wrapper"
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="task-modal-enddate" style={labelStyle}>End Date:</label>
               <div style={datePickerWrapperStyle}>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  isClearable
                  placeholderText="Optional"
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker-input"
                  wrapperClassName="date-picker-wrapper"
                />
              </div>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Card Color:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                {PREDEFINED_COLORS.map(c => (
                    <div key={c} onClick={() => setColor(c)}
                         style={{ width: '32px', height: '32px', backgroundColor: c, borderRadius: '50%', cursor: 'pointer', border: c === color ? `3px solid #007bff` : `3px solid ${c === '#E0E0E0' ? '#ccc' : 'transparent'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'border-color 0.2s ease' }}
                         title={c}
                    />
                ))}
            </div>
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Or enter hex #RRGGBB" style={{...inputStyle, textAlign: 'center', fontSize: '0.9em'}}/>
          </div>

          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white' }}>
              Cancel
            </button>
            <button type="submit" style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}>
              {taskToEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
