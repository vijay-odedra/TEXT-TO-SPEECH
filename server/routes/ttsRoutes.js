const express = require('express');
const router = express.Router();
const { getVoices, getStatus, synthesizeSpeech } = require('../controllers/ttsController');
const { validateTTSRequest } = require('../middleware/validationMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

// Provider status check
router.get('/status', getStatus);

// Voices listing
router.get('/voices', getVoices);

// TTS audio synthesis
router.post('/tts', rateLimiter({ max: 30, windowMs: 60 * 1000 }), validateTTSRequest, synthesizeSpeech);

module.exports = router;
