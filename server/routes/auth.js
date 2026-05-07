const express = require('express');
const { signup, login, getMe, getAllUsers } = require('../controllers/authController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.get('/users', authMiddleware, authorizeRoles('admin'), getAllUsers);
router.get('/member-stats', authMiddleware, authorizeRoles('admin'), require('../controllers/authController').getMemberStats);

module.exports = router;
