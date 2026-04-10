const Notice = require('../models/Notice');

// ── GET /api/notices  [all authenticated] ────────────────
exports.getNotices = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    // Admin sees all notices; residents see active ones only
    if (req.user.role === 'admin') delete filter.isActive;

    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: notices.length, notices });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/notices/public  [no auth - for home page] ───
exports.getPublicNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({ isActive: true })
      .select('title category priority createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ success: true, notices });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/notices  [admin] ───────────────────────────
exports.createNotice = async (req, res, next) => {
  try {
    const { title, content, category, priority, expiresAt, targetAudience } = req.body;

    const notice = await Notice.create({
      title,
      content,
      category:       category || 'General',
      priority:       priority || 'normal',
      expiresAt:      expiresAt || null,
      targetAudience: targetAudience || 'all',
      postedBy:       req.user._id,
      postedByName:   req.user.name,
    });

    res.status(201).json({ success: true, notice });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/notices/:id  [admin] ─────────────────────────
exports.updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' });
    res.json({ success: true, notice });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/notices/:id  [admin] ─────────────────────
exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' });
    res.json({ success: true, message: 'Notice deleted.' });
  } catch (err) {
    next(err);
  }
};
