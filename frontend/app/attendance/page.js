'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getEmployees, punchIn, punchOut, getAttendanceStatus } from '@/lib/api';

const employeeSchema = yup.object().shape({
  employee_id: yup.number().required('Please select an employee'),
});

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(employeeSchema),
  });

  useEffect(() => {
    fetchEmployees();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendanceStatus(selectedEmployee);
      const interval = setInterval(() => fetchAttendanceStatus(selectedEmployee), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setMessage({ type: 'error', text: 'Failed to load employees' });
    }
  };

  const fetchAttendanceStatus = async (employeeId) => {
    try {
      const response = await getAttendanceStatus(employeeId);
      setAttendanceStatus(response.data);
    } catch (error) {
      console.error('Error fetching attendance status:', error);
    }
  };

  const handleEmployeeSelect = (e) => {
    const employeeId = parseInt(e.target.value);
    setSelectedEmployee(employeeId);
    if (employeeId) {
      fetchAttendanceStatus(employeeId);
    } else {
      setAttendanceStatus(null);
    }
  };

  const onPunchIn = async () => {
    if (!selectedEmployee) {
      setMessage({ type: 'error', text: 'Please select an employee' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await punchIn(selectedEmployee);
      setMessage({ type: 'success', text: response.data.message || 'Punched in successfully!' });
      fetchAttendanceStatus(selectedEmployee);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to punch in',
      });
    } finally {
      setLoading(false);
    }
  };

  const onPunchOut = async () => {
    if (!selectedEmployee) {
      setMessage({ type: 'error', text: 'Please select an employee' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await punchOut(selectedEmployee);
      setMessage({ type: 'success', text: response.data.message || 'Punched out successfully!' });
      fetchAttendanceStatus(selectedEmployee);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to punch out',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'on-time': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'late': 'bg-red-100 text-red-800 border-red-200',
      'early': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const canPunchIn = !attendanceStatus || !attendanceStatus.punch_in_time;
  const canPunchOut = attendanceStatus && attendanceStatus.punch_in_time && !attendanceStatus.punch_out_time;

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-12">
      {/* Header Section */}
      <div className="mb-10 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          Punch In/Out
        </h1>
        <p className="text-lg text-gray-600 font-normal">
          Record your attendance for today
        </p>
      </div>

      {/* Current Time Display */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wide">Current Time</p>
            <p className="text-5xl sm:text-6xl font-bold font-mono mb-2">{formatTime(currentTime)}</p>
            <p className="text-base opacity-80 font-normal">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-7xl sm:text-8xl opacity-80">🕐</div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-200/50">
        <form onSubmit={handleSubmit(() => {})}>
          <div className="mb-8">
            <label htmlFor="employee" className="block text-base font-semibold text-gray-900 mb-4">
              <span className="mr-2">👤</span>Select Employee
            </label>
            <select
              {...register('employee_id')}
              onChange={handleEmployeeSelect}
              className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all text-base font-medium"
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
            {errors.employee_id && (
              <p className="mt-3 text-sm text-red-600 flex items-center font-medium">
                <span className="mr-2">⚠️</span>
                {errors.employee_id.message}
              </p>
            )}
          </div>

          {message.text && (
            <div
              className={`mb-8 p-5 rounded-xl border-2 flex items-center ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <span className="mr-3 text-2xl">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-semibold text-base">{message.text}</span>
            </div>
          )}

          {attendanceStatus && attendanceStatus.punch_in_time && (
            <div className="mb-8 p-8 bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-2xl border-2 border-gray-200/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-xl">📊</span>Today's Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Punch In</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {attendanceStatus.punch_in_time}
                  </p>
                </div>
                {attendanceStatus.punch_out_time ? (
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Punch Out</p>
                    <p className="text-2xl font-bold text-gray-900 font-mono">
                      {attendanceStatus.punch_out_time}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-xl shadow-sm border-2 border-dashed border-gray-300">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Punch Out</p>
                    <p className="text-lg font-semibold text-gray-400">Not punched out</p>
                  </div>
                )}
                {attendanceStatus.punctuality_status && (
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Status</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-lg text-xs font-bold border-2 uppercase tracking-wide ${getStatusBadge(
                        attendanceStatus.punctuality_status
                      )}`}
                    >
                      {attendanceStatus.punctuality_status}
                    </span>
                  </div>
                )}
                {attendanceStatus.total_hours && (
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Total Hours</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {attendanceStatus.total_hours}
                      <span className="text-sm text-gray-500 ml-1 font-normal">hrs</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-5">
            <button
              type="button"
              onClick={onPunchIn}
              disabled={loading || !canPunchIn}
              className={`flex-1 px-8 py-5 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                canPunchIn
                  ? 'bg-linear-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transform hover:scale-[1.02] hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2 text-xl">✅</span>
                  Punch In
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onPunchOut}
              disabled={loading || !canPunchOut}
              className={`flex-1 px-8 py-5 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                canPunchOut
                  ? 'bg-linear-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 transform hover:scale-[1.02] hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2 text-xl">🚪</span>
                  Punch Out
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
