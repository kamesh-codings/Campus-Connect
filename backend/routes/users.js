const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getAllUsers,
  getDirectory,
  updateUserRole,
  deleteUser,
  manageStudent,
  createStudent,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'faculty'), getAllUsers);
router.post('/', protect, authorize('admin', 'faculty'), createStudent);
router.get('/directory', protect, getDirectory);
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/:id/manage', protect, authorize('admin', 'faculty'), manageStudent);
router.put('/:id/role', protect, authorize('admin', 'faculty'), updateUserRole);
router.delete('/:id', protect, authorize('admin', 'faculty'), deleteUser);

module.exports = router;
