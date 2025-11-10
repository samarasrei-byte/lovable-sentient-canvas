import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export function RedirectToDashboard() {
  return <Navigate to="/app/dashboard" replace />;
}
