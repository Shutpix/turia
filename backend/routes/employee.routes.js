const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const {
  getAllEmployees,
  createEmployee,
} = require("../controllers/employee.controller");

router.get("/", auth, role("admin"), getAllEmployees);
router.post("/", auth, role("admin"), createEmployee);

module.exports = router;
