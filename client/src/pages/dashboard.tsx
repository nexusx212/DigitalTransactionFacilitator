import { useAuth } from "@/context/auth-context";
import { MainDashboard } from "@/components/dashboards/main-dashboard";
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

  return <MainDashboard />;
}