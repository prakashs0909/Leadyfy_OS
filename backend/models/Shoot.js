const mongoose = require('mongoose');

const shootSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    date: { type: Date, required: true },
    time: { type: String, default: '10:00 AM' },
    location: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    cameraman: { type: String, default: 'In-house Tech' },
    shootManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shootingAssistant: { type: String },
    approvedScripts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Script' }],
    specialNotes: { type: String },
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Reshoot Required'],
      default: 'Scheduled',
    },
    preShootChecklist: {
      scriptApproved: { type: Boolean, default: false },
      creatorConfirmed: { type: Boolean, default: false },
      locationPermission: { type: Boolean, default: false },
      clientProductReceived: { type: Boolean, default: false },
      teamBriefing: { type: Boolean, default: false },
    },
    postShootVerification: {
      footageUploaded: { type: Boolean, default: false },
      rawFileVerified: { type: Boolean, default: false },
      reshootRequired: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shoot', shootSchema);
