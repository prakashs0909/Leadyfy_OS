const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    packageName: { type: String, required: true },
    contractedVideoCount: { type: Number, required: true, default: 10 },
    pricing: { type: Number, required: true },
    gstTax: { type: Number, default: 0 },
    totalInvoiceAmount: { type: Number, required: true },
    amountReceived: { type: Number, default: 0 },
    outstandingBalance: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    assignedTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['New', 'Onboarding', 'In Production', 'Partially Delivered', 'Completed', 'On Hold', 'Cancelled'],
      default: 'In Production',
    },
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  this.outstandingBalance = (this.totalInvoiceAmount || 0) - (this.amountReceived || 0);
  next();
});

module.exports = mongoose.model('Order', orderSchema);
