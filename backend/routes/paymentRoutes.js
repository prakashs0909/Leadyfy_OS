const express = require('express');
const router = express.Router();
const { getPayments, createPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', getPayments);
router.post('/', authorize('OWNER', 'ADMIN'), createPayment);

module.exports = router;
