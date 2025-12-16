const Attendance = require('../models/Attendance');
const Settings = require('../models/Settings');
const Employee = require('../models/Employee');
const {
  calculatePunctuality,
  calculateTotalHours,
  getCurrentDate,
  getCurrentTime
} = require('../utils/punctuality');

/* ------------------ PUNCH IN ------------------ */
const punchIn = async (req, res) => {
  try {
    const { employee_id } = req.body;
    const today = getCurrentDate();
    const now = getCurrentTime();

    // Check if already punched in today
    const existing = await Attendance.findOne({
      employee_id,
      date: today
    });

    if (existing && existing.punch_in_time) {
      return res.status(400).json({ error: 'Already punched in today' });
    }

    // Get settings (single document)
    const settings = await Settings.findOne();

    const punctuality = calculatePunctuality(
      now,
      settings.business_hours_start,
      settings.grace_period_minutes
    );

    if (existing) {
      // Update existing record
      existing.punch_in_time = now;
      existing.punctuality_status = punctuality;
      await existing.save();
    } else {
      // Create new record
      await Attendance.create({
        employee_id,
        date: today,
        punch_in_time: now,
        punctuality_status: punctuality
      });
    }

    res.json({
      message: 'Punched in successfully',
      punch_in_time: now,
      punctuality_status: punctuality
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------ PUNCH OUT ------------------ */
const punchOut = async (req, res) => {
  try {
    const { employee_id } = req.body;
    const today = getCurrentDate();
    const now = getCurrentTime();

    const record = await Attendance.findOne({
      employee_id,
      date: today
    });

    if (!record || !record.punch_in_time) {
      return res.status(400).json({ error: 'Please punch in first' });
    }

    if (record.punch_out_time) {
      return res.status(400).json({ error: 'Already punched out today' });
    }

    const totalHours = calculateTotalHours(
      record.punch_in_time,
      now
    );

    record.punch_out_time = now;
    record.total_hours = totalHours;
    await record.save();

    res.json({
      message: 'Punched out successfully',
      punch_out_time: now,
      total_hours: totalHours
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------ GET ATTENDANCE RECORDS ------------------ */
const getAttendanceRecords = async (req, res) => {
  try {
    const { date, employee_name, punctuality_status } = req.query;

    const attendanceFilter = {};
    if (date) attendanceFilter.date = date;
    if (punctuality_status)
      attendanceFilter.punctuality_status = punctuality_status;

    let query = Attendance.find(attendanceFilter).populate(
      'employee_id',
      'name email'
    );

    const records = await query.exec();

    // Filter by employee name if provided (same behavior)
    const filtered = employee_name
      ? records.filter(r =>
          r.employee_id?.name
            ?.toLowerCase()
            .includes(employee_name.toLowerCase())
        )
      : records;

    // Match previous response shape
    const result = filtered.map(r => ({
      id: r._id,
      employee_id: r.employee_id?._id,
      employee_name: r.employee_id?.name,
      email: r.employee_id?.email,
      date: r.date,
      punch_in_time: r.punch_in_time,
      punch_out_time: r.punch_out_time,
      total_hours: r.total_hours,
      punctuality_status: r.punctuality_status,
      created_at: r.created_at
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------ GET TODAY STATUS ------------------ */
const getAttendanceStatus = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const today = getCurrentDate();

    const record = await Attendance.findOne({
      employee_id,
      date: today
    });

    res.json(record || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  punchIn,
  punchOut,
  getAttendanceRecords,
  getAttendanceStatus
};
