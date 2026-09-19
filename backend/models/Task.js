const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: {
      type: String,
      enum: ['Urgent', 'High', 'Medium', 'Low'],
      default: 'Medium',
    },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done'],
      default: 'To Do',
    },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
