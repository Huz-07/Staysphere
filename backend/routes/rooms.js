const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');

router.get('/',        getAllRooms);           // public
router.get('/:id',     getRoomById);          // public
router.post('/',       protect, adminOnly, createRoom);
router.put('/:id',     protect, adminOnly, updateRoom);
router.delete('/:id',  protect, adminOnly, deleteRoom);

module.exports = router;
