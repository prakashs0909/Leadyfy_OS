const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', getOrders); // Clients can get their own orders
router.get('/:id', getOrderById);
router.post('/', authorize('OWNER', 'ADMIN'), createOrder);
router.put('/:id', authorize('OWNER', 'ADMIN'), updateOrder);

module.exports = router;
