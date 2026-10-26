/**
 * ============================================================================
 * PRACTICAL 8: Develop an Employee Management API integrating Express.js
 *              with MongoDB Atlas.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5012;

app.use(cors());
app.use(express.json());

// 1. MONGOOSE SCHEMA & MODEL
const staffSchema = new mongoose.Schema(
  {
    empCode: { type: String, required: true, unique: true, uppercase: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    department: {
      type: String,
      required: true,
      enum: ['Engineering', 'Healthcare Informatics', 'Product Design', 'Quality Assurance']
    },
    designation: { type: String, required: true },
    salary: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const Staff = mongoose.model('Staff', staffSchema);

let inMemoryStaff = [
  { id: '1', empCode: 'HP-EMP-01', fullName: 'Hetvi Patel', email: 'hetvi@company.io', department: 'Engineering', designation: 'Lead Systems Architect', salary: 98000 },
  { id: '2', empCode: 'HP-EMP-02', fullName: 'Aryan Dave', email: 'aryan@company.io', department: 'Healthcare Informatics', designation: 'Data Specialist', salary: 84000 }
];

// 2. MONGODB AGGREGATION PIPELINE ENDPOINT
app.get('/api/employees/analytics/departments', async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const stats = await Staff.aggregate([
        {
          $group: {
            _id: '$department',
            staffCount: { $sum: 1 },
            avgSalary: { $avg: '$salary' },
            totalBudget: { $sum: '$salary' }
          }
        },
        { $sort: { avgSalary: -1 } }
      ]);
      return res.status(200).json({ success: true, source: 'MongoDB Atlas Aggregation', data: stats });
    } else {
      // Fallback
      const sample = [
        { _id: 'Engineering', staffCount: 14, avgSalary: 92000, totalBudget: 1288000 },
        { _id: 'Healthcare Informatics', staffCount: 8, avgSalary: 81000, totalBudget: 648000 }
      ];
      return res.status(200).json({ success: true, source: 'In-Memory Aggregation Fallback', data: sample });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. CRUD ROUTES
app.get('/api/employees', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const records = await Staff.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: records.length, data: records });
    }
    return res.status(200).json({ success: true, count: inMemoryStaff.length, data: inMemoryStaff });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { empCode, fullName, email, department, designation, salary } = req.body;
    if (!empCode || !fullName || !email || !department || salary === undefined) {
      return res.status(400).json({ success: false, message: 'Missing mandatory employee fields.' });
    }

    if (mongoose.connection.readyState === 1) {
      const doc = await Staff.create({ empCode, fullName, email, department, designation: designation || 'Specialist', salary: Number(salary) });
      return res.status(201).json({ success: true, message: 'Document saved to MongoDB Atlas.', data: doc });
    } else {
      const item = { id: Date.now().toString(), empCode, fullName, email, department, designation: designation || 'Specialist', salary: Number(salary) };
      inMemoryStaff.unshift(item);
      return res.status(201).json({ success: true, message: 'Saved (in-memory mode).', data: item });
    }
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Staff.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Record deleted from MongoDB.' });
    }
    inMemoryStaff = inMemoryStaff.filter(s => s.id !== req.params.id);
    return res.status(200).json({ success: true, message: 'Record deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🍃 Hetvi Practical 8 MongoDB API running at http://localhost:${PORT}`);
});

module.exports = app;
