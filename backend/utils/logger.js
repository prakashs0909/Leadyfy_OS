const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

const logActivity = async (req, action, entity, entityId, details) => {
  try {
    const user = req?.user;
    await ActivityLog.create({
      user: user?._id,
      userName: user?.name || 'System User',
      userRole: user?.role || 'SYSTEM',
      action,
      entity,
      entityId: entityId ? entityId.toString() : null,
      details,
    });
  } catch (err) {
    console.error('Activity logging failed:', err.message);
  }
};

const notify = async ({ user, roleTarget = 'ALL', title, message, type = 'info', link }) => {
  try {
    await Notification.create({
      user,
      roleTarget,
      title,
      message,
      type,
      link,
    });
  } catch (err) {
    console.error('Notification creation failed:', err.message);
  }
};

module.exports = { logActivity, notify };
