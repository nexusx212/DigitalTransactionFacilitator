import { createContext, ReactNode, useState } from 'react';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
};

type AppContextType = {
  user: User;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
};

// Create context with default values
export const AppContext = createContext<AppContextType>({
  user: {
    id: '',
    name: '',
    email: '',
  },
  selectedLanguage: 'en',
  setSelectedLanguage: () => {},
  isOfflineMode: false,
  toggleOfflineMode: () => {},
});

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: 'user-1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
  });
  
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
  };
  
  // Value to be provided to consumers
  const contextValue: AppContextType = {
    user,
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
