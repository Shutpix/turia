const Settings = require('../models/Settings');

/* ------------------ GET SETTINGS ------------------ */
const getSettings = async (req, res) => {
  try {
    // Single settings document
    const settings = await Settings.findOne();

    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------ UPDATE SETTINGS ------------------ */
const updateSettings = async (req, res) => {
  try {
    const { business_hours_start, grace_period_minutes } = req.body;

    const updated = await Settings.findOneAndUpdate(
      {},
      {
        business_hours_start,
        grace_period_minutes
      },
      {
        new: true,
        upsert: true // ensures settings always exist
      }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
