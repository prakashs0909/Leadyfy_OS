const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    script: { type: mongoose.Schema.Types.ObjectId, ref: 'Script' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
    shoot: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoot' },
    assignedEditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    videoNumber: { type: Number, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String },
    driveLink: { type: String },
    status: {
      type: String,
      enum: [
        'Script Approved',
        'Shoot Pending',
        'Raw Footage Received',
        'Video Editing',
        'Internal QA',
        'Client Review',
        'Revision',
        'Final Approved',
        'Delivered',
      ],
      default: 'Script Approved',
    },
    revisionCount: { type: Number, default: 0 },
    feedbackLog: [
      {
        user: { type: String },
        userRole: { type: String },
        feedback: { type: String },
        timestamp: { type: Date, default: Date.now },
        priority: { type: String, enum: ['Urgent', 'High', 'Medium', 'Low'], default: 'Medium' },
      },
    ],
    finalDeliveryLink: { type: String },
    urgency: {
      type: String,
      enum: ['Overdue', 'Due Today', 'Due Tomorrow', 'Completed', 'Normal'],
      default: 'Normal',
    },
    deadline: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
