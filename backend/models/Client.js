const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    companyName: { type: String, required: true }, // Unified naming: companyName
    email: { type: String, required: true },
    phone: { type: String },
    whatsApp: { type: String },
    businessName: { type: String },
    industry: { type: String },
    gstTaxId: { type: String },
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    source: { type: String, default: 'Direct Inbound' },
    status: {
      type: String,
      enum: ['Lead', 'New', 'Onboarding', 'Active', 'On Hold', 'Completed', 'Inactive'],
      default: 'Onboarding',
    },
    brandAssets: {
      logoUrl: { type: String },
      brandGuidelines: { type: String },
      driveFolder: { type: String },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
