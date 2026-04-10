/**
 * resetDB.js — Wipes all collections and re-seeds:
 *   • 1 Admin user
 *   • 1 Default resident user
 *   • 6 Sample rooms
 *
 * Usage:  node resetDB.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');
const Room     = require('./models/Room');
const Booking  = require('./models/Booking');
const Maintenance = require('./models/Maintenance');
const Notice   = require('./models/Notice');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/staysphere';

async function resetDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // ── 1. Drop all data ─────────────────────────────────────
    await User.deleteMany({});
    console.log('🗑️  Deleted all Users');

    await Booking.deleteMany({});
    console.log('🗑️  Deleted all Bookings');

    await Room.deleteMany({});
    console.log('🗑️  Deleted all Rooms');

    await Maintenance.deleteMany({});
    console.log('🗑️  Deleted all Maintenance requests');

    await Notice.deleteMany({});
    console.log('🗑️  Deleted all Notices');

    // ── 2. Seed Admin ────────────────────────────────────────
    const admin = await User.create({
      name:     process.env.ADMIN_NAME     || 'Admin User',
      email:    process.env.ADMIN_EMAIL    || 'admin@staysphere.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role:     'admin',
      status:   'active',
    });
    console.log(`✅ Admin seeded → ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);

    // ── 3. Seed Default User ─────────────────────────────────
    const user = await User.create({
      name:     'John Doe',
      email:    'user@staysphere.com',
      password: 'User@123',
      role:     'resident',
      status:   'active',
      phone:    '9876543210',
    });
    console.log(`✅ Default user seeded → ${user.email} / User@123`);

    // ── 4. Seed Rooms ────────────────────────────────────────
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
    console.log('✅ 6 rooms seeded');

    // ── Done ─────────────────────────────────────────────────
    console.log('\n🎉 Database reset complete!');
    console.log('   Admin  → admin@staysphere.com / Admin@123');
    console.log('   User   → user@staysphere.com  / User@123');
    console.log('   Rooms  → 6 rooms (all available)');
    console.log('   Bookings, Maintenance, Notices → 0\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
}

resetDatabase();
