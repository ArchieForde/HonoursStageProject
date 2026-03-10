import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #1e1b4b, #2e1065, #1a1a2e)" }}>
        <div className="text-purple-300 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
