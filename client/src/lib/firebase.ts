// Simple dummy authentication system
export interface DummyUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Simulate Firebase Auth interface for compatibility
export const auth = null;

// Dummy user data
const dummyUsers = [
  {
    uid: "demo-user-1",
    email: "demo@example.com",
    displayName: "Demo User",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
  },
  {
    uid: "exporter-user",
    email: "exporter@company.com", 
    displayName: "Export Manager",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=exporter"
  },
  {
    uid: "buyer-user",
    email: "buyer@company.com",
    displayName: "Procurement Lead",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=buyer"
  }
];

let currentUser: DummyUser | null = null;

// Mock authentication functions
export const signInWithGoogle = async () => {
  // Return a random demo user
  const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
  currentUser = randomUser;
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    user: currentUser,
    credential: null,
    operationType: "signIn"
  };
};

export const signInWithDummy = async (userIndex: number = 0) => {
  currentUser = dummyUsers[userIndex] || dummyUsers[0];
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    user: currentUser,
    credential: null,
    operationType: "signIn"
  };
};

export const logOut = async () => {
  currentUser = null;
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 200));
};

export const getCurrentUser = () => currentUser;

// Export for compatibility
export type User = DummyUser;