import React from "react";

export default function PatientDetailModal({ isOpen, onClose, patient }) {
  if (!isOpen || !patient) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper Hitung Umur
  const calculateAge = (birthDateString) => {
    if (!birthDateString) return "-";
    const birthDate = new Date(birthDateString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/30 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
        
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📄 Detail Pasien
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white font-bold text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6 border-b pb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{patient.name}</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {patient.medicalRecordNumber}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            
            <DetailItem label="Jenis Kelamin" value={patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'} />
            <DetailItem label="Golongan Darah" value={patient.bloodType || "-"} />
            
            <DetailItem label="Tempat, Tanggal Lahir" value={formatDate(patient.birthDate)} />
            <DetailItem label="Umur" value={`${calculateAge(patient.birthDate)} Tahun`} />
            
            <DetailItem label="Nomor Telepon" value={patient.phone || "-"} />
            <DetailItem label="Alamat" value={patient.address || "-"} fullWidth />
            
            <DetailItem label="Terdaftar Pada" value={formatDate(patient.createdAt)} />
            <DetailItem label="Terakhir Diupdate" value={formatDate(patient.updatedAt)} />

          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, fullWidth = false }) {
  return (
    <div className={`${fullWidth ? "col-span-1 md:col-span-2" : ""}`}>
      <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800 font-medium text-base border-b border-gray-100 pb-1">{value}</p>
    </div>
  );
}