import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEmployee from "./pages/CreateEmployee";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./auth/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Login />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-employee"
            element={
              <ProtectedRoute role="admin">
                <CreateEmployee />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute role="admin">
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
