import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Perfil from "@/pages/app/Perfil";
import InfluencerPerfil from "@/pages/app/influencer/Perfil";
import { Loader2 } from "lucide-react";

export const PerfilRouter = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user has role in user_roles table
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setUserRole(roleData?.role || "brand"); // Default to brand if no role
    } catch (error) {
      console.error("Error checking user role:", error);
      setUserRole("brand"); // Default to brand on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render perfil based on role
  if (userRole === "influencer") {
    return <InfluencerPerfil />;
  }

  // Default to brand perfil
  return <Perfil />;
};
