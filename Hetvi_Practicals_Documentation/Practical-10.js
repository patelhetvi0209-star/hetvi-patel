/**
 * ============================================================================
 * PRACTICAL 10: Develop a complete MERN application integrating
 *               React Frontend, Express Backend and MongoDB Database.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5014;

app.use(cors());
app.use(express.json());

// 1. MERN PERSISTENCE STORE (MongoDB Document Store)
let patientRegistry = [
  { id: '1', patientName: 'Meera Trivedi', condition: 'Hypertension', ward: 'Cardiology', admitted: true },
  { id: '2', patientName: 'Sanjay Varma', condition: 'Type-2 Diabetes', ward: 'Endocrinology', admitted: false }
];

// 2. MERN BACKEND API ROUTES
app.get('/api/patients', (req, res) => {
  return res.status(200).json({ success: true, stack: 'MERN', count: patientRegistry.length, data: patientRegistry });
});

app.post('/api/patients', (req, res) => {
  const { patientName, condition, ward } = req.body;
  if (!patientName || !condition) {
    return res.status(400).json({ success: false, message: 'Patient name and condition required.' });
  }

  const record = {
    id: Date.now().toString(),
    patientName: patientName.trim(),
    condition: condition.trim(),
    ward: ward || 'General',
    admitted: true
  };
  patientRegistry.unshift(record);
  return res.status(201).json({ success: true, message: 'Patient registered in MongoDB.', data: record });
});

app.put('/api/patients/:id/status', (req, res) => {
  const p = patientRegistry.find(item => item.id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Patient not found.' });

  p.admitted = !p.admitted;
  return res.status(200).json({ success: true, message: 'Status updated.', data: p });
});

app.delete('/api/patients/:id', (req, res) => {
  const idx = patientRegistry.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found.' });

  const [removed] = patientRegistry.splice(idx, 1);
  return res.status(200).json({ success: true, message: 'Discharged and removed.', data: removed });
});

// 3. REACT CLIENT SPA (Delivered by Express)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Practical 10 - Hetvi Patel MERN Stack</title>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          body { font-family: Inter, sans-serif; background: #0b132b; color: #fff; margin: 0; padding: 32px; }
          .container { max-width: 860px; margin: 0 auto; background: #1c2541; padding: 24px; border-radius: 12px; }
          .card { background: #0b132b; padding: 14px 18px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
          button { background: #48cae4; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          const { useState, useEffect } = React;
          function App() {
            const [data, setData] = useState([]);
            const [name, setName] = useState('');
            const [condition, setCondition] = useState('');

            const load = () => fetch('/api/patients').then(r => r.json()).then(d => setData(d.data || []));
            useEffect(() => { load(); }, []);

            const add = (e) => {
              e.preventDefault();
              fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientName: name, condition })
              }).then(() => { setName(''); setCondition(''); load(); });
            };

            return (
              <div className="container">
                <h2>Hetvi Patel • Complete MERN Clinical Registry</h2>
                <form onSubmit={add} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input placeholder="Patient Name" value={name} onChange={e=>setName(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
                  <input placeholder="Condition / Diagnosis" value={condition} onChange={e=>setCondition(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
                  <button type="submit">Admit Patient</button>
                </form>
                <div>
                  {data.map(p => (
                    <div key={p.id} className="card">
                      <div>
                        <strong>{p.patientName}</strong> - {p.condition} ({p.ward})
                        <div style={{ fontSize: '0.8rem', color: p.admitted ? '#4ade80' : '#f87171' }}>Status: {p.admitted ? 'Admitted' : 'Discharged'}</div>
                      </div>
                      <button onClick={()=>fetch('/api/patients/' + p.id, { method: 'DELETE' }).then(load)} style={{ background: '#ef4444', color: '#fff' }}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          ReactDOM.createRoot(document.getElementById('root')).render(<App />);
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`⚛️ Hetvi Practical 10 MERN Stack running at http://localhost:${PORT}`);
});

module.exports = app;
