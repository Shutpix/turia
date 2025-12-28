

import { useEffect, useState } from "react";
import api from "../api/api";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.name) {
        setEmployeeName(decoded.name);
      } else {
        setEmployeeName("Employee");
      }
    }
  }, []);

  /* -------- Live Clock -------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const punchIn = async () => {
    try {
      setLoading(true);
      const res = await api.post("/attendance/punch-in");
      setStatus(res.data.status || "PUNCHED_IN");
      alert("Punched In Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Punch In Failed");
    } finally {
      setLoading(false);
    }
  };

  const punchOut = async () => {
    try {
      setLoading(true);
      await api.post("/attendance/punch-out");
      setStatus("PUNCHED_OUT");
      alert("Punched Out Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Punch Out Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800">
        
        {/* Employee Name */}
        <h2 className="text-2xl font-bold text-white text-center">
          Welcome, {employeeName} 👋
        </h2>

        {/* Live Date & Time */}
        <p className="text-center text-slate-400 text-sm mt-2 mb-6">
          {currentTime.toLocaleDateString()} ·{" "}
          {currentTime.toLocaleTimeString()}
        </p>

        {/* Status Badge */}
        {status && (
          <div className="flex justify-center mb-6">
            <span
              className={`px-5 py-2 rounded-full text-sm font-semibold border
                ${
                  status === "ON_TIME"
                    ? "bg-green-500/15 text-green-400 border-green-500/30"
                    : status === "LATE"
                    ? "bg-red-500/15 text-red-400 border-red-500/30"
                    : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                }`}
            >
              Status: {status}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={punchIn}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold
                       hover:bg-emerald-700 transition disabled:opacity-50"
          >
            Punch In
          </button>

          <button
            onClick={punchOut}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-600 text-white font-semibold
                       hover:bg-rose-700 transition disabled:opacity-50"
          >
            Punch Out
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Attendance recorded in real time
        </p>
      </div>
    </div>
  );
}

