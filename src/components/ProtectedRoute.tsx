
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(auth);

    // Check role requirements if needed
    if (requiredRole) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userRole = userData?.role;
      setHasRequiredRole(userRole === requiredRole);
    } else {
      setHasRequiredRole(true);
    }

    setIsLoading(false);
  }, [requiredRole]);

  if (isLoading) {
    // Show loading state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-t-4 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRequiredRole) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
