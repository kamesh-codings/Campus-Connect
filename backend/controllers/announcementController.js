const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
  try {
    const { category, priority, targetAudience } = req.query;
    let query = {};

    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (targetAudience) query.targetAudience = targetAudience;

    const announcements = await Announcement.find(query)
      .populate('author', 'name avatar role department')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      'author',
      'name avatar role department'
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin/Faculty/ClubAdmin
const createAnnouncement = async (req, res) => {
  try {
    const announcementData = {
      ...req.body,
      author: req.user._id,
    };

    const announcement = await Announcement.create(announcementData);

    const populatedAnnouncement = await Announcement.findById(announcement._id).populate(
      'author',
      'name avatar role department'
    );

    // Emit real-time broadcast
    const io = req.app.get('io');
    if (io) {
      io.to('campus_all').emit('NEW_ANNOUNCEMENT', {
        id: announcement._id,
        title: announcement.title,
        priority: announcement.priority,
        category: announcement.category,
      });
    }

    res.status(201).json(populatedAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('author', 'name avatar role department');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
