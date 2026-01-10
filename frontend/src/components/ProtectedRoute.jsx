export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
    return null;
  }
  return children;
}
