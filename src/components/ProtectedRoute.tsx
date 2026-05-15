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

  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
