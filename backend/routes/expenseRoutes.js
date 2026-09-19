const express = require('express');
const router = express.Router();
const { getExpenses, createExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', authorize('OWNER', 'ADMIN'), getExpenses);
router.post('/', authorize('OWNER', 'ADMIN'), createExpense);

module.exports = router;
