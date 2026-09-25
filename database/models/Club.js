const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Club name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'Cultural', 'Sports', 'Social & Outreach', 'Academic'],
      required: [true, 'Category is required'],
    },
    tagline: {
      type: String,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    facultyAdvisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['Member', 'Core Team', 'Lead'],
          default: 'Member',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'pending_approval'],
      default: 'active',
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Club', clubSchema);
