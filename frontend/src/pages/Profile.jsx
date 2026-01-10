import { useState, useEffect } from "react";
import api from "../services/api";
import Toast from "../components/Toast";
import EditProfileConfirmationModal from "../components/EditProfileConfirmationModal";

export default function Profile() {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setName(user.name);
      setUserRole(user.role);
    }
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (newPassword) {
      if (!currentPassword) {
        showToast("Mohon isi password lama untuk konfirmasi.", "error");
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast("Konfirmasi password tidak cocok!", "error");
        return;
      }
      if (newPassword.length < 6) {
        showToast("Password baru minimal 6 karakter.", "error");
        return;
      }
    }
    setIsConfirmModalOpen(true);
  };

  const performUpdate = async () => {
    setLoading(true);
    try {
      const payload = { name };
      
      if (newPassword) {
        payload.password = currentPassword;
        payload.newPassword = newPassword;
      }

      const response = await api.put("/user/profile", payload);
      
      const updatedUser = { ...JSON.parse(localStorage.getItem("user")), name: response.data.data.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      showToast("Profile berhasil diperbarui!", "success");
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setIsConfirmModalOpen(false);
      setTimeout(() => window.location.reload(), 1000); 

    } catch (err) {
      const msg = err.response?.data?.message || "Gagal update profile";
      showToast(msg, "error");
      setIsConfirmModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({...toast, show: false})} />}

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-2xl">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
            <p className="text-gray-500 uppercase text-sm font-semibold tracking-wide">{userRole}</p>
          </div>
        </div>

        <form onSubmit={handlePreSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Ganti Password (Opsional)</h3>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium">
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>

            <div className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password Lama <span className="text-xs text-gray-400">(Wajib jika ganti password)</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Masukkan password saat ini"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Password Baru</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Kosongkan jika tidak ingin mengganti"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {newPassword && (
                <div className="animate-fade-in-down">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Konfirmasi Password Baru</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 ${
                      confirmPassword && newPassword !== confirmPassword ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Ketik ulang password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Password tidak cocok.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition shadow-lg"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>

      <EditProfileConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={performUpdate}
        isLoading={loading}
        isPasswordChanging={newPassword.length > 0}
      />
    </div>
  );
}