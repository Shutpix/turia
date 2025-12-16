// Helper function to calculate punctuality
function calculatePunctuality(punchInTime, businessHoursStart, gracePeriodMinutes) {
  const [punchHour, punchMin] = punchInTime.split(':').map(Number);
  const [businessHour, businessMin] = businessHoursStart.split(':').map(Number);
  
  const punchMinutes = punchHour * 60 + punchMin;
  const businessMinutes = businessHour * 60 + businessMin;
  const graceMinutes = gracePeriodMinutes;
  
  if (punchMinutes < businessMinutes) {
    return 'early';
  } else if (punchMinutes <= businessMinutes + graceMinutes) {
    return 'on-time';
  } else {
    return 'late';
  }
}

// Helper function to calculate total hours
function calculateTotalHours(punchIn, punchOut) {
  if (!punchIn || !punchOut) return null;
  
  const [inHour, inMin] = punchIn.split(':').map(Number);
  const [outHour, outMin] = punchOut.split(':').map(Number);
  
  const inMinutes = inHour * 60 + inMin;
  const outMinutes = outHour * 60 + outMin;
  
  const totalMinutes = outMinutes - inMinutes;
  return (totalMinutes / 60).toFixed(2);
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Get current time in HH:MM format
function getCurrentTime() {
  return new Date().toTimeString().split(' ')[0].substring(0, 5);
}

module.exports = {
  calculatePunctuality,
  calculateTotalHours,
  getCurrentDate,
  getCurrentTime,
};

