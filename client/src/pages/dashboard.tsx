import { useAuth } from "@/context/auth-context";
import { MainDashboard } from "@/components/dashboards/main-dashboard";
import { BuyerDashboard } from "@/components/dashboards/buyer-dashboard";
import { ExporterDashboard } from "@/components/dashboards/exporter-dashboard";
import { FinancierDashboard } from "@/components/dashboards/financier-dashboard";
import { LogisticsDashboard } from "@/components/dashboards/logistics-dashboard";
import { AgentDashboard } from "@/components/dashboards/agent-dashboard";
import AuthLoginPage from "@/pages/auth-login";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthLoginPage />;
  }

  // Route to appropriate dashboard based on user role
  const userRole = user.userType || user.role || 'buyer';
  
  switch (userRole.toLowerCase()) {
    case 'buyer':
      return <BuyerDashboard />;
    case 'exporter':
    case 'seller':
      return <ExporterDashboard />;
    case 'financier':
    case 'finance':
      return <FinancierDashboard />;
    case 'logistics':
    case 'shipping':
      return <LogisticsDashboard />;
    case 'agent':
      return <AgentDashboard />;
    default:
      return <MainDashboard />;
  }
}