const Employee = require('../models/Employee');

/* ------------------ GET ALL EMPLOYEES ------------------ */
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ created_at: -1 });

    // Match previous response shape
    const result = employees.map(emp => ({
      id: emp._id,
      name: emp.name,
      email: emp.email,
      created_at: emp.created_at
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------ CREATE EMPLOYEE ------------------ */
const createEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ error: 'Name and email are required' });
    }

    const employee = await Employee.create({ name, email });

    res.json({
      id: employee._id,
      name: employee.name,
      email: employee.email,
      created_at: employee.created_at
    });
  } catch (err) {
    // Handle duplicate email (same behavior as UNIQUE constraint)
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee
};
