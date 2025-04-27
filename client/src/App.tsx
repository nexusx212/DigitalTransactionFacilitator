import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import TradeFinance from "@/pages/trade-finance";
import Marketplace from "@/pages/marketplace";
import Training from "@/pages/training";
import Wallet from "@/pages/wallet";
import { AppProvider } from "@/context/app-context";
import { lazy, Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import AvaAIAssistant from "@/components/ava-ai-assistant";

// Use lazy loading for potential route splitting in the future
const LazyDashboard = lazy(() => import("@/pages/dashboard"));
const LazyTradeFinance = lazy(() => import("@/pages/trade-finance"));
const LazyMarketplace = lazy(() => import("@/pages/marketplace"));
const LazyTraining = lazy(() => import("@/pages/training"));
const LazyWallet = lazy(() => import("@/pages/wallet"));

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
        <Header />
        <div className="px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <MobileNav />
      <AvaAIAssistant />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/trade-finance" component={TradeFinance} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/training" component={Training} />
      <Route path="/wallet" component={Wallet} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <AppShell>
          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <Router />
          </Suspense>
        </AppShell>
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
