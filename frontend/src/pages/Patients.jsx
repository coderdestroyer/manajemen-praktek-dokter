import { useEffect, useState } from "react";
import api from "../services/api";
import PatientModal from "../components/PatientModal";
import PatientDetailModal from "../components/PatientDetailModal";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";

export default function Patients() {
  const ITEMS_PER_PAGE = 10;

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/patient");
      setPatients(response.data.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Gagal mengambil data pasien.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterGender]);

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(term) ||
      patient.medicalRecordNumber.toLowerCase().includes(term);
    const matchesGender = filterGender === "" || patient.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddClick = () => { setEditingPatient(null); setIsModalOpen(true); };
  const handleEditClick = (p) => { setEditingPatient(p); setIsModalOpen(true); };
  const handleDetailClick = (p) => { setSelectedPatient(p); setIsDetailOpen(true); };
  const handleDeleteClick = (id, name) => { setPatientToDelete({ id, name }); setIsDeleteModalOpen(true); };

  const handleSave = async (formData) => {
    try {
      if (editingPatient) {
        await api.put(`/patient/${editingPatient._id}`, formData);
        showToast("Data berhasil diperbarui!", "success");
      } else {
        await api.post("/patient", formData);
        showToast("Pasien baru ditambahkan!", "success");
      }
      setIsModalOpen(false);
      fetchPatients();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan.";
      showToast(`Gagal: ${msg}`, "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/patient/${patientToDelete.id}`);
      setPatients((prev) => prev.filter((p) => p._id !== patientToDelete.id));
      showToast("Data berhasil dihapus.", "success");
      setIsDeleteModalOpen(false);
      setPatientToDelete(null);
    } catch (err) {
      showToast("Gagal menghapus data.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateAge = (date) => {
    if (!date) return "-";
    const diff = Date.now() - new Date(date).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6 relative">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Data Pasien</h1>
          <p className="text-gray-500 mt-1">Total: {filteredPatients.length} data</p>
        </div>
        <button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow flex items-center gap-2">
          <span>+</span> Tambah Pasien
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari Nama atau No. RM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="w-full md:w-48">
          <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="block w-full px-3 py-2 border rounded-md">
            <option value="">Semua Gender</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">No. RM</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Umur</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">No. HP</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Alamat</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPatients.length > 0 ? (
              currentPatients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{patient.medicalRecordNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    <div className="text-xs text-gray-500">{formatDate(patient.birthDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${patient.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                      {patient.gender === 'L' ? 'L' : 'P'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{calculateAge(patient.birthDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{patient.address || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => handleDetailClick(patient)} className="text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-md">Detail</button>
                    <button onClick={() => handleEditClick(patient)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md">Edit</button>
                    <button onClick={() => handleDeleteClick(patient._id, patient.name)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md">Hapus</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500 italic">Data tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredPatients.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center bg-white p-4 border rounded-lg shadow-sm">
          <span className="text-sm text-gray-700">
            Menampilkan <span className="font-semibold">{indexOfFirstItem + 1}</span> sampai <span className="font-semibold">{Math.min(indexOfLastItem, filteredPatients.length)}</span> dari <span className="font-semibold">{filteredPatients.length}</span> data
          </span>
          
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <span className="sr-only">Previous</span>
              &larr;
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === index + 1
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
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
              <span className="sr-only">Next</span>
              &rarr;
            </button>
          </nav>
        </div>
      )}

      <PatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={editingPatient} existingPatients={patients} />
      <PatientDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} patient={selectedPatient} />
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title="Hapus Pasien?" message={`Hapus data "${patientToDelete?.name}"?`} isLoading={isDeleting} />
    </div>
  );
}