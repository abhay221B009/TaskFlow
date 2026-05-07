const express = require('express');
const { createTeam, getTeams, getTeam, updateTeam, deleteTeam } = require('../controllers/teamController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', authorizeRoles('admin'), createTeam);
router.get('/', getTeams);
router.get('/:id', getTeam);
router.put('/:id', authorizeRoles('admin'), updateTeam);
router.delete('/:id', authorizeRoles('admin'), deleteTeam);

module.exports = router;
