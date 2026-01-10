import React from "react";

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">

      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform transition-all scale-100 border border-gray-100">
        
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {title || "Konfirmasi Hapus"}
          </h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {message || "Apakah Anda yakin ingin menghapus data ini?"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors"
          >
            Batal
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg shadow-red-200 transition-all flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Ya"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}