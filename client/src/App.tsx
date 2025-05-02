import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import TradeFinance from "@/pages/trade-finance";
import Marketplace from "@/pages/marketplace";
import Training from "@/pages/training";
import Wallet from "@/pages/wallet";
import Chat from "@/pages/chat";
import AuthPage from "@/pages/auth-page";
import { AppProvider } from "@/context/app-context";
import { lazy, Suspense, useEffect, useState, useContext } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import AvaAIAssistant from "@/components/ava-ai-assistant";
import { ProtectedRoute } from "@/lib/protected-route";

// Use lazy loading for potential route splitting in the future
const LazyDashboard = lazy(() => import("@/pages/dashboard"));
const LazyTradeFinance = lazy(() => import("@/pages/trade-finance"));
const LazyMarketplace = lazy(() => import("@/pages/marketplace"));
const LazyTraining = lazy(() => import("@/pages/training"));
const LazyWallet = lazy(() => import("@/pages/wallet"));
const LazyChat = lazy(() => import("@/pages/chat"));
const LazyAuthPage = lazy(() => import("@/pages/auth-page"));
const LazyBadgesDemo = lazy(() => import("@/pages/badges-demo"));
const LazyTradeManagement = lazy(() => import("@/pages/trade-management"));

// Loading indicator component
function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-68px)] w-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
          <span className="font-heading font-bold text-2xl">D</span>
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-medium text-neutral-800">Loading</h3>
          <p className="text-sm text-neutral-500">Please wait while we prepare your dashboard...</p>
        </div>
        <div className="w-48 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ width: '65%' }}></div>
        </div>
      </div>
    </div>
  );
}

function AppShell({ children, isAuthPage = false }: { children: React.ReactNode, isAuthPage?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Different layout for auth page
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-white">
        {isLoading ? <LoadingIndicator /> : children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          <div className="container mx-auto px-4 py-6">
            {isLoading ? <LoadingIndicator /> : children}
          </div>
        </main>
      </div>
      <MobileNav />
      <AvaAIAssistant />
    </div>
  );
}

function App() {
  const [location] = useLocation();
  const isAuthPage = location === '/auth';

  // Register service worker for PWA capabilities
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered: ', registration);
          })
          .catch(error => {
            console.log('Service Worker registration failed: ', error);
          });
      });
    }
  }, []);

  // Router component inside App to access location
  const Router = () => (
    <Switch>
      <ProtectedRoute path="/" component={LazyDashboard} />
      <ProtectedRoute path="/trade-finance" component={LazyTradeFinance} />
      <ProtectedRoute path="/marketplace" component={LazyMarketplace} />
      <ProtectedRoute path="/training" component={LazyTraining} />
      <ProtectedRoute path="/wallet" component={LazyWallet} />
      <ProtectedRoute path="/chat/:id" component={LazyChat} />
      <ProtectedRoute path="/badges" component={LazyBadgesDemo} />
      <ProtectedRoute path="/trade-management" component={LazyTradeManagement} />
      <Route path="/auth" component={LazyAuthPage} />
      <Route component={NotFound} />
    </Switch>
  );

  return (
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <AppShell isAuthPage={isAuthPage}>
          <Suspense fallback={<LoadingIndicator />}>
            <Router />
          </Suspense>
        </AppShell>
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
