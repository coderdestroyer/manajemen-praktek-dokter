import React from "react";

export default function SupportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 transition-all border border-gray-100">
        
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md mb-3 shadow-inner">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">IT Support</h2>
          <p className="text-purple-100 text-sm">Bantuan Teknis & Kendala Sistem</p>
        </div>

        <div className="p-6 space-y-4">
          
          <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-green-50 hover:border-green-200 transition-colors cursor-pointer group">
            <div className="bg-white p-2 rounded-full shadow-sm text-green-500 group-hover:text-green-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">WhatsApp Admin</p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-gray-800 font-semibold text-sm hover:underline">
                +62 812-3456-7890
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group">
            <div className="bg-white p-2 rounded-full shadow-sm text-blue-500 group-hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Email Support</p>
              <a href="mailto:support@klinikapp.com" className="text-gray-800 font-semibold text-sm hover:underline">
                support@klinikapp.com
              </a>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              Jam Operasional IT: <br/>
              Senin - Jumat (08:00 - 17:00 WIB)
            </p>
          </div>

        </div>

        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-100 transition shadow-sm"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}