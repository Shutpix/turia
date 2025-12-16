'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    total_employees: 0,
    present_today: 0,
    on_time_count: 0,
    late_count: 0,
    attendance_rate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (filterType) => {
    const today = new Date().toISOString().split('T')[0];
    let newFilters = { date: today };

    switch (filterType) {
      case 'present':
        newFilters = { date: today };
        break;
      case 'on-time':
        newFilters = { date: today, punctuality_status: 'on-time' };
        break;
      case 'late':
        newFilters = { date: today, punctuality_status: 'late' };
        break;
      default:
        newFilters = {};
    }

    const params = new URLSearchParams(newFilters).toString();
    window.location.href = `/records?${params}`;
  };

  const cards = [
    {
      title: 'Total Employees',
      value: analytics.total_employees,
      icon: '👥',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      onClick: null,
      description: 'Registered employees',
    },
    {
      title: 'Present Today',
      value: analytics.present_today,
      icon: '✅',
      gradient: 'from-emerald-500 to-green-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-green-700',
      onClick: () => handleCardClick('present'),
      description: 'Employees present today',
    },
    {
      title: 'On-Time',
      value: analytics.on_time_count,
      icon: '⏰',
      gradient: 'from-teal-500 to-cyan-600',
      hoverGradient: 'hover:from-teal-600 hover:to-cyan-700',
      onClick: () => handleCardClick('on-time'),
      description: 'On-time arrivals',
    },
    {
      title: 'Late',
      value: analytics.late_count,
      icon: '⚠️',
      gradient: 'from-red-500 to-rose-600',
      hoverGradient: 'hover:from-red-600 hover:to-rose-700',
      onClick: () => handleCardClick('late'),
      description: 'Late arrivals',
    },
    {
      title: 'Attendance Rate',
      value: `${analytics.attendance_rate}%`,
      icon: '📈',
      gradient: 'from-purple-500 to-indigo-600',
      hoverGradient: 'hover:from-purple-600 hover:to-indigo-700',
      onClick: null,
      description: 'Today\'s attendance rate',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-12">
      {/* Header Section */}
      <div className="mb-10 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600 font-normal">
          Real-time overview of today's attendance metrics
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6 mb-10 sm:mb-12">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className={`bg-linear-to-br ${card.gradient} ${card.onClick ? 'cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl' : ''} ${card.hoverGradient} rounded-2xl shadow-lg p-6 sm:p-7 text-white relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl">{card.icon}</span>
                {card.onClick && (
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">
                    Click to view
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-2 tracking-wide uppercase">
                {card.title}
              </h3>
              <p className="text-4xl sm:text-5xl font-bold mb-2 leading-none">
                {card.value}
              </p>
              <p className="text-xs opacity-80 font-normal">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-3 text-2xl">⚡</span>
            Quick Actions
          </h3>
          <div className="flex flex-col gap-4">
            <Link
              href="/attendance"
              className="flex items-center justify-center px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium text-base"
            >
              <span className="mr-2 text-lg">✅</span>
              Punch In/Out
            </Link>
            <Link
              href="/records"
              className="flex items-center justify-center px-6 py-4 bg-linear-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium text-base"
            >
              <span className="mr-2 text-lg">📋</span>
              View All Records
            </Link>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-3 text-2xl">ℹ️</span>
            Business Hours
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Start Time:</span>
              <span className="font-semibold text-gray-900 text-lg">9:00 AM</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Grace Period:</span>
              <span className="font-semibold text-gray-900 text-lg">10 minutes</span>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-emerald-600">On-time:</span>
                <span className="ml-2">9:00 AM - 9:10 AM</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-red-600">Late:</span>
                <span className="ml-2">After 9:10 AM</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
