const pool = require('../../config/database');

// @desc    Create a company (Team Lead only)
// @route   POST /api/companies
// @access  Private (Lead)
exports.createCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: 'Company name required' });

    if (req.user.role !== 'lead') {
      return res.status(403).json({ message: 'Only Team Leads can create a company' });
    }

    if (req.user.company_id) {
      return res.status(400).json({ message: 'You already belong to a company' });
    }

    const companyResult = await pool.query(
      'INSERT INTO companies (name, lead_id) VALUES ($1, $2) RETURNING *',
      [name, req.user.id]
    );

    const company = companyResult.rows[0];

    await pool.query(
      'UPDATE users SET company_id = $1 WHERE id = $2',
      [company.id, req.user.id]
    );

    res.status(201).json({ success: true, company });
  } catch (error) {
    console.error('Create company error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's company + members
// @route   GET /api/companies/my
// @access  Private
exports.getMyCompany = async (req, res) => {
  try {
    if (!req.user.company_id) {
      return res.json({ success: true, company: null, members: [] });
    }

    const companyResult = await pool.query(
      'SELECT * FROM companies WHERE id = $1',
      [req.user.company_id]
    );

    if (companyResult.rows.length === 0) {
      return res.json({ success: true, company: null, members: [] });
    }

    const membersResult = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE company_id = $1
       ORDER BY CASE WHEN role = 'lead' THEN 0 ELSE 1 END, created_at ASC`,
      [req.user.company_id]
    );

    res.json({
      success: true,
      company: companyResult.rows[0],
      members: membersResult.rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Invite a member to the company (Team Lead only)
// @route   POST /api/companies/invite
// @access  Private (Lead)
exports.inviteMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email required' });

    if (req.user.role !== 'lead') {
      return res.status(403).json({ message: 'Only Team Leads can invite members' });
    }

    if (!req.user.company_id) {
      return res.status(400).json({ message: 'You need to create a company first' });
    }

    const targetResult = await pool.query(
      'SELECT id, name, email, role, company_id FROM users WHERE email = $1',
      [email]
    );

    if (targetResult.rows.length === 0) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    const target = targetResult.rows[0];

    if (target.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot invite yourself' });
    }

    if (target.company_id) {
      if (target.company_id === req.user.company_id) {
        return res.status(400).json({ message: 'User is already in your company' });
      }
      return res.status(403).json({
        message: 'Cannot invite user — they belong to another company',
      });
    }

    await pool.query(
      'UPDATE users SET company_id = $1, role = $2 WHERE id = $3',
      [req.user.company_id, 'member', target.id]
    );

    res.json({
      success: true,
      message: `${target.name} added to your company`,
      member: { id: target.id, name: target.name, email: target.email, role: 'member' },
    });
  } catch (error) {
    console.error('Invite member error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a member from the company (Team Lead only)
// @route   DELETE /api/companies/members/:id
// @access  Private (Lead)
exports.removeMember = async (req, res) => {
  try {
    if (req.user.role !== 'lead') {
      return res.status(403).json({ message: 'Only Team Leads can remove members' });
    }

    const memberId = parseInt(req.params.id, 10);

    if (memberId === req.user.id) {
      return res.status(400).json({ message: 'You cannot remove yourself' });
    }

    const memberResult = await pool.query(
      'SELECT id, company_id FROM users WHERE id = $1',
      [memberId]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (memberResult.rows[0].company_id !== req.user.company_id) {
      return res.status(403).json({ message: 'User is not in your company' });
    }

    await pool.query(
      'UPDATE users SET company_id = NULL WHERE id = $1',
      [memberId]
    );

    res.json({ success: true, message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};