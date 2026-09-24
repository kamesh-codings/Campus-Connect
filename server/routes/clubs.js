const express = require('express');
const router = express.Router();
const {
  getClubs,
  getClub,
  createClub,
  updateClub,
  joinClub,
  leaveClub,
  deleteClub,
} = require('../controllers/clubController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getClubs);
router.get('/:id', protect, getClub);
router.post('/', protect, authorize('admin', 'faculty', 'club_admin'), createClub);
router.put('/:id', protect, authorize('admin', 'faculty', 'club_admin'), updateClub);
router.post('/:id/join', protect, joinClub);
router.post('/:id/leave', protect, leaveClub);
router.delete('/:id', protect, authorize('admin', 'faculty'), deleteClub);

module.exports = router;
