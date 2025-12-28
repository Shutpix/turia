const db = require("../db");
const bcrypt = require("bcrypt");

/* ------------------ GET ALL EMPLOYEES (ADMIN) ------------------ */
exports.getAllEmployees = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, employee_id FROM users WHERE role = 'employee'"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------ CREATE EMPLOYEE (ADMIN) ------------------ */
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, employeeId, password } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !employeeId || !password) {
      return res.status(400).json({
        message: "name, email, employeeId and password are required",
      });
    }

    // 2️⃣ Check duplicate email
    const emailExists = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3️⃣ Check duplicate employeeId
    const empIdExists = await db.query(
      "SELECT id FROM users WHERE employee_id = $1",
      [employeeId]
    );

    if (empIdExists.rows.length > 0) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Insert employee
    const result = await db.query(
      `INSERT INTO users (name, email, employee_id, password, role)
       VALUES ($1, $2, $3, $4, 'employee')
       RETURNING id, name, email, employee_id, role`,
      [name, email, employeeId, hashedPassword]
    );

    res.status(201).json({
      message: "Employee created successfully",
      employee: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
