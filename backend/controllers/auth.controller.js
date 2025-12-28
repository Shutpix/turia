const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

exports.login = async (req, res) => {
  const { employeeId, password } = req.body;

  // 1️⃣ Validate input
  if (!employeeId || !password) {
    return res.status(400).json({
      message: "employeeId and password are required",
    });
  }

  // 2️⃣ Find user by employeeId
  const result = await db.query(
    "SELECT * FROM users WHERE employee_id = $1",
    [employeeId]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ message: "User not found" });
  }

  const user = result.rows[0];

  // 3️⃣ Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Wrong password" });
  }

  // 4️⃣ Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 5️⃣ Respond
  res.json({
    token,
    role: user.role,
    name: user.name,
    employeeId: user.employee_id,
  });
};
