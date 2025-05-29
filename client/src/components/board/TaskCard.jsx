// client/src/components/board/TaskCard.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FaEdit, FaRegCalendarAlt, FaRegFlag } from 'react-icons/fa'; // Ensure react-icons is installed

const TaskCard = ({ task, onEdit, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: { task } // Pass the whole task object for context in DND events
  });

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
        const date = new Date(dateString);
        // Simple check for invalid date; more robust validation might be needed
        if (isNaN(date.getTime())) return null; 
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // e.g., May 30
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return null; // Return null or an error indicator if formatting fails
    }
  };

  const startDateFormatted = formatDate(task.startDate);
  const endDateFormatted = formatDate(task.endDate);
  
  // Determine base color and left border color
  const taskBaseColor = task.color || '#E0E0E0'; // Fallback to light grey if no color
  const leftBorderColor = taskBaseColor === '#E0E0E0' ? '#B0B0B0' : taskBaseColor; // Use a darker grey for default, else task color
  
  // Determine card background color (very light tint or white)
  const cardBackgroundColor = (taskBaseColor === '#E0E0E0' || taskBaseColor === '#ffffff') 
                              ? 'white' 
                              : `${taskBaseColor}25`; // Apply a light tint (e.g., ~15% opacity)

  // Define shadows
  const searchHighlightColor = '#FFC107'; // Bright yellow/gold for highlight
  const baseBoxShadow = '0 1px 3px rgba(0,0,0,0.12)';
  const draggingBoxShadow = '0 6px 12px rgba(0,0,0,0.2)';
  // Highlight shadow: an outer ring effect
  const highlightBoxShadow = `0 0 0 3px ${searchHighlightColor}B3, ${baseBoxShadow}`; // 3px thick ring with transparency (B3 is ~70%) + base shadow

  const cardStyle = {
    transform: CSS.Translate.toString(transform),
    padding: '10px 12px',
    marginBottom: '10px',
    borderLeft: `5px solid ${leftBorderColor}`,
    borderRadius: '5px',
    backgroundColor: cardBackgroundColor,
    boxShadow: task.isHighlighted && !isOverlay 
               ? highlightBoxShadow 
               : (isDragging ? draggingBoxShadow : baseBoxShadow),
    cursor: 'grab',
    opacity: isDragging ? 0.8 : 1,
    minHeight: '60px', // Ensure cards have a minimum height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'box-shadow 0.25s ease-out, background-color 0.2s ease, opacity 0.2s ease, border-left-color 0.2s ease',
    position: 'relative', // For absolute positioning of the edit button
  };

  // Styles for text elements within the card
  const titleStyle = { margin: '0 0 6px 0', fontSize: '1em', fontWeight: '500', color: '#172b4d', wordBreak: 'break-word' };
  const descriptionStyle = { 
    fontSize: '0.8em', color: '#42526e', whiteSpace: 'pre-wrap', 
    marginBottom: '8px', wordBreak: 'break-word', maxHeight: '60px', // Limit description height shown
    overflow: 'hidden', textOverflow: 'ellipsis' 
  };
  const footerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' /* Pushes footer to bottom */};
  const dateInfoStyle = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75em', color: '#5e6c84'};
  
  // Styles for the edit button
  const editButtonStyle = {
    position: 'absolute', top: '6px', right: '6px', background: 'none', border: 'none',
    cursor: 'pointer', color: '#5e6c84', padding: '4px', display: isOverlay ? 'none' : 'flex',
    borderRadius: '3px', opacity: 0.6, // Default opacity, increases on hover
    transition: 'opacity 0.2s ease, background-color 0.2s ease'
  };

  // Inline hover effect for edit button (could be moved to CSS classes)
  const handleEditButtonHover = (e, isHovering) => {
    if (!isOverlay) { // Prevent hover effects on the drag overlay clone
        e.currentTarget.style.opacity = isHovering ? '1' : '0.6';
        e.currentTarget.style.backgroundColor = isHovering ? 'rgba(0,0,0,0.08)' : 'transparent';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{ 
        ...cardStyle, 
        ...(isOverlay ? { // Specific styles when this card is rendered as a DragOverlay
            position: 'fixed', 
            pointerEvents: 'none', // Overlay should not intercept clicks
            zIndex: 1000, 
            backgroundColor: taskBaseColor, // Use base color for overlay for better visibility
            borderLeftColor: leftBorderColor, // Ensure consistent border color
            boxShadow: draggingBoxShadow // Apply dragging shadow to overlay
        } : {}) 
      }}
      {...listeners}
      {...attributes}
      className="task-card" // For potential global CSS targeting
    >
      <div> {/* Main content container */}
        <h4 style={titleStyle}>{task.title}</h4>
        {task.description && <p style={descriptionStyle}>{task.description}</p>}
      </div>
      <div style={footerStyle}> {/* Footer for dates and other icons */}
        <div style={dateInfoStyle}>
            {startDateFormatted && <><FaRegCalendarAlt title={`Start: ${startDateFormatted}`} /> <span style={{marginLeft: '2px'}}>{startDateFormatted}</span></>}
            {(startDateFormatted && endDateFormatted) && <span style={{margin: '0 4px'}}>-</span>}
            {endDateFormatted && (!startDateFormatted ? <><FaRegFlag title={`Due: ${endDateFormatted}`} /> <span style={{marginLeft: '2px'}}>{endDateFormatted}</span></> : <span style={{marginLeft: startDateFormatted ? '0' : '2px'}}>{endDateFormatted}</span>)}
        </div>
        {/* Placeholder for future icons like priority, assignee count etc. */}
      </div>

      {!isOverlay && onEdit && ( // Show edit button only on actual card, not overlay, and if onEdit is provided
        <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }} // Prevent drag from starting on edit click
            style={editButtonStyle} 
            title="Edit Task"
            onMouseEnter={(e) => handleEditButtonHover(e, true)}
            onMouseLeave={(e) => handleEditButtonHover(e, false)}
        >
          <FaEdit size={13} />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
