const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roleTarget: { type: String, enum: ['OWNER', 'ADMIN', 'EMPLOYEE', 'CLIENT', 'ALL'] },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
