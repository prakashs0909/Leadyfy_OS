const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    videoNumber: { type: Number, required: true },
    title: { type: String, required: true },
    writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
    language: { type: String, default: 'English' },
    scriptText: { type: String, required: true },
    referenceLinks: [{ type: String }],
    deadline: { type: Date },
    revisionCount: { type: Number, default: 0 },
    comments: [
      {
        user: { type: String },
        userRole: { type: String },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: [
        'Draft',
        'Assigned',
        'In Review',
        'Sent to Client',
        'Revision Required',
        'Approved',
        'Ready for Shoot',
      ],
      default: 'Draft',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Script', scriptSchema);
