import { useEffect, useState } from "react";
import api from "../services/api";
import Toast from "../components/Toast";
import VisitModal from "../components/VisitModal";
import VisitStatusModal from "../components/VisitStatusModal";

export default function Visits() {
  const ITEMS_PER_PAGE = 10; 

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE SEARCH & FILTER ---
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusData, setStatusData] = useState({ id: null, status: null, patientName: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")); 
  const isNurse = user?.role === 'nurse';
  const isDoctor = user?.role === 'doctor';

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/visit/today?date=${filterDate}`); 
      if (response.data.success) {
        setVisits(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching visits:", err);
      setError("Gagal mengambil data kunjungan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterDate, searchTerm]);
  
  const filteredVisits = visits.filter((visit) => {
    const term = searchTerm.toLowerCase();
    const patientName = visit.patient?.name?.toLowerCase() || "";
    const patientMR = visit.patient?.medicalRecordNumber?.toLowerCase() || "";
    const doctorName = visit.doctor?.name?.toLowerCase() || "";
    
    return patientName.includes(term) || patientMR.includes(term) || doctorName.includes(term);
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentVisits = filteredVisits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVisits.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreateVisit = async (formData) => {
    try {
      const payload = {
        patient: formData.patient,
        doctor: formData.doctor,
        nurse: user ? user._id : null,
        visitDate: new Date()
      };

      await api.post("/visit", payload);
      showToast("Kunjungan berhasil didaftarkan!", "success");
      setIsModalOpen(false);
      
      setFilterDate(new Date().toISOString().split('T')[0]);
      fetchVisits(); 
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal membuat kunjungan.";
      showToast(msg, "error");
    }
  };

  const initiateStatusUpdate = (visit, newStatus) => {
    setStatusData({ 
      id: visit._id, 
      status: newStatus, 
      patientName: visit.patient?.name || "Pasien Tanpa Nama"
    });
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    const { id, status } = statusData;
    if (!id || !status) return;

    try {
      setIsUpdating(true);
      await api.put(`/visit/${id}/status`, { status });
      showToast(`Status berhasil diubah`, "success");
      fetchVisits(); 
      setIsStatusModalOpen(false);
      setStatusData({ id: null, status: null, patientName: "" });
    } catch (err) {
      const msg = err.response?.status === 403 ? "Akses ditolak." : "Gagal mengubah status.";
      showToast(msg, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "menunggu": return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 shadow-sm">Menunggu</span>;
      case "diperiksa": return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 animate-pulse">Diperiksa</span>;
      case "selesai": return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Selesai</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Unknown</span>;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat antrian...</div>;

  return (
    <div className="space-y-6 relative">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Kunjungan</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola antrian pasien.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Pasien / Dokter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-full md:w-64"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
          />

          {isNurse && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow transition flex items-center justify-center gap-2"
            >
              <span>+</span> Baru
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Antrian</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pasien</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dokter</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentVisits.length > 0 ? (
                currentVisits.map((visit) => (
                  <tr key={visit._id} className={`transition duration-150 ${visit.status === 'diperiksa' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center"><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg border border-purple-200">{visit.queueNumber}</div></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{visit.patient?.name}</div>
                      <div className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-1 rounded mt-1">{visit.patient?.medicalRecordNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">dr. {visit.doctor?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(visit.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {isDoctor ? (
                        <>
                          {visit.status === 'menunggu' && (
                            <button onClick={() => initiateStatusUpdate(visit, 'diperiksa')} className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 shadow-sm transition text-xs uppercase tracking-wide font-bold">Mulai Periksa</button>
                          )}
                          {visit.status === 'diperiksa' && (
                            <button onClick={() => initiateStatusUpdate(visit, 'selesai')} className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 shadow-sm transition text-xs uppercase tracking-wide font-bold">Selesaikan</button>
                          )}
                        </>
                      ) : (
                        visit.status !== 'selesai' && <span className="text-xs text-gray-400 italic">Menunggu Dokter</span>
                      )}
                      {visit.status === 'selesai' && (
                        <div className="flex flex-col">
                          <span className="text-gray-400 italic text-xs">Selesai</span>
                          <span className="text-gray-300 text-[10px]">{new Date(visit.updatedAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-50 p-4 rounded-full mb-3">
                         <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <p className="text-gray-500 text-lg font-medium">Tidak ada data kunjungan.</p>
                      <p className="text-gray-400 text-sm mt-1">{searchTerm ? "Coba kata kunci lain." : "Belum ada antrian pada tanggal ini."}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredVisits.length > ITEMS_PER_PAGE && (
          <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-700">
              Menampilkan <span className="font-semibold">{indexOfFirstItem + 1}</span> - <span className="font-semibold">{Math.min(indexOfLastItem, filteredVisits.length)}</span> dari <span className="font-semibold">{filteredVisits.length}</span> data
            </span>
            
            <nav className="inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                &larr;
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                &rarr;
              </button>
            </nav>
          </div>
        )}
      </div>

      <VisitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateVisit} />
      <VisitStatusModal isOpen={isStatusModalOpen} onClose={() => { setIsStatusModalOpen(false); setStatusData({ id: null, status: null, patientName: "" }); }} onConfirm={handleConfirmStatusUpdate} data={statusData} isLoading={isUpdating} />
    </div>
  );
}