const express = require('express');
const router = express.Router();
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), getClients);
router.get('/:id', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), getClientById);
router.post('/', authorize('OWNER', 'ADMIN'), createClient);
router.put('/:id', authorize('OWNER', 'ADMIN'), updateClient);
router.delete('/:id', authorize('OWNER', 'ADMIN'), deleteClient);

module.exports = router;
