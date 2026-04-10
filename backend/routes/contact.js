const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/contactController');

// Public: anyone can submit a contact message
router.post('/', createMessage);

// Admin only: manage messages
router.get('/',           protect, adminOnly, getAllMessages);
router.get('/:id',        protect, adminOnly, getMessageById);
router.put('/:id/status', protect, adminOnly, updateMessageStatus);
router.delete('/:id',     protect, adminOnly, deleteMessage);

module.exports = router;
