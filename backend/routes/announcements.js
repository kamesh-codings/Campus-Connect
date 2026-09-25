const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAnnouncements);
router.get('/:id', protect, getAnnouncement);
router.post('/', protect, authorize('admin', 'faculty', 'club_admin'), createAnnouncement);
router.put('/:id', protect, authorize('admin', 'faculty'), updateAnnouncement);
router.delete('/:id', protect, authorize('admin', 'faculty'), deleteAnnouncement);

module.exports = router;
