import i18n from './i18n';

// List of supported languages
export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "ar", name: "العربية", flag: "🇪🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" }
];

// Function to get a flag emoji for a language code
export const getLanguageFlag = (code: string): string => {
  const language = supportedLanguages.find((lang) => lang.code === code);
  return language ? language.flag : "🌐";
};

// Function to get language name from code
export const getLanguageName = (code: string): string => {
  const language = supportedLanguages.find((lang) => lang.code === code);
  return language ? language.name : "Unknown";
};

/**
 * Simulated translation service - in a production app, this would use a
 * real translation API like Google Translate, DeepL, etc.
 * 
 * For the purpose of this demo, it'll return a simulated translation.
 */
export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<string> => {
  // Return original text if target language is the same as source language
  // or if the text is empty
  if (
    (sourceLanguage !== 'auto' && targetLanguage === sourceLanguage) ||
    !text ||
    !text.trim()
  ) {
    return text;
  }

  // For demo, simulate API call with timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would be an API call
      resolve(simulateTranslation(text, targetLanguage));
    }, 500);
  });
};

// Simple simulation of translations for demo purposes
const simulateTranslation = (text: string, targetLanguage: string): string => {
  // For demo purposes, we'll just add language-specific prefixes to show the translation is working
  switch (targetLanguage) {
    case 'fr':
      return `[FR] ${text}`;
    case 'sw':
      return `[SW] ${text}`;
    case 'ar':
      return `[AR] ${text}`;
    case 'ha':
      return `[HA] ${text}`;
    default:
      return text;
  }
};

// Handle changing the UI language
export const changeLanguage = (languageCode: string): void => {
  if (i18n.language !== languageCode) {
    i18n.changeLanguage(languageCode);
  }
};

export default {
  translateText,
  changeLanguage,
  supportedLanguages,
  getLanguageFlag,
  getLanguageName
};