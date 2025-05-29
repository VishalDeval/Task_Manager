// client/src/components/board/Board.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';

import Column from './Column';
import TaskCard from './TaskCard';
import ActionBin from './ActionBin'; // For both drag-to-delete and click-to-clear-done
import ConfirmDeleteModal from './ConfirmDeleteModal'; // For single task delete confirmation
import ConfirmClearDoneModal from './ConfirmClearDoneModal'; // For clearing all 'Done' tasks
import TaskModal from './TaskModal'; // For creating/editing tasks
import {
  getTasks as getTasksService,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService, // For single task deletion
  clearAllDoneTasks as clearAllDoneTasksService // For clearing all 'Done' tasks
} from '../../services/taskService';
import useAuth from '../../hooks/useAuth';

const COLUMN_IDS = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress',
  DONE: 'done',
};

const COLUMN_TITLES = {
  [COLUMN_IDS.TODO]: 'To Do',
  [COLUMN_IDS.IN_PROGRESS]: 'In Progress',
  [COLUMN_IDS.DONE]: 'Done',
};

// Define a constant for the ActionBin's droppable ID to ensure consistency
const ACTION_BIN_DROPPABLE_ID = 'action-bin-droppable-zone';

const Board = ({ searchTerm }) => {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null); // For DragOverlay visual
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(''); // For displaying general API errors
  const { user, isAuthenticated } = useAuth();

  // State for single task deletion confirmation modal (triggered by drag-to-bin)
  const [isDeleteSingleTaskModalOpen, setIsDeleteSingleTaskModalOpen] = useState(false);
  const [taskToDeleteSingle, setTaskToDeleteSingle] = useState(null);

  // State for Task Create/Edit Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskModalError, setTaskModalError] = useState('');

  // State for Clear All 'Done' Tasks Confirmation Modal (triggered by ActionBin click)
  const [isClearDoneModalOpen, setIsClearDoneModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  // Fetching tasks
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      const response = await getTasksService();
      setTasks(response.data || []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setApiError(err.response?.data?.message || 'Failed to fetch tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Processing tasks for search highlighting
  const processedTasks = useMemo(() => {
    if (!tasks) return [];
    if (!searchTerm || searchTerm.trim() === '') {
      return tasks.map(task => ({ ...task, isHighlighted: false }));
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return tasks.map(task => {
      const match = task.title.toLowerCase().includes(lowerSearchTerm) ||
                    (task.description && task.description.toLowerCase().includes(lowerSearchTerm));
      return { ...task, isHighlighted: match };
    });
  }, [tasks, searchTerm]);

  // Categorizing tasks into columns
  const tasksByColumn = useMemo(() => {
    const categorized = {
      [COLUMN_IDS.TODO]: [],
      [COLUMN_IDS.IN_PROGRESS]: [],
      [COLUMN_IDS.DONE]: [],
    };
    (processedTasks || []).forEach(task => {
      if (categorized[task.status]) {
        categorized[task.status].push(task);
      } else {
        console.warn(`Task ${task._id} with status "${task.status}" could not be categorized. Placing in 'To Do'.`);
        categorized[COLUMN_IDS.TODO].push({ ...task, status: COLUMN_IDS.TODO });
      }
    });
    return categorized;
  }, [processedTasks]);

  // --- Task Create/Edit Modal Handling ---
  const handleOpenTaskModal = (task = null) => {
    setEditingTask(task);
    setTaskModalError('');
    setIsTaskModalOpen(true);
  };
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setTaskModalError('');
  };
  const handleSaveTask = async (taskDataFromModal) => {
    setTaskModalError('');
    try {
      if (taskDataFromModal._id) { // Editing
        const response = await updateTaskService(taskDataFromModal._id, taskDataFromModal);
        setTasks(prevTasks => prevTasks.map(t => t._id === response.data._id ? response.data : t));
      } else { // Creating
        const response = await createTaskService(taskDataFromModal);
        setTasks(prevTasks => [response.data, ...prevTasks]);
      }
      handleCloseTaskModal();
    } catch (err) {
      console.error("Save task error:", err);
      setTaskModalError(err.response?.data?.message || "Failed to save task.");
    }
  };

  // --- Single Task Delete Confirmation (triggered by drag-to-bin) ---
  const requestDeleteSingleTaskConfirmation = (task) => {
    setTaskToDeleteSingle(task);
    setIsDeleteSingleTaskModalOpen(true);
  };
  const confirmDeleteSingleTask = async () => {
    if (!taskToDeleteSingle) return;
    const taskId = taskToDeleteSingle._id;
    setTasks(prev => (prev || []).filter(task => task._id !== taskId)); // Optimistic UI
    setIsDeleteSingleTaskModalOpen(false);
    setTaskToDeleteSingle(null);
    try {
      await deleteTaskService(taskId); // API call
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to delete task.");
      fetchTasks(); // Rollback by refetching
    }
  };

  // --- Clear All 'Done' Tasks Handling (triggered by ActionBin click) ---
  const handleClearDoneTasksButtonClick = () => {
    const doneTasksCount = (tasksByColumn[COLUMN_IDS.DONE] || []).length;
    if (doneTasksCount > 0) {
        setIsClearDoneModalOpen(true);
    } else {
        alert("There are no tasks in the 'Done' column to clear.");
    }
  };
  const confirmClearAllDoneTasks = async () => {
    setIsClearDoneModalOpen(false);
    const tasksToKeep = tasks.filter(task => task.status !== COLUMN_IDS.DONE);
    setTasks(tasksToKeep); // Optimistic UI
    try {
      const response = await clearAllDoneTasksService();
      console.log(response.data.message); // Or show success toast
      // Optionally fetchTasks() if deletedCount from response doesn't match expectation
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to clear 'Done' tasks.");
      fetchTasks(); // Rollback on error
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };
  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over || !active) return;
    
    // If dropped on itself (no actual move to a different droppable area)
    // Check specifically if it's not the action bin to allow dropping ON the bin even if active.id === over.id conceptually
    if (active.id === over.id && over.id !== ACTION_BIN_DROPPABLE_ID) return;

    const taskId = active.id;
    const targetId = over.id; // ID of the droppable area (column or action-bin)
    const originalTask = tasks.find(t => t._id === taskId);
    if (!originalTask) return;

    // Scenario 1: Task dropped onto the ActionBin for single task deletion
    if (targetId === ACTION_BIN_DROPPABLE_ID) {
      requestDeleteSingleTaskConfirmation(originalTask);
    } 
    // Scenario 2: Task dropped onto a valid column for status change
    else if (COLUMN_IDS[Object.keys(COLUMN_IDS).find(key => COLUMN_IDS[key] === targetId)]) {
      const newStatus = targetId;
      const originalStatus = originalTask.status;
      if (originalStatus === newStatus) return; // No status change

      setTasks(prevTasks => prevTasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )); // Optimistic UI
      try {
        await updateTaskService(taskId, { status: newStatus });
      } catch (err) {
        setApiError(err.response?.data?.message || "Failed to update task status.");
        fetchTasks(); // Rollback
      }
    }
  };
  
  // --- Render Logic ---
  if (loading && !tasks.length) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#555' }}>Loading your tasks...</div>;
  
  const generalErrorDisplay = apiError && !isTaskModalOpen && !isDeleteSingleTaskModalOpen && !isClearDoneModalOpen ? 
    <div style={{ color: 'red', textAlign: 'center', padding: '10px', background: '#ffeef0', border: '1px solid #ffcdd2', marginBottom: '15px', borderRadius: '4px', fontSize: '0.9em' }}>
      {apiError}
    </div> : null;

  if (!isAuthenticated && !loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.1em' }}>Please log in to manage your tasks.</div>;

  const boardContainerStyle = { display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 10px 20px 10px', flexWrap: 'wrap' };
  const doneTasksCount = (tasksByColumn[COLUMN_IDS.DONE] || []).length;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {generalErrorDisplay}
        <div style={boardContainerStyle}>
          {Object.values(COLUMN_IDS).map(columnId => (
            <Column
              key={columnId}
              id={columnId} // This ID is what 'over.id' will be for columns
              title={COLUMN_TITLES[columnId]}
              tasks={tasksByColumn[columnId] || []}
              onOpenTaskModal={handleOpenTaskModal}
            />
          ))}
        </div>
        
        {/* ActionBin is inside DndContext to be a droppable target for single tasks */}
        <ActionBin 
            onClickClearDone={handleClearDoneTasksButtonClick} 
            droppableId={ACTION_BIN_DROPPABLE_ID} // Pass the defined droppable ID
        />

        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCard task={activeTask} isOverlay={true} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Modal for confirming SINGLE task deletion (triggered by drag-to-bin) */}
      <ConfirmDeleteModal
        isOpen={isDeleteSingleTaskModalOpen}
        onClose={() => { setIsDeleteSingleTaskModalOpen(false); setTaskToDeleteSingle(null); }}
        onConfirm={confirmDeleteSingleTask}
        taskTitle={taskToDeleteSingle ? taskToDeleteSingle.title : ''}
      />

      {/* Modal for confirming clearing ALL 'Done' tasks (triggered by ActionBin click) */}
      <ConfirmClearDoneModal
        isOpen={isClearDoneModalOpen}
        onClose={() => setIsClearDoneModalOpen(false)}
        onConfirm={confirmClearAllDoneTasks}
        doneTasksCount={doneTasksCount}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
        modalError={taskModalError}
      />
    </>
  );
};

export default Board;
