const express = require('express');
const router = express.Router();
const {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  addReply,
  toggleUpvote,
  deleteDiscussion,
} = require('../controllers/discussionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getDiscussions);
router.get('/:id', protect, getDiscussion);
router.post('/', protect, createDiscussion);
router.post('/:id/reply', protect, addReply);
router.post('/:id/upvote', protect, toggleUpvote);
router.delete('/:id', protect, deleteDiscussion);

module.exports = router;
