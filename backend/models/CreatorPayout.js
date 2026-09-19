const mongoose = require('mongoose');

const creatorPayoutSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
    shoot: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoot' },
    videoCount: { type: Number, default: 1 },
    contractedRate: { type: Number, required: true },
    totalPayout: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    reference: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Paid'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CreatorPayout', creatorPayoutSchema);
