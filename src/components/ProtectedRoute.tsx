import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "brand" | "influencer" | "admin";
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but trying to access admin without being admin
  if (requiredRole === "admin" && !isAdmin) {
    console.warn("User attempted to access admin route without admin role");
    return <Navigate to="/app/dashboard" replace />;
  }

  // If user has a specific role requirement but doesn't meet it
  if (requiredRole && profile?.role !== requiredRole && !isAdmin) {
    console.warn(`User attempted to access ${requiredRole} route but has role ${profile?.role}`);
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
};
