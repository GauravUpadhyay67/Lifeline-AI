const express = require('express');
const router = express.Router();
const { getCamps } = require('../controllers/campController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCamps);

module.exports = router;
