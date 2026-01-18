import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import Visits from "./pages/Visits";
import StaffManagement from "./pages/StaffManagement";
import Profile from "./pages/Profile";

// Komponen Layout Utama
const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (Fixed Position) */}
      <Sidebar />

      <div className="flex-1 flex flex-col w-full md:ml-64 transition-all duration-300">
        
        {/* Navbar */}
        <Navbar />

        {/* Area Konten Halaman */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

// Protected Route (Cek Login)
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <MainLayout /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Semua halaman yang butuh Sidebar & Navbar masuk ke sini */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}