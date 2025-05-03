import { createContext, ReactNode, useState } from 'react';

type AppContextType = {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
};

// Create context with default values
export const AppContext = createContext<AppContextType>({
  selectedLanguage: 'en',
  setSelectedLanguage: () => {},
  isOfflineMode: false,
  toggleOfflineMode: () => {},
});

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
  };
  
  // Value to be provided to consumers
  const contextValue: AppContextType = {
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