
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMobileFixes } from "./hooks/use-mobile-fixes";

const App = () => {
  const location = useLocation();
  
  // Apply mobile fixes hook
  useMobileFixes();

  // Show email verification notice for new signups
  useEffect(() => {
    if (location.pathname === '/signup' && location.search.includes('verified=pending')) {
      toast.info(
        "Please check your email", 
        { 
          description: "We've sent a verification link to your email address. Please click it to verify your account.",
          duration: 8000,
          position: 'top-center'
        }
      );
    }
  }, [location]);
  
  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fix viewport height issues on mobile
  useEffect(() => {
    const setVh = () => {
      // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Initialize and add event listener
    setVh();
    window.addEventListener('resize', setVh);

    // Clean up
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <TooltipProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen overflow-x-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <Outlet />
          </div>
          <Toaster />
          <SonnerToaster 
            position="bottom-right"
            theme="light"
            closeButton
          />
        </div>
      </AuthProvider>
    </TooltipProvider>
  );
};

export default App;
