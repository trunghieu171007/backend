const Photo = require('../models/Photo');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.uploadPhoto = async (req, res) => {
  try {
    const { caption, sharedWith } = req.body;
    const userId = req.user.id;

    // Create photo record
    const photo = new Photo({
      user: userId,
      imageUrl: `/uploads/${req.file.filename}`,
      caption,
      sharedWith: JSON.parse(sharedWith || '[]')
    });

    await photo.save();

    // Update user's streak
    const user = await User.findById(userId);
    const now = Date.now();
    const lastPhotoTime = user.lastPhotoTimestamp;
    const isNewDay = (now - lastPhotoTime) > 24 * 60 * 60 * 1000;

    user.currentStreak = isNewDay ? user.currentStreak + 1 : user.currentStreak;
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
    user.lastPhotoTimestamp = now;

    await user.save();

    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const photos = await Photo.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name profileImageUrl');

    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSharedPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const photos = await Photo.find({ sharedWith: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name profileImageUrl');

    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 