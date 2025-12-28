import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function CreateEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.post("/employees", form);

      alert("Employee created successfully ✅");
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create New Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Employee ID */}
          <input
            name="employeeId"
            placeholder="Employee ID (EMP001)"
            value={form.employeeId}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-emerald-600 text-white
                       font-semibold hover:bg-emerald-700 transition
                       disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </form>

        {/* Back */}
        <button
          onClick={() => navigate("/admin")}
          className="mt-6 w-full text-sm text-slate-400 hover:text-white transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
