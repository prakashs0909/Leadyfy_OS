const express = require('express');
const router = express.Router();
const { getPayouts, createPayout, updatePayoutStatus } = require('../controllers/payoutController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', authorize('OWNER', 'ADMIN'), getPayouts);
router.post('/', authorize('OWNER', 'ADMIN'), createPayout);
router.patch('/:id/status', authorize('OWNER', 'ADMIN'), updatePayoutStatus);

module.exports = router;
