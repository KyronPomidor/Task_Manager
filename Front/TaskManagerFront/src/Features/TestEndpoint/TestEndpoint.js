import React, { useState } from 'react';

export const TestEndpoint = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5053/api/tasks');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch task by ID
  const fetchTaskById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5053/api/tasks/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      setSelectedTask(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Task API Tester</h1>
      <button onClick={fetchTasks}>Load Tasks</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Cards for task IDs */}
      {tasks.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => fetchTaskById(task.id)}
              style={{
                cursor: 'pointer',
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                minWidth: '200px',
                textAlign: 'center',
                background: '#f9f9f9',
                transition: '0.2s',
              }}
            >
              {task.id}
            </div>
          ))}
        </div>
      )}

      {/* Selected task details */}
      {selectedTask && (
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <h2>Task Details</h2>
          <pre style={{ background: '#f0f0f0', padding: '1rem' }}>
            {JSON.stringify(selectedTask, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
