const Video = require('../models/Video');
const Order = require('../models/Order');
const { logActivity, notify } = require('../utils/logger');

const getVideos = async (req, res) => {
  try {
    const { client, order, status, assignedEditor, urgency } = req.query;
    let query = {};
    if (client) query.client = client;
    if (order) query.order = order;
    if (status) query.status = status;
    if (assignedEditor) query.assignedEditor = assignedEditor;
    if (urgency) query.urgency = urgency;

    if (req.user.role === 'CLIENT' && req.user.clientId) {
      query.client = req.user.clientId;
    }

    const videos = await Video.find(query)
      .populate('client', 'clientName companyName email brandAssets')
      .populate('order', 'packageName contractedVideoCount')
      .populate('script', 'title videoNumber scriptText')
      .populate('creator', 'name photo')
      .populate('shoot', 'location date')
      .populate('assignedEditor', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: videos.length, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('client')
      .populate('order')
      .populate('script')
      .populate('creator')
      .populate('shoot')
      .populate('assignedEditor', 'name email avatar');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video asset not found' });
    }

    if (
      req.user.role === 'CLIENT' &&
      req.user.clientId &&
      video.client._id.toString() !== req.user.clientId.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to video' });
    }

    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVideo = async (req, res) => {
  try {
    const { client, order, script, creator, shoot, assignedEditor, videoNumber, title, thumbnail, driveLink, status, deadline, urgency } = req.body;

    const video = await Video.create({
      client,
      order,
      script,
      creator,
      shoot,
      assignedEditor: assignedEditor || req.user._id,
      videoNumber: Number(videoNumber) || 1,
      title: title || `Video #${videoNumber || 1}`,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
      driveLink: driveLink || 'https://drive.google.com/file/d/sample-raw-video/view',
      status: status || 'Script Approved',
      deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      urgency: urgency || 'Normal',
    });

    await logActivity(req, 'CREATE_VIDEO', 'Video', video._id, `Created video asset ${video.title}`);
    await notify({
      roleTarget: 'ALL',
      title: 'Video Added to Pipeline',
      message: `Video asset "${video.title}" entered pipeline stage: ${video.status}`,
      type: 'info',
      link: `/videos`,
    });

    res.status(201).json({ success: true, video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('client')
      .populate('assignedEditor', 'name email');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video asset not found' });
    }

    await logActivity(req, 'UPDATE_VIDEO', 'Video', video._id, `Updated video ${video.title}`);

    res.json({ success: true, video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateVideoStatus = async (req, res) => {
  try {
    const { status, finalDeliveryLink, driveLink } = req.body;
    const video = await Video.findById(req.params.id).populate('client order');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video asset not found' });
    }

    const previousStatus = video.status;
    video.status = status;

    if (driveLink) video.driveLink = driveLink;
    if (finalDeliveryLink) video.finalDeliveryLink = finalDeliveryLink;

    if (status === 'Delivered') {
      video.urgency = 'Completed';
      if (!video.finalDeliveryLink) {
        video.finalDeliveryLink = video.driveLink || 'https://drive.google.com/file/d/final-delivery-sample/view';
      }
    }

    await video.save();

    await logActivity(
      req,
      'UPDATE_VIDEO_STATUS',
      'Video',
      video._id,
      `Moved video "${video.title}" from "${previousStatus}" to "${status}"`
    );

    await notify({
      roleTarget: 'ALL',
      title: `Video Stage Changed: ${status}`,
      message: `Video "${video.title}" is now in status: ${status}`,
      type: status === 'Delivered' ? 'success' : 'info',
      link: `/videos`,
    });

    res.json({ success: true, video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Client Revision Request Flow
const addVideoFeedback = async (req, res) => {
  try {
    const { feedback, priority } = req.body;
    const video = await Video.findById(req.params.id).populate('client assignedEditor');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video asset not found' });
    }

    video.revisionCount += 1;
    video.status = 'Revision';
    video.urgency = priority === 'Urgent' ? 'Overdue' : 'Due Today';

    video.feedbackLog.push({
      user: req.user.name,
      userRole: req.user.role,
      feedback: feedback || 'Client requested video edits.',
      timestamp: new Date(),
      priority: priority || 'High',
    });

    await video.save();

    await logActivity(
      req,
      'CLIENT_REVISION_REQUEST',
      'Video',
      video._id,
      `Client requested revision on video "${video.title}". Feedback: ${feedback}`
    );

    await notify({
      roleTarget: 'ALL',
      title: 'Revision Requested by Client',
      message: `Client requested edits for "${video.title}": ${feedback}`,
      type: 'warning',
      link: `/videos`,
    });

    res.json({ success: true, video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Client Approval Flow
const approveVideo = async (req, res) => {
  try {
    const { finalDeliveryLink } = req.body;
    const video = await Video.findById(req.params.id).populate('client order');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video asset not found' });
    }

    video.status = 'Delivered';
    video.urgency = 'Completed';
    video.finalDeliveryLink =
      finalDeliveryLink || video.driveLink || 'https://drive.google.com/file/d/final-delivery-ready/view';

    await video.save();

    await logActivity(
      req,
      'CLIENT_VIDEO_APPROVED',
      'Video',
      video._id,
      `Client approved final edit for video "${video.title}". Asset marked Delivered.`
    );

    await notify({
      roleTarget: 'ALL',
      title: 'Final Video Approved & Delivered!',
      message: `Video "${video.title}" has been approved by client and delivered!`,
      type: 'success',
      link: `/videos`,
    });

    res.json({ success: true, video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  updateVideoStatus,
  addVideoFeedback,
  approveVideo,
};
