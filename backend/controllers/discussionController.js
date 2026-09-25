const Discussion = require('../models/Discussion');

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Private
const getDiscussions = async (req, res) => {
  try {
    const { category, tag, sort } = req.query;
    let query = {};

    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };

    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'trending') {
      sortOption = { upvotes: -1, createdAt: -1 };
    }

    const discussions = await Discussion.find(query)
      .populate('author', 'name avatar role department')
      .sort(sortOption);

    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single discussion
// @route   GET /api/discussions/:id
// @access  Private
const getDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'name avatar role department')
      .populate('replies.author', 'name avatar role department');

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create discussion
// @route   POST /api/discussions
// @access  Private
const createDiscussion = async (req, res) => {
  try {
    const discussionData = {
      ...req.body,
      author: req.user._id,
    };

    const discussion = await Discussion.create(discussionData);

    const populated = await Discussion.findById(discussion._id).populate(
      'author',
      'name avatar role department'
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add reply to discussion
// @route   POST /api/discussions/:id/reply
// @access  Private
const addReply = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const reply = {
      author: req.user._id,
      content: req.body.content,
      isFacultyEndorsed: req.user.role === 'faculty',
    };

    discussion.replies.push(reply);
    await discussion.save();

    const populated = await Discussion.findById(req.params.id)
      .populate('author', 'name avatar role department')
      .populate('replies.author', 'name avatar role department');

    // Emit socket event for real-time reply
    const io = req.app.get('io');
    if (io) {
      io.to(`discussion_${req.params.id}`).emit('DISCUSSION_REPLY', {
        discussionId: req.params.id,
        reply: populated.replies[populated.replies.length - 1],
      });
    }

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle upvote on discussion
// @route   POST /api/discussions/:id/upvote
// @access  Private
const toggleUpvote = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const userId = req.user._id.toString();
    const hasUpvoted = discussion.upvotes.some((id) => id.toString() === userId);

    if (hasUpvoted) {
      discussion.upvotes = discussion.upvotes.filter((id) => id.toString() !== userId);
    } else {
      discussion.upvotes.push(req.user._id);
    }

    await discussion.save();
    res.json({ upvotes: discussion.upvotes.length, hasUpvoted: !hasUpvoted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
// @access  Private/Admin
const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Allow deletion by author or admin
    if (
      discussion.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this discussion' });
    }

    await Discussion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Report inappropriate discussion (content moderation)
// @route   POST /api/discussions/:id/report
// @access  Private
const reportDiscussion = async (req, res) => {
  try {
    const { reason } = req.body;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.isReported = true;
    discussion.reportReason = reason || 'Inappropriate or violates campus community guidelines';
    if (!discussion.reportedBy.includes(req.user._id)) {
      discussion.reportedBy.push(req.user._id);
    }

    await discussion.save();
    res.json({ message: 'Discussion thread flagged for moderation review', discussion });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reported discussions for Admin Content Moderation
// @route   GET /api/discussions/reported
// @access  Private/Admin
const getReportedDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({ isReported: true })
      .populate('author', 'name email department avatar role')
      .populate('reportedBy', 'name email')
      .sort({ updatedAt: -1 });

    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Dismiss report (Admin approves discussion)
// @route   PUT /api/discussions/:id/dismiss-report
// @access  Private/Admin
const dismissReport = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.isReported = false;
    discussion.isModerated = true;
    discussion.reportReason = '';
    await discussion.save();

    res.json({ message: 'Report dismissed, content approved', discussion });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  addReply,
  toggleUpvote,
  deleteDiscussion,
  reportDiscussion,
  getReportedDiscussions,
  dismissReport,
};
