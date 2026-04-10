const User    = require('../models/User');
const Booking = require('../models/Booking');

// ── GET /api/users  [admin] ───────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = { role: 'resident' }; // admins never appear in user list
    if (status && status !== 'all') filter.status = status;

    let users = await User.find(filter).sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.includes(q))
      );
    }

    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/:id  [admin] ───────────────────────────
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const bookings = await Booking.find({ user: user._id })
      .select('bookingId roomName roomNo checkIn checkOut status totalAmount')
      .sort({ createdAt: -1 });

    res.json({ success: true, user, bookings });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/users/:id/status  [admin] ────────────────────
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/users/:id  [admin] ───────────────────────────
exports.updateUser = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'status', 'currentRoom'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/users/:id  [admin] ────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
};
