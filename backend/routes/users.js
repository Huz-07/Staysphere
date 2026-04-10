const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.get('/',               protect, adminOnly, getAllUsers);
router.get('/:id',            protect, adminOnly, getUserById);
router.put('/:id/status',     protect, adminOnly, updateUserStatus);
router.put('/:id',            protect, adminOnly, updateUser);
router.delete('/:id',         protect, adminOnly, deleteUser);

module.exports = router;
