const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  updateVideoStatus,
  addVideoFeedback,
  approveVideo,
} = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', getVideos);
router.get('/:id', getVideoById);
router.post('/', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), createVideo);
router.put('/:id', authorize('OWNER', 'ADMIN', 'EMPLOYEE'), updateVideo);
router.patch('/:id/status', updateVideoStatus);
router.post('/:id/feedback', addVideoFeedback); // Client revision request
router.post('/:id/approve', approveVideo); // Client approval

module.exports = router;
