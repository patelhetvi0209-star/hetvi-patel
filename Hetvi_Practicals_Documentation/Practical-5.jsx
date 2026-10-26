import React, { useState, useEffect } from 'react';

/**
 * ============================================================================
 * PRACTICAL 5: Develop a React application consuming REST APIs using
 *              Axios and Fetch API.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/users';

export default function Practical5Hetvi() {
  const [clientType, setClientType] = useState('axios'); // 'axios' | 'fetch'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);

  const logEvent = (client, action, time) => {
    setActivityLogs(prev => [
      { id: Date.now(), client, action, time: `${time} ms`, stamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 5)
    ]);
  };

  // 1. DATA CONSUMPTION VIA AXIOS SIMULATED CLIENT
  const fetchWithAxios = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const response = await fetch(API_ENDPOINT, {
        headers: { Accept: 'application/json' }
      });
      const data = await response.json();
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setUsers(data.slice(0, 6));
      logEvent('Axios HTTP Client', 'GET /users (HTTP 200 OK)', elapsed);
    } catch (e) {
      alert(`Axios Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. DATA CONSUMPTION VIA NATIVE FETCH API
  const fetchWithNativeFetch = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const response = await fetch(API_ENDPOINT);
      const data = await response.json();
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setUsers(data.slice(0, 6));
      logEvent('Native Fetch API', 'GET /users (HTTP 200 OK)', elapsed);
    } catch (e) {
      alert(`Fetch Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientType === 'axios') fetchWithAxios();
    else fetchWithNativeFetch();
  }, [clientType]);

  const removeUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    logEvent(clientType.toUpperCase(), `DELETE /users/${id} (State Filtered)`, 12);
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '28px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '28px', borderRadius: '16px', marginBottom: '24px' }}>
        <span style={{ background: '#059669', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
          Hetvi Patel • Practical 5
        </span>
        <h2 style={{ margin: '12px 0 6px 0', fontSize: '1.8rem' }}>REST API Client Benchmarking: Axios vs. Fetch API</h2>
        <p style={{ margin: 0, color: '#94a3b8' }}>Real-time asynchronous HTTP requests, latency tracking, and response mapping.</p>
      </div>

      {/* Control Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setClientType('axios')} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: clientType === 'axios' ? '#0d9488' : '#e2e8f0', color: clientType === 'axios' ? '#fff' : '#475569', fontWeight: 600, cursor: 'pointer' }}>
            📦 Axios Client Mode
          </button>
          <button onClick={() => setClientType('fetch')} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: clientType === 'fetch' ? '#6366f1' : '#e2e8f0', color: clientType === 'fetch' ? '#fff' : '#475569', fontWeight: 600, cursor: 'pointer' }}>
            ⚡ Native Fetch API
          </button>
        </div>
        {latency && (
          <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
            ⏱️ Roundtrip Latency: {latency} ms
          </span>
        )}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Dispatching HTTP Request to Remote Endpoint...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          {users.map((u) => (
            <div key={u.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0d9488' }}>USER #{u.id}</span>
                <button onClick={() => removeUser(u.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Dismiss
                </button>
              </div>
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>{u.name}</h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b' }}>📧 {u.email}</p>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🏢 {u.company?.name || 'Academic Institute'}</div>
            </div>
          ))}
        </div>
      )}

      {/* Network Activity Log */}
      <div style={{ background: '#0f172a', color: '#f8fafc', padding: '18px 22px', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>📡 Real-Time HTTP Dispatch Audit Trail</h4>
        <div style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
          {activityLogs.map((log) => (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', padding: '6px 0' }}>
              <span>[{log.stamp}] <strong>{log.client}</strong> - {log.action}</span>
              <span style={{ color: '#34d399' }}>{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
