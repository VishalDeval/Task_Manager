// client/src/components/board/CreateTaskForm.jsx
import React, { useState } from 'react';
import { createTask as createTaskService } from '../../services/taskService';

const CreateTaskForm = ({ onTaskCreated }) => { // onTaskCreated is the callback from BoardPage
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const newTaskData = { title: title.trim() };
      if (description.trim()) {
        newTaskData.description = description.trim();
      }
      // Backend will assign status 'todo' and userId
      const response = await createTaskService(newTaskData);
      onTaskCreated(response.data); // Pass the newly created task object
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task. Please try again later.');
      console.error("Create task error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    maxWidth: '600px',
    margin: '0 auto 30px auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  };
  const inputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' };
  const buttonStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1em' };
  const errorStyle = { color: 'red', fontSize: '0.9em', marginBottom: '10px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' };


  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Add New Task</h3>
      {error && <p style={errorStyle}>{error}</p>}
      <div>
        <label htmlFor="task-title" style={labelStyle}>Title:</label>
        <input
          type="text"
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="task-description" style={labelStyle}>Description (Optional):</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows="3"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>
      <button type="submit" disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.7 : 1, width: '100%' }}>
        {loading ? 'Adding Task...' : 'Add Task'}
      </button>
    </form>
  );
};

export default CreateTaskForm;
