const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);
router.get('/', authorize('OWNER', 'ADMIN'), getActivityLogs);

module.exports = router;
