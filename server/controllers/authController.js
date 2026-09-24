const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, department, yearOfStudy, studentId } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Only admins can create admin/faculty accounts
    let userRole = role || 'student';
    if (['admin', 'faculty'].includes(userRole)) {
      // In production, add admin-only check here
      // For hackathon seeding, allow creation
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      department,
      yearOfStudy,
      studentId,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, requiredRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Find user by exact email (case-insensitive)
    let user = await User.findOne({ email: new RegExp(`^${cleanEmail}$`, 'i') }).select('+password');

    // 2. Demo role fallback lookup if specific seeded email variant was requested
    if (!user) {
      const demoEmailMap = {
        'kaviya.student@campus.edu': 'student',
        'alex.student@campus.edu': 'student',
        'student@campus.edu': 'student',
        'karthik.lead@campus.edu': 'club_admin',
        'gdsc.lead@campus.edu': 'club_admin',
        'lead@campus.edu': 'club_admin',
        'radhakrishnan.cse@campus.edu': 'faculty',
        'sharma.cse@campus.edu': 'faculty',
        'faculty@campus.edu': 'faculty',
        'admin@campus.edu': 'admin',
      };

      const fallbackRole = demoEmailMap[cleanEmail];
      if (fallbackRole) {
        user = await User.findOne({ role: fallbackRole }).select('+password');
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Database Role Verification
    if (requiredRole && user.role !== requiredRole) {
      const roleDisplayNames = {
        student: 'Student',
        faculty: 'Faculty',
        club_admin: 'Club Lead',
        admin: 'Administrator'
      };
      return res.status(403).json({ 
        message: `Database Verification Failed: Account is registered as "${roleDisplayNames[user.role] || user.role}" in MongoDB, which cannot log in via the ${roleDisplayNames[requiredRole] || requiredRole} portal.` 
      });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('joinedClubs', 'name logo category');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getMe };
