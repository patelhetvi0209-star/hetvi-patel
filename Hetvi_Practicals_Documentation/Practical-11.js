/**
 * ============================================================================
 * PRACTICAL 11: Create a Blog Management System implementing
 *               CRUD Operations, Authentication and Role-Based Access Control.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5015;

app.use(cors());
app.use(express.json());

// 1. REGISTERED USERS & ROLES
const accounts = [
  { id: 1, name: 'Hetvi SuperAdmin', role: 'admin', token: 'hp-admin-key-99' },
  { id: 2, name: 'Ananya Author', role: 'author', token: 'ananya-author-key-44' },
  { id: 3, name: 'Sameer Reviewer', role: 'reader', token: 'sameer-reader-key-11' }
];

let publications = [
  { id: 1, title: 'AI Diagnostics in Modern Oncology', authorId: 2, authorName: 'Ananya Author', summary: 'Neural imaging architectures for micro-lesion analysis.' }
];
let nextPubId = 2;

// 2. AUTH & RBAC MIDDLEWARE
const verifyAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Missing Authorization Token.' });

  const user = accounts.find(a => a.token === token);
  if (!user) return res.status(403).json({ success: false, message: 'Invalid Authentication Token.' });

  req.currentUser = user;
  next();
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.currentUser.role)) {
    return res.status(403).json({
      success: false,
      message: `Forbidden: Role [${req.currentUser.role}] not permitted. Requires [${roles.join(', ')}]`
    });
  }
  next();
};

// 3. ENDPOINTS
app.get('/api/articles', (req, res) => {
  return res.status(200).json({ success: true, count: publications.length, data: publications });
});

// Author & Admin Only
app.post('/api/articles', verifyAuth, restrictTo('author', 'admin'), (req, res) => {
  const { title, summary } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title is mandatory.' });

  const article = { id: nextPubId++, title, authorId: req.currentUser.id, authorName: req.currentUser.name, summary: summary || '' };
  publications.unshift(article);
  return res.status(201).json({ success: true, message: 'Article published.', data: article });
});

// Admin Exclusive Deletion
app.delete('/api/articles/:id', verifyAuth, restrictTo('admin'), (req, res) => {
  const id = parseInt(req.params.id, 10);
  publications = publications.filter(p => p.id !== id);
  return res.status(200).json({ success: true, message: `Article #${id} removed by SuperAdmin.` });
});

app.listen(PORT, () => {
  console.log(`🛡️ Hetvi Practical 11 RBAC Article Server running at http://localhost:${PORT}`);
});

module.exports = app;
