const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  approveBooking,
  cancelBooking,
  updateAdminNote,
} = require('../controllers/bookingController');

router.post('/',                    protect, createBooking);
router.get('/my',                   protect, getMyBookings);
router.get('/',                     protect, adminOnly, getAllBookings);
router.get('/:id',                  protect, getBookingById);
router.put('/:id/approve',          protect, adminOnly, approveBooking);
router.put('/:id/cancel',           protect, cancelBooking);
router.put('/:id/admin-note',       protect, adminOnly, updateAdminNote);

module.exports = router;
