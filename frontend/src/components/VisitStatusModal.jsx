import React from "react";

export default function VisitStatusModal({ isOpen, onClose, onConfirm, data, isLoading }) {
  if (!isOpen || !data) return null;

  const { status, patientName } = data;

  const getConfig = () => {
    switch (status) {
      case "diperiksa":
        return {
          color: "blue",
          title: "Mulai Pemeriksaan",
          message: "Apakah pasien sudah masuk ke ruangan? Status akan diubah menjadi 'Sedang Diperiksa'.",
          btnLabel: "Ya, Mulai Periksa",
          icon: (
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          )
        };
      case "selesai":
        return {
          color: "green",
          title: "Selesaikan Kunjungan",
          message: "Pastikan semua tindakan medis dan resep sudah dicatat. Kunjungan ini akan ditandai selesai.",
          btnLabel: "Ya, Selesai",
          icon: (
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      default:
        return {
          color: "gray",
          title: "Ubah Status",
          message: "Konfirmasi perubahan status.",
          btnLabel: "Konfirmasi",
          icon: null
        };
    }
  };

  const config = getConfig();

  const bgIconClass = `bg-${config.color}-100`;
  const btnClass = `bg-${config.color}-600 hover:bg-${config.color}-700 focus:ring-${config.color}-500`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-gray-100">
        
        <div className="p-6">
          <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${bgIconClass} mb-5`}>
            {config.icon}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {config.title}
            </h3>
            
            <div className="bg-gray-50 py-2 px-3 rounded-lg mb-4 inline-block border border-gray-200">
              <p className="text-sm text-gray-500">Pasien:</p>
              <p className="font-semibold text-gray-800 text-base">{patientName}</p>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {config.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
            >
              Batal
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg transition-all flex justify-center items-center ${btnClass}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                config.btnLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}