const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Salaries', 'Office', 'Studio', 'Equipment', 'Fuel', 'Payouts'],
      required: true,
    },
    amount: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    date: { type: Date, default: Date.now },
    receipt: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
