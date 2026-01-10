import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isDoctor = user.role === 'doctor'
  const isNurse = user.role === 'nurse';
  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-purple-600 text-white shadow-lg shadow-purple-200" 
      : "text-gray-600 hover:bg-purple-50 hover:text-purple-600";
  };

  const MenuItem = ({ to, label, icon }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive(to)}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-teal-400 rounded-lg shadow-sm"></div>
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Klinik App</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        
        
        <MenuItem 
          to="/" 
          label="Dashboard" 
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          } 
        />

        
        <MenuItem 
          to="/patients" 
          label="Data Pasien" 
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } 
        />

        
        <MenuItem 
          to="/visits" 
          label="Kunjungan" 
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          } 
        />

        
        {isDoctor && (
          <MenuItem 
            to="/staff-management" 
            label="Manajemen Perawat" 
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            } 
          />
        )}

        
        <MenuItem 
          to="/profile" 
          label="Edit Profile" 
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          } 
        />
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-xs text-purple-600 font-semibold uppercase mb-1">Status Sistem</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-gray-600 font-medium">Online & Terhubung</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}