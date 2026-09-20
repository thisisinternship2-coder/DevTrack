const pool = require('../../config/database');

// @desc    Get all tasks for current user's company
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    if (!req.user.company_id) {
      return res.json({ success: true, tasks: [] });
    }

    const result = await pool.query(
      `SELECT t.*,
              u.name AS assignee_name,
              p.name AS project_name
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       JOIN users owner ON p.owner_id = owner.id
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE owner.company_id = $1
       ORDER BY t.created_at DESC`,
      [req.user.company_id]
    );

    res.json({ success: true, tasks: result.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task (Team Lead only)
// @route   POST /api/tasks
// @access  Private (Lead)
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, project_id, due_date, assigned_to } = req.body;

    if (!title || !project_id) {
      return res.status(400).json({ message: 'Title and project required' });
    }

    if (req.user.role !== 'lead') {
      return res.status(403).json({ message: 'Only Team Leads can create tasks' });
    }

    const projectCheck = await pool.query(
      `SELECT p.id FROM projects p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = $1 AND u.company_id = $2`,
      [project_id, req.user.company_id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Project not in your company' });
    }

    if (assigned_to) {
      const assigneeCheck = await pool.query(
        'SELECT company_id FROM users WHERE id = $1',
        [assigned_to]
      );

      if (assigneeCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Assigned user not found' });
      }

      if (assigneeCheck.rows[0].company_id !== req.user.company_id) {
        return res.status(403).json({ message: 'Cannot assign to user outside your company' });
      }
    }

    const result = await pool.query(
      `INSERT INTO tasks
       (title, description, status, priority, project_id, due_date, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        description || null,
        status || 'todo',
        priority || 'medium',
        project_id,
        due_date || null,
        assigned_to || null,
      ]
    );

    res.status(201).json({ success: true, task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.name AS assignee_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
//          Lead: can update any task in company
//          Member: can only update status of tasks assigned to them
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const task = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (task.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const existing = task.rows[0];

    if (req.user.role !== 'lead') {
      if (existing.assigned_to !== req.user.id) {
        return res.status(403).json({ message: 'You can only update tasks assigned to you' });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: 'Members can only update task status' });
      }

      const result = await pool.query(
        'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
        [status, req.params.id]
      );

      return res.json({ success: true, task: result.rows[0] });
    }

    const { title, description, status, priority, due_date, assigned_to } = req.body;

    if (assigned_to) {
      const assigneeCheck = await pool.query(
        'SELECT company_id FROM users WHERE id = $1',
        [assigned_to]
      );
      if (assigneeCheck.rows.length === 0 || assigneeCheck.rows[0].company_id !== req.user.company_id) {
        return res.status(403).json({ message: 'Cannot assign to user outside your company' });
      }
    }

    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           due_date = COALESCE($5, due_date),
           assigned_to = COALESCE($6, assigned_to)
       WHERE id = $7
       RETURNING *`,
      [title, description, status, priority, due_date, assigned_to, req.params.id]
    );

    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task (Team Lead only)
// @route   DELETE /api/tasks/:id
// @access  Private (Lead)
exports.deleteTask = async (req, res) => {
  try {
    if (req.user.role !== 'lead') {
      return res.status(403).json({ message: 'Only Team Leads can delete tasks' });
    }

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};