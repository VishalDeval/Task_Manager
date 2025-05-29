// client/src/components/board/ActionBin.jsx (Replaces ClearDoneTasksButton.jsx and original DeleteBin.jsx)
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FaTrashAlt, FaBroom } from 'react-icons/fa'; // Broom for clear all

const ActionBin = ({ onClickClearDone, droppableId = 'delete-bin-droppable' }) => {
  const { setNodeRef, isOver: isOverDrop } = useDroppable({
    id: droppableId, // ID for dnd-kit to recognize it as a drop target for single tasks
  });

  // Styles for the bin
  const binStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '65px', // Adjusted size
    height: '65px',
    borderRadius: '50%',
    backgroundColor: isOverDrop ? '#e53935' : '#c62828', // Red, darkens when task is dragged over
    color: 'white',
    display: 'flex',
    flexDirection: 'column', // To stack icons or text if needed
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px', // Icon size
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    border: isOverDrop ? '3px dashed white' : '3px solid transparent',
    cursor: 'pointer', // Indicates it's clickable
    zIndex: 1000,
    transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease-out',
    outline: 'none',
  };

  // Combined title for both actions
  const title = "Drag task here to delete it OR click to clear all 'Done' tasks.";

  return (
    <div
      ref={setNodeRef} // For dnd-kit droppable functionality
      style={binStyle}
      title={title}
      onClick={onClickClearDone} // Click action for clearing all 'Done' tasks
      // Hover and active effects for click
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
    >
      {/* You can use one icon or switch, for simplicity one icon is fine */}
      <FaTrashAlt size={24}/> 
      {/* <span style={{fontSize: '0.5em', marginTop: '2px'}}>Clear Done</span> */}
    </div>
  );
};

export default ActionBin;
