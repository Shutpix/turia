const db = require("../db");

/* ------------------ PUNCH IN ------------------ */
exports.punchIn = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Prevent double punch-in
    const existing = await db.query(
      `SELECT id FROM attendance
       WHERE user_id = $1 AND punch_out IS NULL`,
      [userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "You have already punched in",
      });
    }

    // 2️⃣ Fetch settings (ADMIN configured)
    const settingsResult = await db.query(
      `SELECT business_start_time, grace_period_minutes
       FROM settings
       WHERE id = 1`
    );

    if (settingsResult.rows.length === 0) {
      return res.status(500).json({
        message: "Attendance settings not configured",
      });
    }

    const { business_start_time, grace_period_minutes } =
      settingsResult.rows[0];

    const now = new Date();

    // 3️⃣ Build business start time
    const [startHour, startMinute] = business_start_time.split(":");

    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0);

    const graceEnd = new Date(startTime);
    graceEnd.setMinutes(
      graceEnd.getMinutes() + grace_period_minutes
    );

    // 4️⃣ Determine status
    let status = "LATE";
    if (now <= graceEnd) {
      status = "ON_TIME";
    }

    // 5️⃣ Insert attendance
    await db.query(
      `INSERT INTO attendance (user_id, punch_in, status)
       VALUES ($1, $2, $3)`,
      [userId, now, status]
    );

    res.status(200).json({
      message: "Punched in successfully",
      punch_in: now,
      status,
    });
  } catch (error) {
    console.error("Punch In Error:", error);
    res.status(500).json({ message: "Punch in failed" });
  }
};

/* ------------------ PUNCH OUT ------------------ */
exports.punchOut = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Ensure punch-in exists
    const activePunch = await db.query(
      `SELECT id FROM attendance
       WHERE user_id = $1 AND punch_out IS NULL`,
      [userId]
    );

    if (activePunch.rows.length === 0) {
      return res.status(400).json({
        message: "You have not punched in yet",
      });
    }

    // 2️⃣ Punch out
    await db.query(
      `UPDATE attendance
       SET punch_out = $1
       WHERE user_id = $2 AND punch_out IS NULL`,
      [new Date(), userId]
    );

    res.status(200).json({
      message: "Punched out successfully",
    });
  } catch (error) {
    console.error("Punch Out Error:", error);
    res.status(500).json({ message: "Punch out failed" });
  }
};
