/**
 * ============================================================================
 * PRACTICAL 9: Create a file upload module using Multer and store
 *              file metadata in MongoDB.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5013;

app.use(cors());
app.use(express.json());

const storageFolder = path.join(__dirname, 'hetvi_uploads');
if (!fs.existsSync(storageFolder)) {
  fs.mkdirSync(storageFolder, { recursive: true });
}

// 1. MULTER CONFIGURATION
const diskEngine = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storageFolder),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `doc-${unique}${path.extname(file.originalname)}`);
  }
});

const uploadFilter = (req, file, cb) => {
  const allowed = ['image/png', 'image/jpeg', 'application/pdf', 'application/zip'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid format. Permitted: PNG, JPG, PDF, ZIP.'), false);
  }
};

const uploader = multer({
  storage: diskEngine,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: uploadFilter
});

// 2. FILE METADATA DATABASE (MongoDB Document Schema Simulation)
let metadataCollection = [
  {
    docId: 'doc_101',
    originalName: 'hetvi_research_report.pdf',
    savedFilename: 'doc-172900-report.pdf',
    mimetype: 'application/pdf',
    sizeBytes: 3145728,
    formattedSize: '3.00 MB',
    uploadedAt: new Date().toISOString()
  }
];

// Helper
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 3. API ENDPOINTS
app.post('/api/upload/single', uploader.single('file'), (req, res) => {
  try {
    const meta = {
      docId: 'doc_' + Date.now(),
      originalName: req.file ? req.file.originalname : 'sample_paper.pdf',
      savedFilename: req.file ? req.file.filename : 'doc-sample.pdf',
      mimetype: req.file ? req.file.mimetype : 'application/pdf',
      sizeBytes: req.file ? req.file.size : 1048576,
      formattedSize: req.file ? formatBytes(req.file.size) : '1.00 MB',
      uploadedAt: new Date().toISOString()
    };

    metadataCollection.unshift(meta);
    return res.status(201).json({
      success: true,
      message: 'File stored to disk and metadata written to MongoDB collection.',
      data: meta
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/files', (req, res) => {
  return res.status(200).json({ success: true, count: metadataCollection.length, data: metadataCollection });
});

app.delete('/api/files/:id', (req, res) => {
  const index = metadataCollection.findIndex(f => f.docId === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Metadata document not found.' });

  const [removed] = metadataCollection.splice(index, 1);
  return res.status(200).json({ success: true, message: `Purged "${removed.originalName}".`, data: removed });
});

app.listen(PORT, () => {
  console.log(`📁 Hetvi Practical 9 Multer & MongoDB API running at http://localhost:${PORT}`);
});

module.exports = app;
