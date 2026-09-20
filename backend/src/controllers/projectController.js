const pool = require('../../config/database');

// @desc    Get all projects for current user's company
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    if (!req.user.company_id) {
      return res.json({ success: true, projects: [] });
    }

    const result = await pool.query(
      `SELECT p.*, u.name AS owner_name
       FROM projects p
       JOIN users u ON p.owner_id = u.id
       WHERE u.company_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.company_id]
    );

    res.json({ success: true, projects: result.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project (Team Lead only)
// @route   POST /api/projects
// @access  Private (Lead)
exports.createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) return res.status(400).json({ message: 'Name required' });

    if (req.user.role !== 'lead') {
      return res.status(403).json({ message: 'Only Team Leads can create projects' });
    }

    if (!req.user.company_id) {
      return res.status(400).json({ message: 'You need to create a company first' });
    }

    const result = await pool.query(
      'INSERT INTO projects (name, description, status, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description || null, status || 'planning', req.user.id]
    );

    res.status(201).json({ success: true, project: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS owner_name
       FROM projects p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const owner = await pool.query(
      'SELECT company_id FROM users WHERE id = $1',
      [result.rows[0].owner_id]
    );

    if (owner.rows[0].company_id !== req.user.company_id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, project: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project (Team Lead only)
// @route   PUT /api/projects/:id
// @access  Private (Lead)
exports.updateProject = async (req, res) => {
  try {
    if (req.user.role !== 'lead') {
      return res.status(403).json({ message: 'Only Team Leads can update projects' });
    }

    const project = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const owner = await pool.query(
      'SELECT company_id FROM users WHERE id = $1',
      [project.rows[0].owner_id]
    );

    if (owner.rows[0].company_id !== req.user.company_id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, status } = req.body;
    const result = await pool.query(
      `UPDATE projects
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           status = COALESCE($3, status)
       WHERE id = $4
       RETURNING *`,
      [name, description, status, req.params.id]
    );

    res.json({ success: true, project: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project (Team Lead only)
// @route   DELETE /api/projects/:id
// @access  Private (Lead)
exports.deleteProject = async (req, res) => {
  try {
    if (req.user.role !== 'lead') {
      return res.status(403).json({ message: 'Only Team Leads can delete projects' });
    }

    const project = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const owner = await pool.query(
      'SELECT company_id FROM users WHERE id = $1',
      [project.rows[0].owner_id]
    );

    if (owner.rows[0].company_id !== req.user.company_id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};