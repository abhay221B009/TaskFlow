const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(authMiddleware, authorizeRoles('admin'), createTask)
  .get(authMiddleware, getTasks);

router.route('/:id')
  .put(authMiddleware, updateTask) // Both admin and member can update (handled in controller)
  .delete(authMiddleware, authorizeRoles('admin'), deleteTask);

module.exports = router;
