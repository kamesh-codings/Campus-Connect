const express = require('express');
const router = express.Router();
const {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  addReply,
  toggleUpvote,
  deleteDiscussion,
  reportDiscussion,
  getReportedDiscussions,
  dismissReport,
} = require('../controllers/discussionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getDiscussions);
router.get('/reported', protect, authorize('admin'), getReportedDiscussions);
router.get('/:id', protect, getDiscussion);
router.post('/', protect, createDiscussion);
router.post('/:id/reply', protect, addReply);
router.post('/:id/upvote', protect, toggleUpvote);
router.post('/:id/report', protect, reportDiscussion);
router.put('/:id/dismiss-report', protect, authorize('admin'), dismissReport);
router.delete('/:id', protect, deleteDiscussion);

module.exports = router;
