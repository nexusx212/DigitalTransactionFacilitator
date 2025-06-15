import { useAuth } from "@/context/auth-context";
import { MainDashboard } from "@/components/dashboards/main-dashboard";
import AuthLoginPage from "@/pages/auth-login";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthLoginPage />;
  }

  return <MainDashboard />;
}