import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle, logOut } from "@/lib/firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type UserRole = "exporter" | "buyer" | "logistics_provider" | "financier" | "agent" | "admin";

export interface AuthUser {
  id: number;
  firebaseUid: string;
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
  createdAt: Date;
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: User | null;
  loading: boolean;
  error: Error | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useFirebaseAuth() {
  if (auth) {
    return useAuthState(auth);
  }
  return [null, false, null] as const;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, loading, error] = useFirebaseAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const queryClient = useQueryClient();

  // If Firebase is not configured, provide a demo user for development
  const isFirebaseConfigured = !!auth;

  // Demo user for when Firebase is not configured
  const demoUser: AuthUser = {
    id: 1,
    firebaseUid: "demo-user-uid",
    username: "demo_user", 
    name: "Demo User",
    email: "demo@example.com",
    role: "exporter" as UserRole,
    language: "en",
    country: "US",
    phoneNumber: "+1234567890",
    twoFactorEnabled: false,
    kycStatus: "pending",
    kybStatus: "pending",
    createdAt: new Date()
  };

  // For demo mode, set user immediately
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUser(demoUser);
    }
  }, [isFirebaseConfigured]);

  // Fetch user data from our backend when Firebase user is available
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user", firebaseUser?.uid || "demo"],
    queryFn: async () => {
      if (!isFirebaseConfigured) return demoUser;
      if (!firebaseUser?.uid) return null;
      const response = await fetch(`/api/user/${firebaseUser.uid}`);
      if (!response.ok) {
        if (response.status === 404) return null; // User doesn't exist yet
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
    enabled: !!firebaseUser,
    retry: false,
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async (role: UserRole) => {
      const response = await fetch("/api/user/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error("Failed to update role");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  useEffect(() => {
    if (firebaseUser && !userLoading) {
      if (userData) {
        setUser(userData as AuthUser);
      } else {
        // Create user in our backend if doesn't exist
        createUserMutation.mutate({
          firebaseUid: firebaseUser.uid,
          username: firebaseUser.email?.split("@")[0] || firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email || "User",
          email: firebaseUser.email || "",
          photoUrl: firebaseUser.photoURL || null,
          role: "buyer", // Default role
          language: "en",
        });
      }
    } else if (!firebaseUser) {
      setUser(null);
    }
  }, [firebaseUser, userData, userLoading]);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const signOut = async () => {
    try {
      await logOut();
      setUser(null);
      queryClient.clear();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const updateUserRole = async (role: UserRole) => {
    await updateRoleMutation.mutateAsync(role);
  };

  const value = {
    user,
    firebaseUser: firebaseUser || null,
    loading: loading || userLoading || createUserMutation.isPending,
    error: error || createUserMutation.error || updateRoleMutation.error,
    signIn,
    signOut,
    updateUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}