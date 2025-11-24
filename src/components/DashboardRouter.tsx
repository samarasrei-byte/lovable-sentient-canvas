import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/pages/app/Dashboard";
import InfluencerDashboard from "@/pages/app/influencer/Dashboard";
import { Loader2 } from "lucide-react";

export const DashboardRouter = () => {
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

  // Render dashboard based on role
  if (userRole === "influencer") {
    return <InfluencerDashboard />;
  }

  // Default to brand dashboard
  return <Dashboard />;
};
