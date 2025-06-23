import { createContext, useContext, useEffect, useState } from "react";
import { User, signInWithGoogle, signInWithDummy, logOut, getCurrentUser } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [dummyUser, setDummyUser] = useState<User | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Demo user for dummy authentication
  const demoAuthUser: AuthUser = {
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

  // Initialize with demo user
  useEffect(() => {
    const currentDummyUser = getCurrentUser();
    if (currentDummyUser) {
      setDummyUser(currentDummyUser);
    } else {
      // Auto-sign in with first dummy user
      signInWithDummy(0).then(result => {
        setDummyUser(result.user);
      });
    }
  }, []);

  // Set auth user when dummy user changes
  useEffect(() => {
    if (dummyUser) {
      setUser({
        ...demoAuthUser,
        firebaseUid: dummyUser.uid,
        email: dummyUser.email,
        name: dummyUser.displayName,
      });
    } else {
      setUser(null);
    }
  }, [dummyUser]);

  const updateRoleMutation = useMutation({
    mutationFn: async (role: UserRole) => {
      // For dummy auth, just update local state
      if (user) {
        setUser({ ...user, role });
      }
      return { role };
    },
    onSuccess: () => {
      // No backend invalidation needed for dummy auth
    },
  });

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      setDummyUser(result.user);
    } catch (err: any) {
      console.error("Sign-in failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logOut();
      setDummyUser(null);
      setUser(null);
    } catch (err: any) {
      console.error("Sign-out failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (!user) throw new Error("No user to update");
    await updateRoleMutation.mutateAsync(role);
  };

  const contextValue: AuthContextType = {
    user,
    firebaseUser: dummyUser,
    loading: loading || updateRoleMutation.isPending,
    error: null,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateUserRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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