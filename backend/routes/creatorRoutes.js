const express = require('express');
const router = express.Router();
const {
  getCreators,
  getCreatorById,
  createCreator,
  updateCreator,
  deleteCreator,
} = require('../controllers/creatorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), getCreators);
router.get('/:id', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), getCreatorById);
router.post('/', authorize('OWNER', 'ADMIN'), createCreator);
router.put('/:id', authorize('OWNER', 'ADMIN'), updateCreator);
router.delete('/:id', authorize('OWNER', 'ADMIN'), deleteCreator);

module.exports = router;
