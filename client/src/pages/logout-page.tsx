import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();
  
  // Trigger logout as soon as this page loads
  useEffect(() => {
    console.log("Logout page mounted, triggering Firebase signOut");
    
    const performLogout = async () => {
      try {
        await signOut();
        // Clear local storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Hard redirect to enhanced auth page with a slight delay
        setTimeout(() => {
          const timestamp = Date.now();
          window.location.href = `/auth-enhanced?t=${timestamp}`;
        }, 1000);
      } catch (error) {
        console.error("Logout error:", error);
        // Even on error, redirect to auth page
        setTimeout(() => {
          const timestamp = Date.now();
          window.location.href = `/auth-enhanced?t=${timestamp}`;
        }, 1000);
      }
    };
    
    performLogout();
  }, [signOut]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Logging Out</h1>
        <p className="text-neutral-600 mb-4">
          Please wait while we complete the logout process...
        </p>
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full animate-pulse" style={{ width: '75%' }}></div>
        </div>
        <p className="text-sm text-neutral-500 mt-4">
          You will be redirected to the login page momentarily.
        </p>
      </div>
    </div>
  );
}