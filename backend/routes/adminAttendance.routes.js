const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const {
  getTodayAttendanceReport,
} = require("../controllers/adminAttendance.controller");

// ADMIN ONLY
router.get("/today", auth, role("admin"), getTodayAttendanceReport);

module.exports = router;
