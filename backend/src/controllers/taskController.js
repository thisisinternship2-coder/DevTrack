const pool = require('../../config/database');

exports.getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE owner_id = $1) ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, tasks: result.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, project_id, due_date } = req.body;
    if (!title || !project_id) {
      return res.status(400).json({ message: 'Title and project required' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, project_id, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description || null, status || 'todo', priority || 'medium', project_id, due_date || null]
    );
    res.status(201).json({ success: true, task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), priority = COALESCE($4, priority), due_date = COALESCE($5, due_date) WHERE id = $6 RETURNING *',
      [title, description, status, priority, due_date, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};