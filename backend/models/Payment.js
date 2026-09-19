const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    invoiceAmount: { type: Number, required: true },
    amountReceived: { type: Number, required: true },
    pendingBalance: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    method: { type: String, enum: ['Bank Transfer', 'Credit Card', 'UPI', 'Stripe', 'PayPal'], default: 'Bank Transfer' },
    transactionRef: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid', 'Overdue'],
      default: 'Paid',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
