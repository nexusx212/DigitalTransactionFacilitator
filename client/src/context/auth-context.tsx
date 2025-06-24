import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type UserRole = "exporter" | "buyer" | "logistics_provider" | "agent";

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: UserRole;
  language: string;
  country?: string;
  phoneNumber?: string;
  twoFactorEnabled: boolean;
  kycStatus: string;
  kybStatus: string;
  onboardingCompleted: boolean;
  gpsLocation?: any;
  preferredVoiceLanguage: string;
  accessibilityMode: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Fetch current user from session
  const { data: user, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const response = await fetch('/api/user', {
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          return null; // User not authenticated
        }
        throw new Error('Failed to fetch user');
      }
      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      refetch();
    },
  });

  const signOut = async () => {
    return signOutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error: error as Error | null,
      signOut,
      refetch
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}