const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const cloudinary = require('../config/cloudinary');

// Ensure public uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// @desc    Upload a single file (poster, document, image, pdf)
// @route   POST /api/upload
// @access  Private
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file format' });
    }

    const file = req.file;

    // Check if Cloudinary is configured with real credentials
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key'
    ) {
      // Stream buffer to Cloudinary
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'campusconnect',
            resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              // Fallback to local storage
              return saveLocally(file, req, res);
            }
            res.json({
              success: true,
              url: result.secure_url,
              fileName: file.originalname,
              fileType: file.mimetype,
              size: file.size,
            });
          }
        );
        uploadStream.end(file.buffer);
      });
    }

    // Default: Secure Local Disk Storage
    saveLocally(file, req, res);
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

const saveLocally = (file, req, res) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const targetPath = path.join(uploadDir, uniqueName);

  fs.writeFile(targetPath, file.buffer, (err) => {
    if (err) {
      console.error('Failed to save file locally:', err);
      return res.status(500).json({ message: 'Failed to write file to disk' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${uniqueName}`;

    res.json({
      success: true,
      url: fileUrl,
      fileName: file.originalname,
      fileType: file.mimetype,
      size: file.size,
    });
  });
};

// @desc    Get all shared campus resources
// @route   GET /api/upload/resources
// @access  Private
const getResources = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name role department avatar')
      .populate('club', 'name category')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resources', error: error.message });
  }
};

// @desc    Publish a new campus resource entry
// @route   POST /api/upload/resources
// @access  Private
const createResource = async (req, res) => {
  try {
    const { title, description, fileUrl, fileName, fileType, fileSize, category, club } = req.body;

    if (!title || !fileUrl || !fileName) {
      return res.status(400).json({ message: 'Title, file URL, and file name are required' });
    }

    const resource = await Resource.create({
      title,
      description,
      fileUrl,
      fileName,
      fileType: fileType || 'document',
      fileSize: fileSize || 0,
      category: category || 'General',
      uploadedBy: req.user._id,
      club: club || undefined,
    });

    const populated = await Resource.findById(resource._id)
      .populate('uploadedBy', 'name role department avatar')
      .populate('club', 'name category');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to publish resource', error: error.message });
  }
};

// @desc    Delete a shared campus resource
// @route   DELETE /api/upload/resources/:id
// @access  Private
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Only uploader or admin can delete
    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resource', error: error.message });
  }
};

module.exports = {
  uploadFile,
  getResources,
  createResource,
  deleteResource,
};
