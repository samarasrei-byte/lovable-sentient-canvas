import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { BottomNavigation } from "@/components/pwa/BottomNavigation";
import { MobileHeader } from "@/components/pwa/MobileHeader";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        {isMobile && <MobileHeader />}
        
        {/* Desktop Header */}
        {!isMobile && (
          <header className="h-14 border-b border-border/50 px-6 flex items-center justify-end bg-card/30 backdrop-blur-sm">
            <NotificationsDropdown />
          </header>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 overflow-auto ${isMobile ? 'pb-20' : ''}`}>
          <Outlet />
        </main>
        
        {/* Mobile Bottom Navigation */}
        {isMobile && <BottomNavigation />}
      </div>

      {/* PWA Components */}
      <InstallPrompt />
      <UpdatePrompt />
    </div>
  );
}

export function RedirectToDashboard() {
  return <Navigate to="/app/dashboard" replace />;
}
