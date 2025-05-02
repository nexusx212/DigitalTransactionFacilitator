import { useContext } from "react";
import { AppContext } from "@/context/app-context";
import { Redirect, Route } from "wouter";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  path: string;
  component: () => React.JSX.Element;
};

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useContext(AppContext);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}