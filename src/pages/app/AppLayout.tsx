import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border/50 px-6 flex items-center justify-end bg-card/30 backdrop-blur-sm">
          <NotificationsDropdown />
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function RedirectToDashboard() {
  return <Navigate to="/app/dashboard" replace />;
}
