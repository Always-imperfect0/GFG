require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pokemon_todo',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(cors());
app.use(express.json());

async function ensureTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      status ENUM('todo', 'in-progress', 'completed') NOT NULL DEFAULT 'todo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  const conn = await pool.getConnection();
  try {
    await conn.query(sql);
  } finally {
    conn.release();
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, status FROM tasks ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/tasks error', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, status = 'todo' } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
  const cleanTitle = title.trim();
  const cleanStatus = ['todo', 'in-progress', 'completed'].includes(status) ? status : 'todo';
  try {
    const [result] = await pool.query('INSERT INTO tasks (title, status) VALUES (?, ?)', [cleanTitle, cleanStatus]);
    res.status(201).json({ id: result.insertId, title: cleanTitle, status: cleanStatus });
  } catch (err) {
    console.error('POST /api/tasks error', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const fields = [];
  const values = [];
  const allowedStatus = ['todo', 'in-progress', 'completed'];

  if (typeof req.body.title === 'string' && req.body.title.trim()) {
    fields.push('title = ?');
    values.push(req.body.title.trim());
  }
  if (typeof req.body.status === 'string' && allowedStatus.includes(req.body.status)) {
    fields.push('status = ?');
    values.push(req.body.status);
  }

  if (!fields.length) return res.status(400).json({ error: 'No valid fields to update' });

  try {
    values.push(id);
    await pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query('SELECT id, title, status FROM tasks WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /api/tasks/:id error', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Task not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/tasks/:id error', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

(async () => {
  try {
    await ensureTable();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
