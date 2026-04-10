const Booking     = require('../models/Booking');
const Room        = require('../models/Room');
const User        = require('../models/User');
const Maintenance = require('../models/Maintenance');

// ── GET /api/reports/dashboard  [admin] ──────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      totalUsers,
      activeUsers,
      activeBookings,
      pendingBookings,
      openMaintenance,
      activeNoticesCount,
      unreadMessages,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: 'available' }),
      Room.countDocuments({ status: 'occupied' }),
      Room.countDocuments({ status: 'maintenance' }),
      User.countDocuments({ role: 'resident' }),
      User.countDocuments({ role: 'resident', status: 'active' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'pending' }),
      Maintenance.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
      require('../models/Notice').countDocuments({ isActive: true }),
      require('../models/ContactMessage').countDocuments({ status: 'unread' }),
    ]);

    // Monthly revenue (current month confirmed bookings)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'confirmed', createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const monthlyRevenue = revenueAgg[0]?.total || 0;

    // Total all-time revenue
    const totalRevenueAgg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Occupancy rate
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Last 5 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('bookingId roomName roomNo checkIn totalAmount status paymentStatus createdAt guestName');

    // Last 5 maintenance requests
    const recentMaintenance = await Maintenance.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('requestId residentName roomNo category priority status createdAt');

    res.json({
      success: true,
      stats: {
        totalRooms, availableRooms, occupiedRooms, maintenanceRooms,
        totalUsers, activeUsers,
        activeBookings, pendingBookings,
        openMaintenance, activeNoticesCount, unreadMessages,
        monthlyRevenue, totalRevenue,
        occupancyRate,
      },
      recentBookings,
      recentMaintenance,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/reports/revenue  [admin] ────────────────────
exports.getRevenueReport = async (req, res, next) => {
  try {
    // Last 6 months revenue
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ year: d.getFullYear(), month: d.getMonth() });
    }

    const revenueData = await Promise.all(
      months.map(async ({ year, month }) => {
        const start = new Date(year, month, 1);
        const end   = new Date(year, month + 1, 0, 23, 59, 59);
        const agg = await Booking.aggregate([
          { $match: { status: 'confirmed', createdAt: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        ]);
        return {
          month: start.toLocaleString('en-IN', { month: 'short', year: 'numeric' }),
          revenue: agg[0]?.total || 0,
          bookings: agg[0]?.count || 0,
        };
      })
    );

    res.json({ success: true, revenueData });
  } catch (err) {
    next(err);
  }
};
