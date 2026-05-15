import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { PageTransition } from "@/components/PageTransition";
import { AnimatePresence } from "framer-motion";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { BottomNavigation } from "@/components/pwa/BottomNavigation";
import { MobileHeader } from "@/components/pwa/MobileHeader";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        {isMobile && <MobileHeader />}
        
        {/* Desktop Header */}
        {!isMobile && (
          <header className="h-14 border-b border-border/50 px-4 md:px-6 flex items-center justify-end bg-card/30 backdrop-blur-sm">
            <NotificationsDropdown />
          </header>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 overflow-auto ${isMobile ? 'pb-20' : ''}`}>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
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
