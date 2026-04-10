const Maintenance = require('../models/Maintenance');

// ── POST /api/maintenance  [resident] ────────────────────
exports.createRequest = async (req, res, next) => {
  try {
    const { category, issue, priority } = req.body;

    const request = await Maintenance.create({
      user:         req.user._id,
      residentName: req.user.name,
      roomNo:       req.user.currentRoom || 'N/A',
      category,
      issue,
      priority: priority || 'medium',
      status:   'open',
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/maintenance/my  [resident] ──────────────────
exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await Maintenance.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/maintenance  [admin] ────────────────────────
exports.getAllRequests = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const filter = {};
    if (status   && status   !== 'all') filter.status   = status;
    if (priority && priority !== 'all') filter.priority = priority;

    let requests = await Maintenance.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      requests = requests.filter(
        (r) =>
          r.residentName.toLowerCase().includes(q) ||
          r.roomNo.includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/maintenance/:id/status  [admin] ─────────────
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, assignedTo, adminNote } = req.body;
    const update = { status };
    if (assignedTo !== undefined) update.assignedTo = assignedTo;
    if (adminNote  !== undefined) update.adminNote  = adminNote;
    if (status === 'resolved') {
      update.resolvedAt = new Date();
      update.handledBy  = req.user._id;
    }

    const request = await Maintenance.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/maintenance/:id  [admin] ─────────────────
exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await Maintenance.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, message: 'Request deleted.' });
  } catch (err) {
    next(err);
  }
};
