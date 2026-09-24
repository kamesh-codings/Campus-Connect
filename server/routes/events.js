const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  registerForEvent,
  checkInAttendee,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getEvents);
router.get('/:id', protect, getEvent);
router.post('/', protect, authorize('admin', 'club_admin', 'faculty'), createEvent);
router.put('/:id', protect, authorize('admin', 'club_admin', 'faculty'), updateEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/check-in', protect, authorize('admin', 'club_admin', 'faculty'), checkInAttendee);
router.delete('/:id', protect, authorize('admin', 'faculty'), deleteEvent);

module.exports = router;
