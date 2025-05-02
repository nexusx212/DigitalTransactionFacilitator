import { createContext, ReactNode, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

// Define types
export type User = {
  id: string;
  name: string;
  email: string;
  username?: string;
  photoUrl?: string;
};

type AppContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
};

// Create context with default values
export const AppContext = createContext<AppContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ id: '', name: '', email: '' }),
  register: async () => ({ id: '', name: '', email: '' }),
  logout: () => {},
  updateUser: () => {},
  selectedLanguage: 'en',
  setSelectedLanguage: () => {},
  isOfflineMode: false,
  toggleOfflineMode: () => {},
});

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // For demo purposes, we'll use a default user while implementing proper auth
  // In a production app, we would use localStorage and a proper auth system
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to fetch the current user
        const response = await apiRequest('GET', '/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        // If error, user is not authenticated
        console.log('Not authenticated');
      } finally {
        // For demo purposes, we'll simulate a logged-in user
        // Remove this in a production environment
        if (!user) {
          setUser({
            id: 'user-1',
            name: 'Sarah Johnson',
            email: 'sarah@company.com',
            username: 'sarahj',
            photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
          });
        }
        
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  const login = async (username: string, password: string): Promise<User> => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error('Login failed');
    }
  };
  
  const register = async (userData: any): Promise<User> => {
    try {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      const newUser = await response.json();
      return newUser;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };
  
  const logout = () => {
    // In a real app, we would call an API endpoint to invalidate the session
    setUser(null);
  };
  
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };
  
  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
  };
  
  // Value to be provided to consumers
  const contextValue: AppContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    selectedLanguage,
    setSelectedLanguage,
    isOfflineMode,
    toggleOfflineMode,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
