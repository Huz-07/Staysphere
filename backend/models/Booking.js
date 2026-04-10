const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required'],
    },
    // Snapshot fields (so data is preserved even if room is edited)
    roomName: { type: String, required: true },
    roomNo:   { type: String, required: true },
    roomPrice: { type: Number, required: true },

    checkIn:  { type: Date, required: [true, 'Check-in date is required'] },
    checkOut: { type: Date, required: [true, 'Check-out date is required'] },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },

    // Guest info snapshot
    guestName:  { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },

    idProof: {
      type:   { type: String, default: '' },
      number: { type: String, default: '' },
    },

    specialRequests: { type: String, default: '' },

    // Admin actions
    adminNote:    { type: String, default: '' },
    approvedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt:   { type: Date, default: null },
    cancelledAt:  { type: Date, default: null },
    cancelReason: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// ── Auto-generate bookingId before save ──────────────────
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `BK${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
