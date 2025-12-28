import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-xl font-bold text-green-400">
        EMS Dashboard
      </h1>

      {/* Links */}
      <div className="flex items-center gap-6">
        {user?.role === "admin" && (
          <>
            <Link
              to="/admin"
              className="hover:text-green-400 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className="hover:text-green-400 transition"
            >
              Settings
            </Link>
          </>
        )}

        {user?.role === "employee" && (
          <Link
            to="/employee"
            className="hover:text-green-400 transition"
          >
            Dashboard
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
