const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  uploadFile,
  getResources,
  createResource,
  deleteResource,
} = require('../controllers/uploadController');

// Upload single file (poster, doc, pdf, image)
router.post('/', protect, upload.single('file'), uploadFile);

// Campus Resource Library & File Sharing
router.get('/resources', protect, getResources);
router.post('/resources', protect, createResource);
router.delete('/resources/:id', protect, deleteResource);

module.exports = router;
