const express = require('express');
const router = express.Router();
const {
  getShoots,
  getShootById,
  createShoot,
  updateShoot,
  updateChecklists,
} = require('../controllers/shootController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', getShoots);
router.get('/:id', getShootById);
router.post('/', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), createShoot);
router.put('/:id', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), updateShoot);
router.patch('/:id/checklists', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), updateChecklists);

module.exports = router;
