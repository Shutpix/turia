const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { getCurrentDate } = require('../utils/punctuality');

const getAnalytics = async (req, res) => {
  try {
    const today = getCurrentDate();

    // Total employees
    const totalEmployees = await Employee.countDocuments();

    // Present today (any attendance record for today)
    const presentToday = await Attendance.countDocuments({
      date: today
    });

    // On-time count today
    const onTimeCount = await Attendance.countDocuments({
      date: today,
      punctuality_status: 'on-time'
    });

    // Late count today
    const lateCount = await Attendance.countDocuments({
      date: today,
      punctuality_status: 'late'
    });

    // Attendance rate (same logic)
    const attendanceRate =
      totalEmployees > 0
        ? ((presentToday / totalEmployees) * 100).toFixed(1)
        : 0;

    res.json({
      total_employees: totalEmployees,
      present_today: presentToday,
      on_time_count: onTimeCount,
      late_count: lateCount,
      attendance_rate: parseFloat(attendanceRate)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAnalytics
};
