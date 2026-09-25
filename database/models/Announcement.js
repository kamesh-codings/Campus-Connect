const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Announcement content is required'],
    },
    category: {
      type: String,
      enum: ['Academic', 'Emergency', 'General', 'Club Activity', 'Placement & Career'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['normal', 'urgent', 'critical'],
      default: 'normal',
    },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'faculty', 'specific_dept'],
      default: 'all',
    },
    targetDepartment: {
      type: String,
      default: '',
    },
    attachments: [
      {
        fileName: { type: String },
        fileUrl: { type: String },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
