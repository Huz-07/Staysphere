require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ── Connect Database ─────────────────────────────────────
connectDB();

const app = express();

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Routes ───────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/rooms',       require('./routes/rooms'));
app.use('/api/bookings',    require('./routes/bookings'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/notices',     require('./routes/notices'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/reports',     require('./routes/reports'));
app.use('/api/contact',     require('./routes/contact'));

// ── Health check ─────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'StaySphere API is running 🚀', env: process.env.NODE_ENV })
);

// ── 404 handler ──────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` })
);

// ── Global error handler ─────────────────────────────────
app.use(errorHandler);

// ── Start server + seed DB ───────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`\n🚀 StaySphere API running on http://localhost:${PORT}`);
  console.log(`📖 Environment: ${process.env.NODE_ENV}`);
  await seedDatabase();
});

// ── Seed: Admin user + sample rooms ──────────────────────
async function seedDatabase() {
  try {
    const User = require('./models/User');
    const Room = require('./models/Room');

    // Seed admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name:     process.env.ADMIN_NAME     || 'Admin User',
        email:    process.env.ADMIN_EMAIL    || 'admin@staysphere.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role:     'admin',
        status:   'active',
      });
      console.log('✅ Admin user seeded → admin@staysphere.com / Admin@123');
    }

    // Seed rooms
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      await Room.insertMany([
        {
          name: 'Single Room (Non-AC)',
          roomNo: '102',
          type: 'Single',
          floor: 1,
          capacity: 1,
          price: 4500,
          status: 'available',
          amenities: ['WiFi', 'Fan', 'Common Bath', 'Bed', 'Cupboard'],
          description: 'Simple single room suitable for students. Non-AC with basic furniture and shared bathroom.',
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60'],
          rating: 3.9,
          reviews: 6,
        },
        {
          name: 'Single Room (AC)',
          roomNo: '210',
          type: 'Single',
          floor: 2,
          capacity: 1,
          price: 7500,
          status: 'available',
          amenities: ['WiFi', 'AC', 'Attached Bath', 'Bed', 'Study Table', 'Cupboard'],
          description: 'Comfortable AC single room with attached bathroom. Ideal for students or working individuals.',
          images: ['https://plus.unsplash.com/premium_photo-1682093007363-b05f4c3dc932?w=600&auto=format&fit=crop&q=60'],
          rating: 4.3,
          reviews: 10,
        },
        {
          name: 'Double Sharing (Non-AC)',
          roomNo: '215',
          type: 'Double',
          floor: 2,
          capacity: 2,
          price: 5000,
          status: 'available',
          amenities: ['WiFi', 'Fan', 'Common Bath', 'Bed', 'Cupboard'],
          description: 'Budget-friendly double sharing room. Suitable for friends or colleagues.',
          images: ['https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=600&auto=format&fit=crop&q=60'],
          rating: 4.0,
          reviews: 8,
        },
        {
          name: 'Double Sharing (AC)',
          roomNo: '305',
          type: 'Double',
          floor: 3,
          capacity: 2,
          price: 9000,
          status: 'available',
          amenities: ['WiFi', 'AC', 'Attached Bath', 'Bed', 'Study Table', 'Cupboard'],
          description: 'Spacious AC double sharing room with attached bathroom.',
          images: ['https://images.unsplash.com/photo-1771276045965-aa5c1ddf15a9?w=600&auto=format&fit=crop&q=60'],
          rating: 4.4,
          reviews: 11,
        },
        {
          name: 'Triple Sharing Room',
          roomNo: '108',
          type: 'Triple',
          floor: 1,
          capacity: 3,
          price: 4000,
          status: 'available',
          amenities: ['WiFi', 'Fan', 'Common Bath', 'Bed', 'Cupboard', 'Water Cooler'],
          description: 'Triple sharing room for students looking for economical stay.',
          images: ['https://media.istockphoto.com/id/1814658510/photo/roommates-talking-in-bedroom-at-hostel.webp?a=1&b=1&s=612x612&w=0&k=20&c=babUmyWpr-xNnQ1ArnrxSQHL5xcoxXTF3YsAH_UWtLc='],
          rating: 3.7,
          reviews: 7,
        },
        {
          name: '4 Sharing Dorm Room',
          roomNo: '110',
          type: 'Dorm',
          floor: 1,
          capacity: 4,
          price: 3000,
          status: 'available',
          amenities: ['WiFi', 'Fan', 'Common Bath', 'Locker', 'Bed'],
          description: 'Affordable dorm room with 4 sharing. Best for students.',
          images: ['https://images.unsplash.com/photo-1709805619372-40de3f158e83?q=80&w=1495&auto=format&fit=crop'],
          rating: 3.6,
          reviews: 13,
        },
      ]);
      console.log('✅ 6 sample rooms seeded');
    }
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}
