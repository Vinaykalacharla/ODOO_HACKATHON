const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/message', chatController.sendMessage);
router.get('/sessions', chatController.getSessions);
router.get('/sessions/:id', chatController.getSessionHistory);

module.exports = router;
