// client/src/components/board/Column.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { FaPlus } from 'react-icons/fa'; // Ensure react-icons is installed

const Column = ({ id, title, tasks, onOpenTaskModal }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const columnStyle = {
    backgroundColor: isOver ? 'rgba(0,0,0,0.05)' : '#f4f5f7', // Lighter background, subtle hover
    padding: '10px 12px', // Reduced padding slightly
    borderRadius: '8px',
    minHeight: '400px', // Increased minHeight
    width: '340px', // Slightly wider
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', // Spacing between title/button and task list
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', // Softer shadow
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px', // Padding for the header section
    marginBottom: '10px', // Space below header before tasks
    // borderBottom: '1px solid #dfe1e6', // Lighter border
  };

  const titleStyle = {
    margin: '0', // Reset margin
    fontSize: '1.1em', // Slightly smaller title
    fontWeight: '600', // Bolder
    color: '#172b4d', // Darker text
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const addButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#5e6c84', // Icon color
    cursor: 'pointer',
    padding: '5px', // Make it compact
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
   const addButtonStyleHover = { // For inline hover (or use CSS classes)
    // backgroundColor: '#e9ecef'
  };


  const taskListStyle = {
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '4px', // Space for scrollbar if it appears
    minHeight: '50px', // Ensure some space even if empty for aesthetics
    // Scrollbar Hiding
    scrollbarWidth: 'thin', /* Firefox: "auto" or "thin" */
    scrollbarColor: '#c1c1c1 #f4f5f7', /* scroll thumb and track */
    // For WebKit (Chrome, Safari, Edge)
    // '&::-webkit-scrollbar': { width: '8px' },
    // '&::-webkit-scrollbar-track': { background: '#f4f5f7' },
    // '&::-webkit-scrollbar-thumb': { backgroundColor: '#c1c1c1', borderRadius: '4px' },
    // '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#a8a8a8' },
  };
  // To apply WebKit scrollbar styles, you'd use CSS classes or styled-components.
  // E.g. in index.css:
  // .task-list-scrollable::-webkit-scrollbar { width: 8px; }
  // .task-list-scrollable::-webkit-scrollbar-track { background: #f4f5f7; }
  // .task-list-scrollable::-webkit-scrollbar-thumb { background-color: #c1c1c1; border-radius: 4px; }
  // .task-list-scrollable::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
  // Then add className="task-list-scrollable" to the div below.

  return (
    <div ref={setNodeRef} style={columnStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>{title} ({tasks ? tasks.length : 0})</h3>
        {id === 'todo' && (
          <button
            style={addButtonStyle}
            onClick={() => onOpenTaskModal(null)} // Pass null for a new task
            title="Add New Task"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dfe1e6'} // Simple inline hover
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FaPlus size={14} />
          </button>
        )}
      </div>
      <div style={taskListStyle} className="task-list-scrollable"> {/* Added class for WebKit scrollbar styling if needed */}
        {tasks && tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task} // task object now contains isHighlighted
              onEdit={() => onOpenTaskModal(task)} // Pass task for editing
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#6b778c', marginTop: '20px', fontSize: '0.9em' }}>
            {id === 'todo' ? 'Click "+" to add a task!' : 'No tasks in this stage.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Column;
