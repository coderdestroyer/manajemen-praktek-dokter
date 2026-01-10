import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest", role: "guest" };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "doctor": return "bg-teal-100 text-teal-800 border-teal-200";
      case "nurse": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end items-center sticky top-0 z-40 shadow-sm">
        
        <div className="flex items-center gap-4">
          
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-800">
              {user.name}
            </div>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>

          <div 
            onClick={() => navigate('/profile')}
            className="h-10 w-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg shadow-sm cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
            title="Edit Profile"
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="h-6 w-px bg-gray-300 mx-1"></div>

          <button 
            onClick={handleLogoutClick}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
            title="Keluar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </nav>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari aplikasi?"
      />
    </>
  );
}