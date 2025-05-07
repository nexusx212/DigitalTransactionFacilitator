import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Request and response types
type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  name: string;
  email: string;
  company?: string;
  country?: string;
  role?: "importer" | "exporter" | "both";
};

type AuthResponse = {
  message: string;
};

// Auth context type
type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<AuthResponse, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation<SelectUser, Error, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation<SelectUser, Error, RegisterData>({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome to DTFS, ${user.name}!`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation<AuthResponse, Error, void>({
    mutationFn: async () => {
      try {
        // Try to log out using the API
        await fetch("/api/logout", {
          method: "POST",
          credentials: "include"
        });
        
        // Even if the API doesn't respond as expected, we'll perform client-side logout
        return { success: true, message: "Logged out" };
      } catch (error) {
        // If there's a network error, still return success
        console.warn("Server logout failed, continuing with client-side cleanup");
        return { success: true, message: "Client-side logout" };
      } finally {
        // Forcibly delete the cookie no matter what happens with the request
        document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Force clear any localStorage values that might be related to auth
        localStorage.clear();
        
        // Clear session storage too
        sessionStorage.clear();
      }
    },
    onSuccess: () => {
      // Hard reset React Query state
      queryClient.clear();
      queryClient.resetQueries();
      
      // Explicitly remove user data
      queryClient.setQueryData(["/api/user"], null);
      
      // Show a toast
      toast({
        title: "Logged out",
        description: "Redirecting to login page...",
      });
      
      // FORCE a hard redirect to login page - this is the most reliable way
      // to ensure all state is cleared and the user is truly logged out
      window.location.replace("/auth");
    },
    onError: () => {
      // Even on error, still perform the client-side logout
      queryClient.clear();
      queryClient.resetQueries();
      queryClient.setQueryData(["/api/user"], null);
      
      // Force clear any cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
      });
      
      // Force clear storages
      localStorage.clear();
      sessionStorage.clear();
      
      toast({
        title: "Logging out...",
        description: "Redirecting to login page",
      });
      
      // Hard redirect
      window.location.replace("/auth");
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}