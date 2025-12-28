const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const {
  punchIn,
  punchOut,
} = require("../controllers/attendance.controller");

router.post("/punch-in", auth, punchIn);
router.post("/punch-out", auth, punchOut);

module.exports = router;
