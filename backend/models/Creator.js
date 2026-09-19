const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Non-Binary', 'Other'], default: 'Female' },
    ageGroup: { type: String, default: '18-25' },
    languages: [{ type: String }],
    location: { type: String },
    niches: [{ type: String }],
    demographics: { type: String },
    contact: {
      email: { type: String },
      phone: { type: String },
      instagram: { type: String },
    },
    rates: {
      perVideo: { type: Number, default: 150 },
      perShoot: { type: Number, default: 500 },
    },
    bankInfo: {
      accountName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      upiId: { type: String },
    },
    portfolioLinks: [{ type: String }],
    availability: {
      type: String,
      enum: ['Available', 'Booked', 'Unavailable', 'On Hold'],
      default: 'Available',
    },
    activeShootsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Creator', creatorSchema);
