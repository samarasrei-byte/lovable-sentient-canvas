import { useAuth } from "@/hooks/use-auth";
import Dashboard from "@/pages/app/Dashboard";
import InfluencerDashboard from "@/pages/app/influencer/Dashboard";
import { Loader2 } from "lucide-react";

export const DashboardRouter = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render dashboard based on role
  if (profile?.role === "influencer") {
    return <InfluencerDashboard />;
  }

  // Default to brand dashboard
  return <Dashboard />;
};
