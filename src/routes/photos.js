const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Upload photo
router.post('/', photoController.upload.single('image'), photoController.uploadPhoto);

// Get latest photos
router.get('/latest', photoController.getLatestPhotos);

// Get shared photos
router.get('/shared', photoController.getSharedPhotos);

module.exports = router; 