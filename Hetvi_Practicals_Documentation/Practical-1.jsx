import React, { useState } from 'react';

/**
 * ============================================================================
 * PRACTICAL 1: Build a React application using Functional Components,
 *              JSX and Component Reusability concepts.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

// 1. REUSABLE ATOMIC COMPONENT: ActionButton
export const ActionButton = ({
  children,
  variant = 'solid', // 'solid' | 'gradient' | 'outline' | 'danger'
  size = 'md',       // 'sm' | 'md' | 'lg'
  onClick,
  disabled = false,
  icon = null
}) => {
  const stylesByVariant = {
    solid: { background: '#059669', color: '#ffffff', border: 'none' },
    gradient: { background: 'linear-gradient(135deg, #0d9488 0%, #6366f1 100%)', color: '#ffffff', border: 'none' },
    outline: { background: 'transparent', color: '#0d9488', border: '1.5px solid #0d9488' },
    danger: { background: '#e11d48', color: '#ffffff', border: 'none' }
  };

  const stylesBySize = {
    sm: { padding: '6px 14px', fontSize: '0.85rem' },
    md: { padding: '10px 22px', fontSize: '0.95rem' },
    lg: { padding: '14px 30px', fontSize: '1.05rem' }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...stylesByVariant[variant],
        ...stylesBySize[size],
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'opacity 0.2s'
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// 2. REUSABLE ATOMIC COMPONENT: StatusPill
export const StatusPill = ({ label, level = 'success' }) => {
  const palette = {
    success: { bg: '#d1fae5', text: '#065f46' },
    info: { bg: '#e0e7ff', text: '#3730a3' },
    warning: { bg: '#fef3c7', text: '#92400e' }
  };
  const { bg, text } = palette[level] || palette.success;

  return (
    <span style={{ background: bg, color: text, padding: '4px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 700 }}>
      {label}
    </span>
  );
};

// 3. REUSABLE COMPOSITE COMPONENT: ModuleCard
export const ModuleCard = ({ title, category, hours, rating, description, onEnroll }) => (
  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <StatusPill label={category} level={category === 'Advanced' ? 'info' : 'success'} />
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>⏱️ {hours} hrs</span>
      </div>
      <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.2rem' }}>{title}</h3>
      <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>{description}</p>
      <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '16px' }}>⭐ {rating} / 5.0 Rating</div>
    </div>
    <ActionButton variant="gradient" size="sm" onClick={onEnroll}>
      Enroll in Module &rarr;
    </ActionButton>
  </div>
);

// 4. MAIN APPS COMPONENT
export default function Practical1Hetvi() {
  const [selectedModule, setSelectedModule] = useState(null);

  const modules = [
    { id: 1, title: 'Modern UI Engineering with React', category: 'Core', hours: 24, rating: 4.9, desc: 'Functional component hierarchy, JSX semantics, and composable UI design.' },
    { id: 2, title: 'State & Event Lifecycle Architecture', category: 'Core', hours: 18, rating: 4.8, desc: 'Unidirectional state propagation, hooks orchestration, and synthesized events.' },
    { id: 3, title: 'Full Stack MERN API Integration', category: 'Advanced', hours: 32, rating: 5.0, desc: 'Connecting client interfaces with Express.js microservices and MongoDB database.' }
  ];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '1050px', margin: '0 auto', padding: '28px', color: '#1e293b' }}>
      {/* Navigation Banner */}
      <div style={{ background: 'linear-gradient(135deg, #065f46 0%, #0d9488 100%)', color: '#ffffff', padding: '28px', borderRadius: '16px', marginBottom: '32px' }}>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
          Hetvi Patel • Practical 1
        </span>
        <h1 style={{ margin: '12px 0 6px 0', fontSize: '2rem' }}>Modular Functional Components & Reusability</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Demonstrating Component Decoupling, Props Interfaces, and Reusable Design Systems</p>
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
        {modules.map((m) => (
          <ModuleCard
            key={m.id}
            title={m.title}
            category={m.category}
            hours={m.hours}
            rating={m.rating}
            description={m.desc}
            onEnroll={() => setSelectedModule(m.title)}
          />
        ))}
      </div>

      {/* Selection Feedback */}
      {selectedModule && (
        <div style={{ marginTop: '24px', padding: '16px', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '10px', color: '#065f46', textAlign: 'center' }}>
          🎉 Successfully Enrolled: <strong>{selectedModule}</strong>
        </div>
      )}
    </div>
  );
}
