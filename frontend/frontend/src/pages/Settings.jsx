import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [businessStartTime, setBusinessStartTime] = useState("");
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        setBusinessStartTime(res.data.business_start_time.slice(0, 5));
        setGracePeriodMinutes(res.data.grace_period_minutes);
      } catch {
        alert("Failed to load settings");
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");

      await api.put("/settings", {
        businessStartTime,
        gracePeriodMinutes: Number(gracePeriodMinutes),
      });

      setMessage("Settings updated successfully");

      // 🔥 Redirect after short delay
      setTimeout(() => {
        navigate("/admin");
      }, 800);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800">
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Attendance Settings
        </h2>
        <p className="text-center text-slate-400 text-sm mb-8">
          Configure business hours & grace period
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Business Start Time */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Business Start Time
            </label>
            <input
              type="time"
              value={businessStartTime}
              onChange={(e) => setBusinessStartTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white
                         border border-slate-700 focus:outline-none
                         focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Grace Period */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Grace Period (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={gracePeriodMinutes}
              onChange={(e) => setGracePeriodMinutes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white
                         border border-slate-700 focus:outline-none
                         focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold
                       hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Apply"}
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <p className="mt-6 text-center text-sm text-emerald-400 font-medium">
            {message} → Redirecting…
          </p>
        )}

        {/* Helper */}
        <p className="mt-8 text-xs text-slate-500 text-center">
          These settings affect punch-in status (ON_TIME / LATE)
        </p>
      </div>
    </div>
  );
}
