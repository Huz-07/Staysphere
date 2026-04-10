const Room = require('../models/Room');

// ── GET /api/rooms ────────────────────────────────────────
exports.getAllRooms = async (req, res, next) => {
  try {
    const { status, type, minPrice, maxPrice } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type)   filter.type   = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/rooms/:id ────────────────────────────────────
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('currentOccupants', 'name email');
    if (!room) return res.status(404).json({ success: false, message: 'Room not found.' });
    res.json({ success: true, room });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/rooms  [admin] ──────────────────────────────
exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, room });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/rooms/:id  [admin] ───────────────────────────
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found.' });
    res.json({ success: true, room });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/rooms/:id  [admin] ────────────────────────
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found.' });
    res.json({ success: true, message: 'Room deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
