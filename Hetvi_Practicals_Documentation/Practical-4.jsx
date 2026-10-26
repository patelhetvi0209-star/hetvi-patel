import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useParams, useNavigate } from 'react-router-dom';

/**
 * ============================================================================
 * PRACTICAL 4: Develop a Single Page Application (SPA) using React Router
 *              for navigation between multiple pages.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

// 1. PAGE VIEWS
const DashboardView = () => (
  <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px' }}>
    <h2 style={{ color: '#0f172a' }}>🏥 Clinical Research & Health Informatics Portal</h2>
    <p style={{ color: '#64748b', lineHeight: 1.6 }}>
      This Single Page Application demonstrates client-side routing via React Router without triggering full server document refreshes.
    </p>
  </div>
);

const ResearchUnits = () => {
  const units = [
    { id: 'genomics', title: 'Computational Genomics & Bioinformatics', leads: 'Dr. Hetvi Patel' },
    { id: 'neuro-ai', title: 'Neural Systems & Cognitive AI', leads: 'Dr. S. Mehta' },
    { id: 'cloud-health', title: 'Cloud Infrastructure for Patient Telemetry', leads: 'Prof. A. Rao' }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: '#0f172a' }}>🔬 Departmental Research Units</h2>
      <div style={{ display: 'grid', gap: '14px', marginTop: '16px' }}>
        {units.map((u) => (
          <div key={u.id} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '18px', borderRadius: '10px' }}>
            <h4 style={{ margin: '0 0 6px 0', color: '#0d9488' }}>{u.title}</h4>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#64748b' }}>Unit Lead: {u.leads}</p>
            <Link to={`/units/${u.id}`} style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              Inspect Unit Specs &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const UnitDetail = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
      <span style={{ background: '#059669', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
        Active Dynamic Route
      </span>
      <h2 style={{ color: '#065f46', margin: '10px 0' }}>Unit Identifier: {unitId.toUpperCase()}</h2>
      <p style={{ color: '#047857' }}>
        Dynamic parameter extracted successfully via React Router's <code>useParams()</code> hook.
      </p>
      <button onClick={() => navigate('/units')} style={{ padding: '8px 18px', background: '#065f46', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
        &larr; Return to Units
      </button>
    </div>
  );
};

const Fallback404 = () => (
  <div style={{ padding: '32px', textAlign: 'center', color: '#e11d48' }}>
    <h1>404 - View Not Found</h1>
    <p>Wildcard route (*) intercepted undefined endpoint request.</p>
  </div>
);

// 2. ROOT SPA ROUTER
export default function Practical4Hetvi() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Navigation Bar */}
        <nav style={{ display: 'flex', gap: '16px', background: '#0f172a', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px' }}>
          <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#cbd5e1', textDecoration: 'none', fontWeight: 600 })}>
            Dashboard
          </NavLink>
          <NavLink to="/units" style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#cbd5e1', textDecoration: 'none', fontWeight: 600 })}>
            Research Units
          </NavLink>
        </nav>

        {/* Route Handlers */}
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/units" element={<ResearchUnits />} />
          <Route path="/units/:unitId" element={<UnitDetail />} />
          <Route path="*" element={<Fallback404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
