const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    date: {
      type: String,
      required: true
    },
    punch_in_time: String,
    punch_out_time: String,
    total_hours: Number,
    punctuality_status: String
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

attendanceSchema.index(
  { employee_id: 1, date: 1 },
  { unique: true }
);

// ✅ CRITICAL FIX — prevent overwrite
const Attendance =
  mongoose.models.Attendance ||
  mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
