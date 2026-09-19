const Task = require('../models/Task');
const { logActivity } = require('../utils/logger');

const getTasks = async (req, res) => {
  try {
    const { status, priority, assignee } = req.query;
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = assignee;

    const tasks = await Task.find(query).populate('assignee', 'name email avatar role').sort({ deadline: 1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      assignee: req.body.assignee || req.user._id,
    });
    await logActivity(req, 'CREATE_TASK', 'Task', task._id, `Created task "${task.title}"`);
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignee');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await logActivity(req, 'UPDATE_TASK', 'Task', task._id, `Updated task "${task.title}"`);
    res.json({ success: true, task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
