/**
 * ============================================================================
 * PRACTICAL 6: Create a backend server using Express.js implementing
 *              routing, middleware and request handling.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5010;

// 1. MIDDLEWARE PIPELINE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Performance & Audit Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`[Hetvi-Express] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${elapsed}ms)`);
  });
  next();
});

// 2. IN-MEMORY DATA REPOSITORY (Academic Book Library)
let bookCatalog = [
  { id: 101, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', genre: 'Database', price: 1450, available: true },
  { id: 102, title: 'Clean Architecture & Software Craftsmanship', author: 'Robert C. Martin', genre: 'Architecture', price: 1199, available: true },
  { id: 103, title: 'Full Stack Development with MERN', author: 'Hetvi Patel', genre: 'Web Engineering', price: 899, available: false }
];
let nextId = 104;

// 3. EXPRESS ROUTER FOR BOOK INVENTORY (/api/books)
const bookRouter = express.Router();

// GET: All Books with Optional Query Filtering (?genre=... & search=...)
bookRouter.get('/', (req, res) => {
  let list = [...bookCatalog];
  const { genre, search } = req.query;

  if (genre) {
    list = list.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }

  return res.status(200).json({ success: true, count: list.length, data: list });
});

// GET: Single Book by Unique ID
bookRouter.get('/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = bookCatalog.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ success: false, message: `Book #${bookId} not found in catalog.` });
  }
  return res.status(200).json({ success: true, data: book });
});

// POST: Add New Book with Schema Validation
bookRouter.post('/', (req, res) => {
  const { title, author, genre, price } = req.body;

  if (!title || !author || price === undefined) {
    return res.status(400).json({ success: false, message: 'Title, author, and price are mandatory.' });
  }

  const newBook = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    genre: genre || 'General Computing',
    price: Number(price),
    available: true
  };

  bookCatalog.push(newBook);
  return res.status(201).json({ success: true, message: 'Book cataloged successfully.', data: newBook });
});

// PUT: Full Record Update
bookRouter.put('/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const index = bookCatalog.findIndex(b => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Cannot update: Book #${bookId} does not exist.` });
  }

  const { title, author, genre, price, available } = req.body;
  bookCatalog[index] = {
    ...bookCatalog[index],
    title: title || bookCatalog[index].title,
    author: author || bookCatalog[index].author,
    genre: genre || bookCatalog[index].genre,
    price: price !== undefined ? Number(price) : bookCatalog[index].price,
    available: available !== undefined ? Boolean(available) : bookCatalog[index].available
  };

  return res.status(200).json({ success: true, message: `Book #${bookId} record updated.`, data: bookCatalog[index] });
});

// DELETE: Remove Record
bookRouter.delete('/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const index = bookCatalog.findIndex(b => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Cannot delete: Book #${bookId} not found.` });
  }

  const [removed] = bookCatalog.splice(index, 1);
  return res.status(200).json({ success: true, message: `Book "${removed.title}" removed.`, data: removed });
});

// Mount Sub-Router
app.use('/api/books', bookRouter);

// Root Dashboard
app.get('/', (req, res) => {
  res.json({
    practical: 'Practical 6: Express.js Routing & Middleware Server',
    student: 'Hetvi Patel',
    port: PORT,
    endpoints: {
      getAllBooks: 'GET /api/books',
      getBookById: 'GET /api/books/:id',
      createBook: 'POST /api/books',
      updateBook: 'PUT /api/books/:id',
      deleteBook: 'DELETE /api/books/:id'
    }
  });
});

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not defined.` });
});

app.listen(PORT, () => {
  console.log(`📚 Hetvi Practical 6 Express Server running at http://localhost:${PORT}`);
});

module.exports = app;
