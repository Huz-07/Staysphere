const Booking = require('../models/Booking');
const Room    = require('../models/Room');
const User    = require('../models/User');

// ── POST /api/bookings  [resident] ───────────────────────
exports.createBooking = async (req, res, next) => {
  try {
    const {
      roomId, checkIn, checkOut,
      guestName, guestEmail, guestPhone,
      idProof, specialRequests,
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found.' });
    if (room.status !== 'available') {
      return res.status(400).json({ success: false, message: 'This room is not available for booking.' });
    }

    // Calculate amount
    const ciDate = new Date(checkIn);
    const coDate = new Date(checkOut);
    const months = Math.max(
      1,
      (coDate.getFullYear() - ciDate.getFullYear()) * 12 +
        (coDate.getMonth() - ciDate.getMonth())
    );
    const totalAmount = room.price * months;

    const booking = await Booking.create({
      user:         req.user._id,
      room:         room._id,
      roomName:     room.name,
      roomNo:       room.roomNo,
      roomPrice:    room.price,
      checkIn:      ciDate,
      checkOut:     coDate,
      totalAmount,
      guestName,
      guestEmail,
      guestPhone,
      idProof,
      specialRequests,
      status:        'pending',
      paymentStatus: 'pending',
    });

    await booking.populate('user', 'name email');

    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings/my  [resident] ─────────────────────
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'name roomNo images')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings  [admin] ────────────────────────────
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    let bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('room', 'name roomNo')
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.bookingId.toLowerCase().includes(q) ||
          b.roomName.toLowerCase().includes(q) ||
          b.guestName.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings/:id ─────────────────────────────────
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('room', 'name roomNo type floor amenities images');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    // Resident can only view their own
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/bookings/:id/approve  [admin] ────────────────
exports.approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending bookings can be approved.' });
    }

    booking.status        = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.approvedBy    = req.user._id;
    booking.approvedAt    = new Date();
    booking.adminNote     = req.body.adminNote || '';
    await booking.save();

    // Update room status to occupied
    await Room.findByIdAndUpdate(booking.room, { status: 'occupied' });
    // Update user currentRoom
    await User.findByIdAndUpdate(booking.user, { currentRoom: booking.roomNo, status: 'active' });

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/bookings/:id/cancel ──────────────────────────
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    // Resident can cancel their own pending bookings; admin can cancel any
    if (req.user.role !== 'admin') {
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized.' });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Only pending bookings can be cancelled by residents.' });
      }
    }

    booking.status        = 'cancelled';
    booking.paymentStatus = booking.paymentStatus === 'paid' ? 'refunded' : 'failed';
    booking.cancelledAt   = new Date();
    booking.cancelReason  = req.body.cancelReason || '';
    await booking.save();

    // If room was occupied by this booking, free it back
    if (booking.status === 'confirmed') {
      await Room.findByIdAndUpdate(booking.room, { status: 'available' });
      await User.findByIdAndUpdate(booking.user, { currentRoom: null });
    }

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/bookings/:id/admin-note  [admin] ─────────────
exports.updateAdminNote = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { adminNote: req.body.adminNote },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};
