const Task = require('../models/Task');
const Project = require('../models/Project');
const Team = require('../models/Team');

exports.createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo, assignedTeam, project } = req.body;

  try {
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      createdBy: req.user._id
    };
    if (assignedTo) taskData.assignedTo = assignedTo;
    if (assignedTeam) taskData.assignedTeam = assignedTeam;

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      // Find teams the user is a member of
      const userTeams = await Team.find({ members: req.user._id });
      const teamIds = userTeams.map(team => team._id);

      // Member only sees tasks assigned to them, their team, or created by them
      query = { 
        $or: [
          { assignedTo: req.user._id }, 
          { assignedTeam: { $in: teamIds } },
          { createdBy: req.user._id }
        ] 
      };
    }
    
    // If project id is passed, filter by project
    if (req.query.project) {
      query.project = req.query.project;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedTeam', 'name')
      .populate('project', 'title')
      .populate('createdBy', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Members can only update status
    if (req.user.role !== 'admin') {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
         return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        .populate('assignedTo', 'name email')
        .populate('assignedTeam', 'name')
        .populate('project', 'title');
      return res.json(updatedTask);
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo', 'name email')
      .populate('assignedTeam', 'name')
      .populate('project', 'title');
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
