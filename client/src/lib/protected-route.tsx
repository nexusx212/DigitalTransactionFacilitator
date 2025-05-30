import { useEffect } from "react";
import { Redirect, Route, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType<any>;
  permissions?: string[];
  adminOnly?: boolean;
};

export function ProtectedRoute({ 
  path, 
  component: Component, 
  permissions = [], 
  adminOnly = false
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check if the path has changed and user isn't authenticated after loading
  useEffect(() => {
    // Only redirect if we've finished loading and there's no user
    if (!isLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
  }, [path, user, isLoading, toast]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-neutral-600">Verifying your credentials...</p>
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth-enhanced" />
      </Route>
    );
  }

  // Note: For now we'll skip the admin-only and permissions check until 
  // we update our User type to include these fields
  
  /* 
  // Uncomment these checks when the User type includes role and permissions fields
  
  // Check for admin-only routes
  if (adminOnly && user.role !== "admin") {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-error/10 text-error p-6 rounded-lg max-w-md text-center">
            <span className="material-icons text-4xl mb-2">error_outline</span>
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="mb-4">You don't have permission to access this page. Administrator privileges are required.</p>
            <button
              onClick={() => setLocation("/")}
              className="bg-neutral-200 hover:bg-neutral-300 transition-colors px-4 py-2 rounded"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </Route>
    );
  }

  // Check for specific permissions
  if (permissions.length > 0) {
    // This is a placeholder for a more complex permissions system
    // In a real app, you would check if the user has the required permissions
    const hasPermissions = permissions.every(permission => 
      user.permissions?.includes(permission)
    );

    if (!hasPermissions) {
      return (
        <Route path={path}>
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-error/10 text-error p-6 rounded-lg max-w-md text-center">
              <span className="material-icons text-4xl mb-2">block</span>
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="mb-4">You don't have the necessary permissions to access this page.</p>
              <button
                onClick={() => setLocation("/")}
                className="bg-neutral-200 hover:bg-neutral-300 transition-colors px-4 py-2 rounded"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </Route>
      );
    }
  }
  */

  return <Route path={path} component={Component} />;
}