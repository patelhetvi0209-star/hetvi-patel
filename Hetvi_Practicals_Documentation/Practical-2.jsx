import React, { useState } from 'react';

/**
 * ============================================================================
 * PRACTICAL 2: Develop a React application implementing Props,
 *              State Management and Event Handling.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

// 1. CHILD CONTROLLER: Multi-Step Counter (Props + Callback)
export const ValueController = ({ step = 2, onValueChange }) => {
  const [val, setVal] = useState(10);

  const handleUpdate = (amount) => {
    const next = val + amount;
    setVal(next);
    onValueChange(next);
  };

  const handleReset = () => {
    setVal(10);
    onValueChange(10);
  };

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#94a3b8' }}>Dynamic Counter (Step Size: ±{step})</h3>
      <h1 style={{ fontSize: '3rem', margin: '12px 0', color: '#38bdf8' }}>{val}</h1>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button onClick={() => handleUpdate(-step)} style={{ padding: '8px 18px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
          - Subtract {step}
        </button>
        <button onClick={handleReset} style={{ padding: '8px 18px', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
          Reset (10)
        </button>
        <button onClick={() => handleUpdate(step)} style={{ padding: '8px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
          + Add {step}
        </button>
      </div>
    </div>
  );
};

// 2. CHILD COMPONENT: Milestone Manager (Form Events & Lifting State)
export const MilestoneManager = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Setup React Router Context', priority: 'High', done: true },
    { id: 2, name: 'Integrate Axios REST Endpoints', priority: 'Medium', done: false }
  ]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newItem = { id: Date.now(), name: title.trim(), priority, done: false };
    setItems([newItem, ...items]);
    setTitle('');
  };

  const toggleStatus = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const removeMilestone = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Sprint Milestone Tracker (Synthetic Events)</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New milestone..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 2, minWidth: '220px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit" style={{ padding: '10px 22px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Add Milestone
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((m) => (
          <li
            key={m.id}
            style={{
              padding: '12px 16px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => toggleStatus(m.id)}>
              <span>{m.done ? '✅' : '⭕'}</span>
              <span style={{ textDecoration: m.done ? 'line-through' : 'none', color: m.done ? '#94a3b8' : '#0f172a', fontWeight: 600 }}>
                {m.name}
              </span>
              <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '10px' }}>
                {m.priority}
              </span>
            </div>
            <button onClick={() => removeMilestone(m.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 3. MAIN COMPONENT
export default function Practical2Hetvi() {
  const [parentObserver, setParentObserver] = useState(10);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '28px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#0f172a', margin: '0 0 8px 0' }}>Props, State Lifting & Event Architecture</h2>
        <p style={{ color: '#64748b', margin: 0 }}>Hetvi Patel • Practical Lab Record</p>
      </div>

      <ValueController step={4} onValueChange={setParentObserver} />
      <div style={{ textAlign: 'center', marginTop: '14px', color: '#475569', fontSize: '0.95rem' }}>
        Parent Component State Synced: <strong>{parentObserver}</strong>
      </div>

      <MilestoneManager />
    </div>
  );
}
