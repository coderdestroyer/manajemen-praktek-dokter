import { useEffect, useState } from "react";
import api from "../services/api";
import SupportModal from "../components/SupportModal";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [stats, setStats] = useState({
    totalPatients: 0,
    visitsToday: 0,
    pendingVisits: 0,
    completedVisits: 0
  });
  const [loading, setLoading] = useState(true);

  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const resPatients = await api.get("/patient");
        const totalPatients = resPatients.data.data ? resPatients.data.data.length : 0;

        const resVisits = await api.get("/visit/today");
        const visits = resVisits.data.data || [];
        
        const visitsToday = visits.length;
        const pendingVisits = visits.filter(v => v.status === 'menunggu' || v.status === 'diperiksa').length;
        const completedVisits = visits.filter(v => v.status === 'selesai').length;

        setStats({ totalPatients, visitsToday, pendingVisits, completedVisits });

      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 18) return "Selamat Siang";
    return "Selamat Malam";
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className={`p-4 rounded-full ${color} text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{loading ? "..." : value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-purple-100">
            Anda login sebagai <span className="font-bold uppercase bg-white/20 px-2 py-0.5 rounded text-sm">{user?.role}</span>. 
            Semoga harimu menyenangkan.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pasien" value={stats.totalPatients} color="bg-blue-500" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Kunjungan Hari Ini" value={stats.visitsToday} color="bg-purple-500" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        <StatCard title="Belum Selesai" value={stats.pendingVisits} color="bg-yellow-500" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Pasien Selesai" value={stats.completedVisits} color="bg-green-500" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Informasi Sistem</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between border-b pb-2"><span>Versi Aplikasi</span><span className="font-mono">v1.0.0</span></li>
            <li className="flex justify-between border-b pb-2"><span>Status Server</span><span className="text-green-600 font-bold">Online</span></li>
            <li className="flex justify-between border-b pb-2"><span>Tanggal</span><span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span></li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-3">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="font-bold text-gray-800">Butuh Bantuan?</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Hubungi admin IT jika terjadi kendala pada sistem.</p>
          
          <button 
            onClick={() => setIsSupportOpen(true)}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
          >
            Lihat Kontak Support &rarr;
          </button>
        </div>
      </div>

      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
}