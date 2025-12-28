import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]); // attendance today
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0); // 👈 NEW
  const navigate = useNavigate();

  useEffect(() => {
    // 1️⃣ Attendance for today
    api.get("/admin/attendance/today").then((res) => {
      setEmployees(res.data.employees || []);
      setTotalPresent(res.data.totalPresent || 0);
    });

    // 2️⃣ Total employees (users table)
    api.get("/employees").then((res) => {
      setTotalEmployees(res.data.length);
    });
  }, []);

  const lateToday = employees.filter(
    (e) => e.status === "LATE"
  ).length;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Employee Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Admin Dashboard
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/create-employee")}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold
                     hover:bg-indigo-700 transition"
        >
          ➕ Create New Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Employees"
          value={totalEmployees} // ✅ FIXED
          color="blue"
        />
        <StatCard
          title="Total Present"
          value={totalPresent}
          color="green"
        />
        <StatCard
          title="Late Today"
          value={lateToday}
          color="purple"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-slate-300">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Employee ID</th>
              <th className="px-6 py-4 text-left">Punch In</th>
              <th className="px-6 py-4 text-left">Punch Out</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-slate-400"
                >
                  No attendance records for today
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.employee_id}
                  className="border-t border-slate-700 hover:bg-slate-700/40 transition"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {emp.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {emp.employee_id}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {emp.punch_in
                      ? new Date(emp.punch_in).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {emp.punch_out
                      ? new Date(emp.punch_out).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={emp.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-500/15 text-blue-400",
    green: "bg-green-500/15 text-green-400",
    purple: "bg-purple-500/15 text-purple-400",
  };

  return (
    <div className={`rounded-xl p-6 ${colors[color]} shadow-md`}>
      <p className="text-sm text-slate-300">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    ON_TIME: "bg-green-500/20 text-green-400",
    LATE: "bg-red-500/20 text-red-400",
    PRESENT: "bg-blue-500/20 text-blue-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || "bg-slate-600 text-slate-200"
      }`}
    >
      {status}
    </span>
  );
}
