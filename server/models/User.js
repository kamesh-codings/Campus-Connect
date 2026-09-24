const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['student', 'club_admin', 'faculty', 'admin'],
      default: 'student',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    yearOfStudy: {
      type: Number,
      min: 1,
      max: 5,
    },
    studentId: {
      type: String,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: 300,
      default: '',
    },
    skills: [{ type: String }],
    interests: [{ type: String }],
    joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
    points: {
      type: Number,
      default: 50,
    },
    achievements: [
      {
        title: { type: String, required: true },
        icon: { type: String, default: '🏆' },
        description: { type: String },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
