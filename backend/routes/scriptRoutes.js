const express = require('express');
const router = express.Router();
const {
  getScripts,
  getScriptById,
  createScript,
  updateScript,
  updateScriptStatus,
} = require('../controllers/scriptController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', getScripts);
router.get('/:id', getScriptById);
router.post('/', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), createScript);
router.put('/:id', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), updateScript);
router.patch('/:id/status', updateScriptStatus); // Clients allowed to approve or request revision

module.exports = router;
