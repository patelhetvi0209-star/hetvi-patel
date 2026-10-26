/**
 * ============================================================================
 * PRACTICAL 7: Build RESTful APIs for Student Records Management
 *              using Express.js and Postman testing.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5011;

app.use(cors());
app.use(express.json());

// 1. DATA REPOSITORY: Enrolled Student Records
let studentRegistry = [
  { id: 1, rollNumber: 'HP202501', fullName: 'Hetvi Patel', department: 'Computer Science', gpa: 9.6, active: true },
  { id: 2, rollNumber: 'HP202502', fullName: 'Rhea Shah', department: 'Information Technology', gpa: 9.2, active: true },
  { id: 3, rollNumber: 'HP202503', fullName: 'Tanvi Joshi', department: 'Computer Science', gpa: 8.9, active: true }
];
let nextStudentSeq = 4;

// 2. RESTFUL ROUTER (/api/v1/students)
const router = express.Router();

// Analytics Endpoint
router.get('/metrics/overview', (req, res) => {
  const count = studentRegistry.length;
  const avgGpa = (studentRegistry.reduce((acc, s) => acc + s.gpa, 0) / (count || 1)).toFixed(2);
  return res.status(200).json({
    success: true,
    totalRecords: count,
    averageGpa: parseFloat(avgGpa)
  });
});

// GET: Filtered & Paginated Collection
router.get('/', (req, res) => {
  let records = [...studentRegistry];
  const { department, minGpa, search } = req.query;

  if (department) {
    records = records.filter(s => s.department.toLowerCase() === department.toLowerCase());
  }
  if (minGpa) {
    records = records.filter(s => s.gpa >= parseFloat(minGpa));
  }
  if (search) {
    const q = search.toLowerCase();
    records = records.filter(s => s.fullName.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q));
  }

  return res.status(200).json({ success: true, count: records.length, data: records });
});

// GET: By ID
router.get('/:id', (req, res) => {
  const sid = parseInt(req.params.id, 10);
  const found = studentRegistry.find(s => s.id === sid);
  if (!found) return res.status(404).json({ success: false, message: `Student ID ${sid} not found.` });
  return res.status(200).json({ success: true, data: found });
});

// GET: By Roll Number
router.get('/roll/:rollNo', (req, res) => {
  const roll = req.params.rollNo.toUpperCase();
  const found = studentRegistry.find(s => s.rollNumber.toUpperCase() === roll);
  if (!found) return res.status(404).json({ success: false, message: `Student with roll ${roll} not found.` });
  return res.status(200).json({ success: true, data: found });
});

// POST: Register Record with Conflict Validation
router.post('/', (req, res) => {
  const { rollNumber, fullName, department, gpa } = req.body;

  if (!rollNumber || !fullName || !department) {
    return res.status(400).json({ success: false, message: 'rollNumber, fullName, and department are mandatory.' });
  }

  // Conflict Check
  if (studentRegistry.some(s => s.rollNumber.toUpperCase() === rollNumber.trim().toUpperCase())) {
    return res.status(409).json({ success: false, message: `Conflict: Roll number "${rollNumber}" already registered.` });
  }

  const newEntry = {
    id: nextStudentSeq++,
    rollNumber: rollNumber.trim().toUpperCase(),
    fullName: fullName.trim(),
    department: department.trim(),
    gpa: parseFloat(gpa) || 8.5,
    active: true
  };

  studentRegistry.push(newEntry);
  return res.status(201).json({ success: true, message: 'Student registered successfully.', data: newEntry });
});

// PUT: Update Record
router.put('/:id', (req, res) => {
  const sid = parseInt(req.params.id, 10);
  const idx = studentRegistry.findIndex(s => s.id === sid);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: `Cannot update: Student ID ${sid} does not exist.` });
  }

  studentRegistry[idx] = { ...studentRegistry[idx], ...req.body };
  return res.status(200).json({ success: true, message: 'Record updated successfully.', data: studentRegistry[idx] });
});

// DELETE: Remove Record
router.delete('/:id', (req, res) => {
  const sid = parseInt(req.params.id, 10);
  const idx = studentRegistry.findIndex(s => s.id === sid);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: `Cannot delete: Student ID ${sid} not found.` });
  }

  const [deleted] = studentRegistry.splice(idx, 1);
  return res.status(200).json({ success: true, message: `Student "${deleted.fullName}" removed.`, data: deleted });
});

app.use('/api/v1/students', router);

app.listen(PORT, () => {
  console.log(`🎓 Hetvi Practical 7 Student REST API running at http://localhost:${PORT}`);
});

module.exports = app;
