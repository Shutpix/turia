'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white text-xl">⏰</span>
              </div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Attendance System
              </h1>
            </Link>
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/"
                className={`inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">📊</span>
                Dashboard
              </Link>
              <Link
                href="/attendance"
                className={`inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/attendance')
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">✅</span>
                Punch In/Out
              </Link>
              <Link
                href="/records"
                className={`inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/records')
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">📋</span>
                Records
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
