const ActivityLog = require('../models/ActivityLog');

const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getActivityLogs };
