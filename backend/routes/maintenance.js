const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateStatus,
  deleteRequest,
} = require('../controllers/maintenanceController');

router.post('/',              protect, createRequest);
router.get('/my',             protect, getMyRequests);
router.get('/',               protect, adminOnly, getAllRequests);
router.put('/:id/status',     protect, adminOnly, updateStatus);
router.delete('/:id',         protect, adminOnly, deleteRequest);

module.exports = router;
