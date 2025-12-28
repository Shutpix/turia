const db = require("../db");

/* ------------------ ADMIN ATTENDANCE REPORT ------------------ */
exports.getTodayAttendanceReport = async (req, res) => {
  try {
    // 1️⃣ Get today’s date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2️⃣ Fetch attendance with employee details
    const result = await db.query(
      `
      SELECT 
        u.employee_id,
        u.name,
        a.punch_in,
        a.punch_out,
        a.status
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.punch_in >= $1
      ORDER BY a.punch_in ASC
      `,
      [today]
    );

    // 3️⃣ Total present count
    const totalPresent = result.rows.length;

    res.json({
      totalPresent,
      employees: result.rows,
    });
  } catch (err) {
    console.error("Attendance Report Error:", err);
    res.status(500).json({ message: "Failed to fetch attendance report" });
  }
};
