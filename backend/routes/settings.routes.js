const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settings.controller");

router.get("/", auth, role("admin"), getSettings);
router.put("/", auth, role("admin"), updateSettings);

module.exports = router;
