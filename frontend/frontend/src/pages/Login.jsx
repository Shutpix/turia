import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        employeeId,
        password,
      });

      login(res.data.token, res.data.role);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur
                   rounded-2xl shadow-2xl border border-slate-800 p-8"
      >
        {/* Logo / Title */}
        <h1 className="text-3xl font-extrabold text-white text-center">
          EMS Portal
        </h1>
        <p className="text-center text-slate-400 text-sm mt-2 mb-8">
          Employee Management System
        </p>

        {/* Employee ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Employee ID
          </label>
          <input
            type="text"
            placeholder="e.g. EMP001"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white
                       border border-slate-700 focus:outline-none
                       focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white
                       border border-slate-700 focus:outline-none
                       focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Login Button */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white
                     font-semibold hover:bg-indigo-700 transition
                     disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Secure access for employees & administrators
        </p>
      </form>
    </div>
  );
}
