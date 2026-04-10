const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    residentName: { type: String, required: true },
    roomNo:       { type: String, required: true },

    category: {
      type: String,
      required: true,
      enum: ['Plumbing', 'Electrical', 'Furniture', 'Housekeeping', 'AC/Appliance', 'Internet/WiFi', 'Security', 'Other'],
    },
    issue: {
      type: String,
      required: [true, 'Issue description is required'],
      minlength: [10, 'Please describe the issue in at least 10 characters'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    assignedTo:  { type: String, default: '' },
    adminNote:   { type: String, default: '' },

    resolvedAt: { type: Date, default: null },

    // Admin who handled it
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Auto-generate requestId ───────────────────────────────
maintenanceSchema.pre('save', async function (next) {
  if (!this.requestId) {
    const count = await mongoose.model('Maintenance').countDocuments();
    this.requestId = `MR${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
