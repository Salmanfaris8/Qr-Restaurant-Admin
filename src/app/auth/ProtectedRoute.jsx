import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const admin = localStorage.getItem("admin");
      const expiresAt = localStorage.getItem("token_expires_at");

      if (!token || !admin || !expiresAt) {
        setIsAuthenticated(false);
        return;
      }

      if (new Date() > new Date(expiresAt)) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        localStorage.removeItem("token_expires_at");
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;