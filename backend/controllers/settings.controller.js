const db = require("../db");

/* ------------------ GET SETTINGS (ADMIN) ------------------ */
exports.getSettings = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT business_start_time, grace_period_minutes FROM settings WHERE id = 1"
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------ UPDATE SETTINGS (ADMIN) ------------------ */
exports.updateSettings = async (req, res) => {
  try {
    const { businessStartTime, gracePeriodMinutes } = req.body;

    if (!businessStartTime || gracePeriodMinutes == null) {
      return res.status(400).json({
        message: "businessStartTime and gracePeriodMinutes are required",
      });
    }

    await db.query(
      `UPDATE settings
       SET business_start_time = $1,
           grace_period_minutes = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [businessStartTime, gracePeriodMinutes]
    );

    res.json({ message: "Settings updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
