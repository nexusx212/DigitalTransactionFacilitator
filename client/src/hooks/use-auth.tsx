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
        const res = await apiRequest("POST", "/api/logout");
        return await res.json();
      } catch (error) {
        // Even if the API call fails, we should still clean up local state
        console.warn("Server logout failed, performing client-side cleanup only");
        
        // Return a fake success response so we can still redirect the user
        return { success: true, message: "Client-side logout" };
      }
    },
    onMutate: () => {
      // Immediately invalidate session cookie to prevent subsequent authenticated requests
      document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
    onSuccess: () => {
      // Explicitly set user to null to ensure UI updates immediately
      queryClient.setQueryData(["/api/user"], null);
      
      // Clear all query cache 
      queryClient.clear();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
        variant: "default",
      });
      
      // Force redirect to auth page with a slight delay to let toast appear
      setTimeout(() => {
        // Use window.location for a true page reload to clear any lingering state
        window.location.href = '/auth';
      }, 500);
    },
    onError: (error: Error) => {
      console.error("Logout error:", error);
      
      // Still set user to null even if logout fails - this ensures UI reacts correctly
      queryClient.setQueryData(["/api/user"], null);
      
      toast({
        title: "Logging out...",
        description: "Redirecting to login page",
        variant: "default",
      });
      
      // Force redirect to auth page even on error
      setTimeout(() => {
        window.location.href = '/auth';
      }, 1000);
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