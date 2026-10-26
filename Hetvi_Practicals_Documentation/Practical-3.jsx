import React, { useState } from 'react';

/**
 * ============================================================================
 * PRACTICAL 3: Create a Student Management System using React Forms,
 *              Controlled Components and Validation.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

export default function Practical3Hetvi() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Hetvi Patel', rollNo: 'MSCS-2025-01', email: 'hetvi.patel@univ.edu', branch: 'AI & Data Science', score: '9.6' },
    { id: 2, name: 'Kavya Desai', rollNo: 'MSCS-2025-02', email: 'kavya.desai@univ.edu', branch: 'Cloud Computing', score: '9.1' }
  ]);

  const [form, setForm] = useState({
    name: '',
    rollNo: '',
    email: '',
    branch: 'AI & Data Science',
    score: ''
  });

  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Controlled Validation Rules
  const validateForm = () => {
    const err = {};
    if (!form.name.trim() || form.name.length < 3) {
      err.name = 'Full name must contain at least 3 characters.';
    }
    if (!form.rollNo.trim()) {
      err.rollNo = 'Institutional Roll ID is required.';
    } else if (students.some(s => s.rollNo.toUpperCase() === form.rollNo.trim().toUpperCase())) {
      err.rollNo = 'Roll ID already exists in repository.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      err.email = 'Please provide a valid educational email address.';
    }
    const numScore = parseFloat(form.score);
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      err.score = 'Cumulative score must be between 0.0 and 10.0.';
    }
    return err;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const newStudent = {
      id: Date.now(),
      name: form.name.trim(),
      rollNo: form.rollNo.trim().toUpperCase(),
      email: form.email.trim().toLowerCase(),
      branch: form.branch,
      score: parseFloat(form.score).toFixed(2)
    };
    setStudents([newStudent, ...students]);
    setForm({ name: '', rollNo: '', email: '', branch: 'AI & Data Science', score: '' });
    setErrors({});
  };

  const handleDelete = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const filteredRecords = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '28px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#0f172a', margin: '0 0 6px 0' }}>Academic Student Registry & Controlled Validation</h2>
        <p style={{ color: '#64748b', margin: 0 }}>Hetvi Patel • Practical 3 Controlled Components</p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', color: '#1e293b' }}>Enroll New Student</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Student Name</label>
            <input name="name" value={form.name} onChange={handleInputChange} placeholder="e.g. Hetvi Patel" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            {errors.name && <span style={{ color: '#e11d48', fontSize: '0.75rem' }}>{errors.name}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Roll ID</label>
            <input name="rollNo" value={form.rollNo} onChange={handleInputChange} placeholder="e.g. MSCS-2025-03" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            {errors.rollNo && <span style={{ color: '#e11d48', fontSize: '0.75rem' }}>{errors.rollNo}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email</label>
            <input name="email" value={form.email} onChange={handleInputChange} placeholder="student@univ.edu" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            {errors.email && <span style={{ color: '#e11d48', fontSize: '0.75rem' }}>{errors.email}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Specialization</label>
            <select name="branch" value={form.branch} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', boxSizing: 'border-box' }}>
              <option>AI & Data Science</option>
              <option>Cloud Computing</option>
              <option>Cybersecurity & Forensics</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>GPA Score (0-10)</label>
            <input name="score" value={form.score} onChange={handleInputChange} placeholder="e.g. 9.4" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            {errors.score && <span style={{ color: '#e11d48', fontSize: '0.75rem' }}>{errors.score}</span>}
          </div>
        </div>
        <button type="submit" style={{ marginTop: '18px', padding: '10px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Submit Registration
        </button>
      </form>

      {/* Directory & Search */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Search student directory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '320px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
        />
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Enrolled: <strong>{students.length}</strong></span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <thead>
          <tr style={{ background: '#0f172a', color: '#fff', fontSize: '0.85rem' }}>
            <th style={{ padding: '12px' }}>Roll ID</th>
            <th style={{ padding: '12px' }}>Student Name</th>
            <th style={{ padding: '12px' }}>Specialization</th>
            <th style={{ padding: '12px' }}>GPA</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
              <td style={{ padding: '12px', fontWeight: 700, color: '#0d9488' }}>{s.rollNo}</td>
              <td style={{ padding: '12px' }}>{s.name}</td>
              <td style={{ padding: '12px' }}>{s.branch}</td>
              <td style={{ padding: '12px', fontWeight: 700 }}>{s.score}</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => handleDelete(s.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
