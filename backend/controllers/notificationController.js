const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;

    const notifications = await Notification.find({
      $or: [{ user: userId }, { roleTarget: userRole }, { roleTarget: 'ALL' }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { $or: [{ user: req.user._id }, { roleTarget: req.user.role }, { roleTarget: 'ALL' }] },
      { isRead: true }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
