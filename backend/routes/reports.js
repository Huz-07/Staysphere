const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getDashboardStats, getRevenueReport } = require('../controllers/reportController');

router.get('/dashboard',  protect, adminOnly, getDashboardStats);
router.get('/revenue',    protect, adminOnly, getRevenueReport);

module.exports = router;
