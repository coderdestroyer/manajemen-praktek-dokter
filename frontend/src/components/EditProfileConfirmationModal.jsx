import React from "react";

export default function EditProfileConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading, 
  isPasswordChanging 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-gray-100">
        
        <div className="p-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-5 border-4 border-teal-50">
            <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div className="absolute ml-8 mt-8 bg-green-500 rounded-full p-1 border-2 border-white">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Simpan Perubahan?
            </h3>
            
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Data profile Anda akan diperbarui di sistem. Pastikan data yang dimasukkan sudah benar.
            </p>

            {isPasswordChanging && (
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-4 text-left flex gap-3">
                <div className="shrink-0 text-orange-500 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-800">Password Diubah</p>
                  <p className="text-[11px] text-orange-600 leading-tight">
                    Anda akan menggunakan password baru pada login berikutnya.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
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
              className="w-full px-4 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg shadow-teal-200 transition-all flex justify-center items-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Ya, Simpan"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}