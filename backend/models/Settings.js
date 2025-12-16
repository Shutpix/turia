const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    business_hours_start: { type: String, default: '09:00' },
    grace_period_minutes: { type: Number, default: 10 }
  },
  {
    timestamps: { createdAt: false, updatedAt: 'updated_at' }
  }
);

const Settings =
  mongoose.models.Settings ||
  mongoose.model('Settings', settingsSchema);

module.exports = Settings;
