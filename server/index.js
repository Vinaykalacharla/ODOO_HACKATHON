import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' })); // Vite dev server
app.use(express.json());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', database: process.env.DB_NAME });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── Generic Query Endpoint (for testing) ────────────────────────────────────
app.get('/api/tables', async (req, res) => {
  try {
    const [rows] = await db.query('SHOW TABLES');
    res.json({ tables: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Students Routes ──────────────────────────────────────────────────────────
// GET all students
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create student
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, course } = req.body;
    const [result] = await db.query(
      'INSERT INTO students (name, email, course) VALUES (?, ?, ?)',
      [name, email, course]
    );
    res.status(201).json({ id: result.insertId, name, email, course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, email, course } = req.body;
    await db.query(
      'UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?',
      [name, email, course, req.params.id]
    );
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
app.delete('/api/students/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
