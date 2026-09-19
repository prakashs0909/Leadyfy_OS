const Script = require('../models/Script');
const Video = require('../models/Video');
const { logActivity, notify } = require('../utils/logger');

const getScripts = async (req, res) => {
  try {
    const { client, order, status } = req.query;
    let query = {};
    if (client) query.client = client;
    if (order) query.order = order;
    if (status) query.status = status;

    if (req.user.role === 'CLIENT' && req.user.clientId) {
      query.client = req.user.clientId;
    }

    const scripts = await Script.find(query)
      .populate('client', 'clientName companyName email')
      .populate('order', 'packageName')
      .populate('writer', 'name email avatar')
      .populate('creator', 'name photo availability')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: scripts.length, scripts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getScriptById = async (req, res) => {
  try {
    const script = await Script.findById(req.params.id)
      .populate('client')
      .populate('order')
      .populate('writer', 'name email avatar')
      .populate('creator');

    if (!script) {
      return res.status(404).json({ success: false, message: 'Script not found' });
    }

    if (
      req.user.role === 'CLIENT' &&
      req.user.clientId &&
      script.client._id.toString() !== req.user.clientId.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to script' });
    }

    res.json({ success: true, script });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createScript = async (req, res) => {
  try {
    const { client, order, videoNumber, title, writer, creator, language, scriptText, referenceLinks, deadline } = req.body;

    const script = await Script.create({
      client,
      order,
      videoNumber: Number(videoNumber) || 1,
      title: title || `Video #${videoNumber || 1} Concept`,
      writer: writer || req.user._id,
      creator,
      language: language || 'English',
      scriptText,
      referenceLinks: referenceLinks || [],
      deadline,
      status: req.body.status || 'Draft',
    });

    await logActivity(req, 'CREATE_SCRIPT', 'Script', script._id, `Drafted script ${script.title}`);
    await notify({
      roleTarget: 'ALL',
      title: 'New Script Created',
      message: `Script "${script.title}" was drafted and assigned to writer.`,
      type: 'info',
      link: `/scripts/${script._id}`,
    });

    res.status(201).json({ success: true, script });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateScript = async (req, res) => {
  try {
    const script = await Script.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('writer creator client');

    if (!script) {
      return res.status(404).json({ success: false, message: 'Script not found' });
    }

    await logActivity(req, 'UPDATE_SCRIPT', 'Script', script._id, `Updated script ${script.title}`);

    res.json({ success: true, script });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateScriptStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const script = await Script.findById(req.params.id).populate('client');

    if (!script) {
      return res.status(404).json({ success: false, message: 'Script not found' });
    }

    script.status = status;

    if (comment) {
      script.comments.push({
        user: req.user.name,
        userRole: req.user.role,
        comment,
      });
    }

    if (status === 'Revision Required') {
      script.revisionCount += 1;
    }

    await script.save();

    await logActivity(req, 'UPDATE_SCRIPT_STATUS', 'Script', script._id, `Script ${script.title} status changed to ${status}`);
    await notify({
      roleTarget: 'ALL',
      title: `Script Status: ${status}`,
      message: `Script "${script.title}" status changed to ${status}`,
      type: status === 'Approved' ? 'success' : 'info',
      link: `/scripts/${script._id}`,
    });

    res.json({ success: true, script });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getScripts,
  getScriptById,
  createScript,
  updateScript,
  updateScriptStatus,
};
