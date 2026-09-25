const Club = require('../models/Club');
const User = require('../models/User');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Private
const getClubs = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
      ];
    }

    const clubs = await Club.find(query)
      .populate('leads', 'name email avatar')
      .populate('members.user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Private
const getClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('leads', 'name email avatar department')
      .populate('members.user', 'name email avatar department yearOfStudy')
      .populate('facultyAdvisor', 'name email avatar department');

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json(club);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private/Admin/Faculty
const createClub = async (req, res) => {
  try {
    const { name, category, tagline, description, logo, coverImage, socialLinks } = req.body;

    const clubExists = await Club.findOne({ name });
    if (clubExists) {
      return res.status(400).json({ message: 'Club with this name already exists' });
    }

    const club = await Club.create({
      name,
      category,
      tagline,
      description,
      logo,
      coverImage,
      leads: [req.user._id],
      socialLinks,
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a club
// @route   PUT /api/clubs/:id
// @access  Private/ClubAdmin
const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if user is a lead of this club or an admin
    const isLead = club.leads.some((lead) => lead.toString() === req.user._id.toString());
    if (!isLead && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this club' });
    }

    const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedClub);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Join a club
// @route   POST /api/clubs/:id/join
// @access  Private
const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if already a member
    const alreadyMember = club.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this club' });
    }

    club.members.push({ user: req.user._id, role: 'Member' });
    await club.save();

    // Add club to user's joinedClubs
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { joinedClubs: club._id },
    });

    res.json({ message: 'Successfully joined the club', club });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Leave a club
// @route   POST /api/clubs/:id/leave
// @access  Private
const leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    club.members = club.members.filter(
      (m) => m.user.toString() !== req.user._id.toString()
    );
    await club.save();

    // Remove club from user's joinedClubs
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { joinedClubs: club._id },
    });

    res.json({ message: 'Left the club successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Private/Admin
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: 'Club deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getClubs, getClub, createClub, updateClub, joinClub, leaveClub, deleteClub };
