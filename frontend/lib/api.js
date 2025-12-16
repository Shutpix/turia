import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employees
export const getEmployees = () => api.get('/employees');
export const createEmployee = (data) => api.post('/employees', data);

// Attendance
export const punchIn = (employeeId) => api.post('/attendance/punch-in', { employee_id: employeeId });
export const punchOut = (employeeId) => api.post('/attendance/punch-out', { employee_id: employeeId });
export const getAttendanceStatus = (employeeId) => api.get(`/attendance/status/${employeeId}`);
export const getAttendanceRecords = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.date) params.append('date', filters.date);
  if (filters.employee_name) params.append('employee_name', filters.employee_name);
  if (filters.punctuality_status) params.append('punctuality_status', filters.punctuality_status);
  return api.get(`/attendance?${params.toString()}`);
};

// Analytics
export const getAnalytics = () => api.get('/analytics');

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

export default api;

