const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), getTasks);
router.post('/', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), createTask);
router.put('/:id', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), updateTask);
router.delete('/:id', authorize('OWNER', 'ADMIN'), deleteTask);

module.exports = router;
