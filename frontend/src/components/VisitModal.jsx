import { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function VisitModal({ isOpen, onClose, onSubmit }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]); 
  const [loadingData, setLoadingData] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    patient: "", 
    doctor: "", 
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const resPatients = await api.get("/patient");
          setPatients(resPatients.data.data);
          setFilteredPatients(resPatients.data.data);

          try {
            const resDoctors = await api.get("/user/doctors");
            setDoctors(resDoctors.data.data);
          } catch (e) {
            console.error("Gagal mengambil data dokter:", e);
            setDoctors([]);
          }

        } catch (err) {
          console.error("Gagal memuat data:", err);
        } finally {
          setLoadingData(false);
        }
      };
      
      fetchData();
      
      setFormData({ patient: "", doctor: "" });
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!patients) return;
    const results = patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPatient = (patient) => {
    setFormData({ ...formData, patient: patient._id });
    setSearchTerm(`${patient.medicalRecordNumber} - ${patient.name}`);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setFormData({ ...formData, patient: "" });
    setIsDropdownOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patient) {
      alert("Silakan pilih pasien dari daftar.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/30 backdrop-blur-md transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-transform">
        
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Daftar Kunjungan Baru</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white font-bold text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cari Pasien</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full border rounded-md p-2 pl-3 pr-10 focus:ring-purple-500 focus:border-purple-500 ${!formData.patient && searchTerm ? 'border-amber-500' : 'border-gray-300'}`}
                placeholder="Ketik Nama atau No. RM..."
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownOpen(true)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                {searchTerm ? (
                   <span onClick={() => { setSearchTerm(""); setFormData({...formData, patient: ""}); setIsDropdownOpen(true); }} className="text-gray-400 hover:text-gray-600 font-bold">&times;</span>
                ) : (
                   <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                )}
              </div>
            </div>

            {formData.patient && <p className="text-xs text-green-600 mt-1">✓ Pasien terpilih</p>}

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {loadingData ? (
                  <div className="p-3 text-center text-sm text-gray-500">Memuat data...</div>
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => handleSelectPatient(p)}
                      className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-bold text-gray-800 text-sm">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.medicalRecordNumber}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500">Pasien tidak ditemukan.</div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Dokter</label>
            <select
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
            >
              <option value="">-- Cari Dokter --</option>
              {doctors.length > 0 ? (
                doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))
              ) : (
                <option disabled>Tidak ada data dokter</option>
              )}
            </select>
            {doctors.length === 0 && !loadingData && (
               <p className="text-xs text-red-400 mt-1">*Data dokter kosong. Pastikan ada user role 'doctor'.</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!formData.patient || !formData.doctor}
              className={`px-6 py-2 text-white rounded-lg shadow-lg font-medium transition ${
                !formData.patient || !formData.doctor 
                  ? 'bg-purple-300 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}