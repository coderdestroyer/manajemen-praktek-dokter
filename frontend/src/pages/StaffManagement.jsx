import { useState, useEffect } from "react";
import api from "../services/api";
import Toast from "../components/Toast";
import ConfirmationModal from "../components/ConfirmationModal";

export default function StaffManagement() {
  const ITEMS_PER_PAGE = 10;

  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ name: "", username: "", password: "" });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const fetchNurses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/nurses");
      if (response.data.success) {
        setNurses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching nurses:", err);
      showToast("Gagal mengambil data perawat.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredNurses = nurses.filter((nurse) => {
    const term = searchTerm.toLowerCase();
    return (
      nurse.name.toLowerCase().includes(term) ||
      nurse.username.toLowerCase().includes(term)
    );
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentNurses = filteredNurses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNurses.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", username: "", password: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (nurse) => {
    setIsEditMode(true);
    setSelectedId(nurse._id);
    setFormData({ 
      name: nurse.name, 
      username: nurse.username, 
      password: "" 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        (!isEditMode && formData.password.length < 6) || 
        (isEditMode && formData.password && formData.password.length < 6)
    ) {
        showToast("Password harus memiliki minimal 6 karakter.", "error");
        return;
    }

    try {
      if (isEditMode) {
        await api.put(`/user/${selectedId}`, formData);
        showToast("Data perawat berhasil diperbarui!", "success");
      } else {
        await api.post("/user/staff", formData);
        showToast("Perawat berhasil ditambahkan!", "success");
      }
      setIsModalOpen(false);
      fetchNurses();
    } catch (err) {
      const msg = err.response?.data?.message || "Terjadi kesalahan.";
      showToast(msg, "error");
    }
  };

  const handleDeleteClick = (nurse) => {
    setUserToDelete(nurse);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/user/${userToDelete._id}`);
      showToast("Staff berhasil dihapus.", "success");
      setNurses(prev => prev.filter(n => n._id !== userToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      showToast("Gagal menghapus perawat.", "error");
    }
  };

  return (
    <div className="space-y-6 relative">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({...toast, show: false})} />}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Perawat</h1>
          <p className="text-gray-500 mt-1">Total: {filteredNurses.length} perawat</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Tambah Perawat
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari Nama atau Username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">No</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama Lengkap</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Memuat data...</td></tr>
            ) : currentNurses.length > 0 ? (
              currentNurses.map((nurse, index) => (
                <tr key={nurse._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{nurse.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {nurse.username}
                     </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      Nurse
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => openEditModal(nurse)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(nurse)}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">Data tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredNurses.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center bg-white p-4 border rounded-lg shadow-sm">
          <span className="text-sm text-gray-700">
            Menampilkan <span className="font-semibold">{indexOfFirstItem + 1}</span> sampai <span className="font-semibold">{Math.min(indexOfLastItem, filteredNurses.length)}</span> dari <span className="font-semibold">{filteredNurses.length}</span> data
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
            <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {isEditMode ? "Edit Staff" : "Tambah Staff Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white font-bold text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {isEditMode ? "Password Baru (Opsional)" : "Password"}
                </label>
                <input
                  type="password"
                  required={!isEditMode}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder={isEditMode ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Batal</button>
                <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 shadow-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Staff?"
        message={`Apakah Anda yakin ingin menghapus akun nurse "${userToDelete?.name}"?`}
      />
    </div>
  );
}