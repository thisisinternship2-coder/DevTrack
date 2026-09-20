const express = require('express');
const router = express.Router();
const {
  createCompany,
  getMyCompany,
  inviteMember,
  removeMember,
} = require('../controllers/companyController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', createCompany);
router.get('/my', getMyCompany);
router.post('/invite', inviteMember);
router.delete('/members/:id', removeMember);

module.exports = router;