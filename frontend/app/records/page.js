'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { getAttendanceRecords } from '@/lib/api';

function RecordsContent() {
  const searchParams = useSearchParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: searchParams.get('date') || '',
    employee_name: searchParams.get('employee_name') || '',
    punctuality_status: searchParams.get('punctuality_status') || '',
  });
  const [selectedDate, setSelectedDate] = useState(
    filters.date ? new Date(filters.date) : null
  );

  useEffect(() => {
    fetchRecords();
  }, [filters]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceRecords(filters);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFilters({
      ...filters,
      date: date ? format(date, 'yyyy-MM-dd') : '',
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      employee_name: '',
      punctuality_status: '',
    });
    setSelectedDate(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'on-time': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'late': 'bg-red-100 text-red-800 border-red-200',
      'early': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-12">
      {/* Header Section */}
      <div className="mb-10 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          Attendance Records
        </h1>
        <p className="text-lg text-gray-600 font-normal">
          View and filter attendance records
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-gray-200/50">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-3 text-xl">🔍</span>Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
              placeholderText="Select date"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Employee Name</label>
            <input
              type="text"
              value={filters.employee_name}
              onChange={(e) => handleFilterChange('employee_name', e.target.value)}
              placeholder="Search by name"
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Punctuality Status</label>
            <select
              value={filters.punctuality_status}
              onChange={(e) => handleFilterChange('punctuality_status', e.target.value)}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
            >
              <option value="">All</option>
              <option value="on-time">On-Time</option>
              <option value="late">Late</option>
              <option value="early">Early</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold text-base"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200/50">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading records...</p>
            </div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-7xl mb-6">📭</div>
            <p className="text-gray-600 text-xl font-semibold mb-2">No records found</p>
            <p className="text-gray-500 text-base">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Punch In
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Punch Out
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className={`hover:bg-blue-50/50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{record.date}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{record.employee_name}</div>
                      <div className="text-sm text-gray-500 font-normal">{record.employee_email}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-mono font-semibold text-gray-900">
                        {record.punch_in_time || <span className="text-gray-400 font-normal">-</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-mono font-semibold text-gray-900">
                        {record.punch_out_time || <span className="text-gray-400 font-normal">-</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {record.total_hours ? (
                          <>
                            {record.total_hours} <span className="text-gray-500 text-xs font-normal">hrs</span>
                          </>
                        ) : (
                          <span className="text-gray-400 font-normal">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      {record.punctuality_status ? (
                        <span
                          className={`inline-block px-4 py-2 rounded-lg text-xs font-bold border-2 uppercase tracking-wide ${getStatusBadge(
                            record.punctuality_status
                          )}`}
                        >
                          {record.punctuality_status}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-normal">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {records.length > 0 && (
          <div className="bg-gray-50/80 px-8 py-5 border-t border-gray-200">
            <p className="text-sm text-gray-600 font-medium">
              Showing <span className="font-bold text-gray-900">{records.length}</span> record{records.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecordsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    }>
      <RecordsContent />
    </Suspense>
  );
}
