const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Reply content is required'],
  },
  isFacultyEndorsed: {
    type: Boolean,
    default: false,
  },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Discussion title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Discussion body is required'],
    },
    category: {
      type: String,
      default: 'General',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{ type: String }],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [replySchema],
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Discussion', discussionSchema);
