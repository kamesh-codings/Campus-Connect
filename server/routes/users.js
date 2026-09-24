const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
