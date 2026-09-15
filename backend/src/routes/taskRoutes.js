const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// For now, placeholder - will be implemented later
router.get('/', auth, (req, res) => {
  res.json({ message: 'Tasks route - Coming soon!' });
});

module.exports = router;