import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import i18n from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

type I18nContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
  languages: { code: string; name: string; flag: string }[];
};

const I18nContext = createContext<I18nContextType | null>(null);

// Available languages
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇪🇬' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lang: string) => {
    // Save to localStorage
    localStorage.setItem('i18nextLng', lang);
    
    // Change language in i18next
    i18n.changeLanguage(lang).then(() => {
      setLanguage(lang);
      // Trigger document lang attribute change
      document.documentElement.lang = lang;
      // Handle RTL languages
      if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
      } else {
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('rtl');
      }
    });
  };

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang && savedLang !== language) {
      changeLanguage(savedLang);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t, languages }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};