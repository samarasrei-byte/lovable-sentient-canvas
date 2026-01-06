import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type User = {
  id: string;
  email?: string;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "brand" | "influencer" | "admin";
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      // Check if user is banned
      const { data: banData } = await supabase
        .from("bans")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (banData) {
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (requiredRole) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", requiredRole)
          .single();

        setHasAccess(!!roleData);
      } else {
        setHasAccess(true);
      }

      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAuth();
      } else {
        setUser(null);
        setHasAccess(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [requiredRole]);

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

  if (requiredRole && !hasAccess) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
