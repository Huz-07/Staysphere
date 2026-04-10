const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getNotices,
  getPublicNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');

router.get('/public',   getPublicNotices);                    // no auth
router.get('/',         protect, getNotices);
router.post('/',        protect, adminOnly, createNotice);
router.put('/:id',      protect, adminOnly, updateNotice);
router.delete('/:id',   protect, adminOnly, deleteNotice);

module.exports = router;
