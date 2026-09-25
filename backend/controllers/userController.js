const User = require('../models/User');

// @desc    Get user public profile
// @route   GET /api/users/profile/:id
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('joinedClubs', 'name logo category');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, interests, avatar, department, yearOfStudy, extracurricularActivities, academicInfo, achievements } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    if (avatar) user.avatar = avatar;

    // Academic & institutional records: strictly restricted to faculty and administration
    if (['admin', 'faculty'].includes(req.user.role)) {
      if (department) user.department = department;
      if (yearOfStudy) user.yearOfStudy = yearOfStudy;
      if (academicInfo) user.academicInfo = { ...user.academicInfo, ...academicInfo };
      if (achievements) user.achievements = achievements;
      if (extracurricularActivities) user.extracurricularActivities = extracurricularActivities;
    } else {
      // Students can update their extracurricular interests
      if (extracurricularActivities) user.extracurricularActivities = extracurricularActivities;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (Faculty & Admin)
// @route   GET /api/users
// @access  Private/Admin & Faculty
const getAllUsers = async (req, res) => {
  try {
    const { role, department, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('joinedClubs', 'name')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update student credentials and details (Faculty & Administration only)
// @route   PUT /api/users/:id/manage
// @access  Private/Admin & Faculty
const manageStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      department,
      yearOfStudy,
      role,
      academicInfo,
      extracurricularActivities,
      skills,
      interests,
      points,
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    if (name) user.name = name;
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already assigned to another user' });
      }
      user.email = email.toLowerCase();
    }
    if (password && password.trim().length > 0) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = password; // Trigger pre('save') bcrypt hashing
    }
    if (studentId !== undefined) user.studentId = studentId;
    if (department) user.department = department;
    if (yearOfStudy !== undefined) user.yearOfStudy = Number(yearOfStudy);
    if (role && ['student', 'club_admin', 'faculty', 'admin'].includes(role)) {
      user.role = role;
    }
    if (academicInfo) {
      user.academicInfo = {
        gpa: academicInfo.gpa !== undefined ? academicInfo.gpa : user.academicInfo?.gpa,
        specialization: academicInfo.specialization !== undefined ? academicInfo.specialization : user.academicInfo?.specialization,
        semester: academicInfo.semester !== undefined ? Number(academicInfo.semester) : user.academicInfo?.semester,
      };
    }
    if (extracurricularActivities) {
      user.extracurricularActivities = extracurricularActivities;
    }
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    if (points !== undefined) user.points = Number(points);

    const updatedUser = await user.save();
    res.json({
      message: 'Student credentials and details updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        yearOfStudy: updatedUser.yearOfStudy,
        studentId: updatedUser.studentId,
        academicInfo: updatedUser.academicInfo,
        extracurricularActivities: updatedUser.extracurricularActivities,
        skills: updatedUser.skills,
        interests: updatedUser.interests,
        points: updatedUser.points,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student details', error: error.message });
  }
};

// @desc    Create student/member account (Faculty & Administration only)
// @route   POST /api/users
// @access  Private/Admin & Faculty
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      department,
      yearOfStudy,
      role = 'student',
      academicInfo,
      extracurricularActivities,
    } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: 'Name, email, password, and department are required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // auto-hashed by pre('save')
      studentId: studentId || '',
      department,
      yearOfStudy: Number(yearOfStudy) || 1,
      role: ['student', 'club_admin', 'faculty', 'admin'].includes(role) ? role : 'student',
      academicInfo: academicInfo || { gpa: '8.5 / 10', semester: 2, specialization: department },
      extracurricularActivities: extracurricularActivities || [],
    });

    res.status(201).json({
      message: 'Student account created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        yearOfStudy: newUser.yearOfStudy,
        studentId: newUser.studentId,
        academicInfo: newUser.academicInfo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student account', error: error.message });
  }
};

// @desc    Update user role (Faculty & Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin & Faculty
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user (Faculty & Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin & Faculty
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get campus public directory (search peers/faculty)
// @route   GET /api/users/directory
// @access  Private
const getDirectory = async (req, res) => {
  try {
    const { search, role, department } = req.query;
    let query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    const users = await User.find(query)
      .select('name role department studentId avatar skills interests achievements extracurricularActivities points')
      .populate('joinedClubs', 'name category')
      .limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  getAllUsers,
  getDirectory,
  updateUserRole,
  deleteUser,
  manageStudent,
  createStudent,
};
