const express = require('express');
const router = express.Router();
const {
  punchIn,
  punchOut,
  getAttendanceRecords,
  getAttendanceStatus,
} = require('../controllers/attendanceController');

router.post('/punch-in', punchIn);
router.post('/punch-out', punchOut);
router.get('/', getAttendanceRecords);
router.get('/status/:employee_id', getAttendanceStatus);

module.exports = router;

