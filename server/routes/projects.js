const express = require('express');
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(authMiddleware, authorizeRoles('admin'), createProject)
  .get(authMiddleware, getProjects);

router.route('/:id')
  .get(authMiddleware, getProjectById)
  .put(authMiddleware, authorizeRoles('admin'), updateProject)
  .delete(authMiddleware, authorizeRoles('admin'), deleteProject);

module.exports = router;
