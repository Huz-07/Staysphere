const ContactMessage = require('../models/ContactMessage');

// ── POST /api/contact  (public) ──────────────────────────
// Anyone can submit a contact message
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required.',
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will reply within 24 hours.',
      contactMessage,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/contact  [admin] ────────────────────────────
// Admin can view all contact messages
exports.getAllMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/contact/:id  [admin] ────────────────────────
exports.getMessageById = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: msg });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/contact/:id/status  [admin] ─────────────────
// Update message status (read, replied) and optional admin note
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const update = {};
    if (status) update.status = status;
    if (adminNote !== undefined) update.adminNote = adminNote;

    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: msg });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/contact/:id  [admin] ─────────────────────
exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
