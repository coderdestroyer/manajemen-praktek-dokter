import { useState, useEffect } from "react";

const FIELD_LABELS = {
  medicalRecordNumber: "No. Rekam Medis",
  name: "Nama Lengkap",
  gender: "Jenis Kelamin",
  birthDate: "Tanggal Lahir",
  address: "Alamat",
  phone: "No. Telepon",
  bloodType: "Golongan Darah"
};

export default function PatientModal({ isOpen, onClose, onSubmit, initialData, existingPatients = [] }) {
  
  const [formData, setFormData] = useState({
    medicalRecordNumber: "", name: "", gender: "L", birthDate: "",
    address: "", phone: "", bloodType: ""
  });

  const [errors, setErrors] = useState({});
  
  const [isReviewing, setIsReviewing] = useState(false);
  const [changedFields, setChangedFields] = useState([]);

  const generateNextMRN = () => {
    if (!existingPatients || existingPatients.length === 0) return "MR-001";
    const numbers = existingPatients.map((p) => {
      const parts = p.medicalRecordNumber.split("-");
      return parts.length === 2 ? parseInt(parts[1]) : 0;
    });
    const maxNumber = Math.max(...numbers);
    return `MR-${String(maxNumber + 1).padStart(3, "0")}`;
  };

  useEffect(() => {
    setErrors({});
    setIsReviewing(false);
    setChangedFields([]);

    if (initialData) {
      const formattedDate = initialData.birthDate
        ? new Date(initialData.birthDate).toISOString().split("T")[0]
        : "";
      setFormData({ ...initialData, birthDate: formattedDate });
    } else if (isOpen) {
      setFormData({
        medicalRecordNumber: generateNextMRN(),
        name: "", gender: "L", birthDate: "", address: "", phone: "", bloodType: ""
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const checkChanges = () => {
    if (!initialData) return [];

    const changes = [];
    const formattedInitialDate = initialData.birthDate
      ? new Date(initialData.birthDate).toISOString().split("T")[0]
      : "";

    // Bandingkan setiap key
    Object.keys(formData).forEach((key) => {
      if (['createdAt', 'updatedAt', '_id', '__v'].includes(key)) return;

      let oldVal = initialData[key] || "";
      let newVal = formData[key] || "";

      // Khusus Tanggal
      if (key === 'birthDate') oldVal = formattedInitialDate;

      if (String(oldVal) !== String(newVal)) {
        changes.push({
          field: key,
          label: FIELD_LABELS[key] || key,
          old: oldVal,
          new: newVal
        });
      }
    });

    return changes;
  };

  const validateForm = () => {
    const newErrors = {};
    const { phone } = formData;
    if (phone && phone.trim() !== "") {
      if (!phone.startsWith("08")) newErrors.phone = "Harus diawali '08'.";
      else if (phone.length < 10 || phone.length > 13) newErrors.phone = "Panjang 10-13 digit.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (initialData) {
      const changes = checkChanges();
      if (changes.length === 0) {
        alert("Tidak ada data yang diubah.");
        onClose();
        return;
      }
      setChangedFields(changes);
      setIsReviewing(true);
    } else {
      onSubmit(formData);
    }
  };

  const handleFinalSubmit = () => {
    onSubmit(formData);
    setIsReviewing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/30 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className={`px-6 py-4 flex justify-between items-center ${isReviewing ? 'bg-orange-500' : 'bg-gradient-to-r from-blue-600 to-blue-500'}`}>
          <h2 className="text-xl font-bold text-white">
            {isReviewing ? "Konfirmasi Perubahan" : (initialData ? "Edit Pasien" : "Tambah Pasien")}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white font-bold text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isReviewing ? (
            <div className="space-y-4">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                <p className="text-sm text-orange-700">
                  Anda akan mengubah data pasien berikut. Pastikan data sudah benar.
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Field</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase text-red-500">Sebelum</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase text-green-600">Sesudah</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {changedFields.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.label}</td>
                        <td className="px-4 py-2 text-sm text-red-500 line-through decoration-red-500/50">{item.old || "-"}</td>
                        <td className="px-4 py-2 text-sm text-green-600 font-semibold">{item.new}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsReviewing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Kembali Edit
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition shadow-lg font-medium"
                >
                  Konfirmasi Simpan
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">No. Rekam Medis</label>
                  <input type="text" name="medicalRecordNumber" required value={formData.medicalRecordNumber} readOnly className="mt-1 block w-full border bg-gray-100 rounded-md p-2 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Jenis Kelamin</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Tanggal Lahir</label>
                  <input type="date" name="birthDate" required value={formData.birthDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">No. Telepon</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} maxLength={14} className={`mt-1 block w-full border rounded-md p-2 ${errors.phone ? "border-red-500" : "border-gray-300"}`} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Golongan Darah</label>
                  <select name="bloodType" value={formData.bloodType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    <option value="">- Pilih -</option>
                    <option value="A">A</option> <option value="B">B</option> <option value="AB">AB</option> <option value="O">O</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Alamat</label>
                <textarea name="address" rows="3" value={formData.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Batal</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg font-medium">
                  {initialData ? "Lanjut Review" : "Simpan Data"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}