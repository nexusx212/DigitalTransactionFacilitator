import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  en: {
    translation: {
      // General
      "app.name": "Digital Trade Finance System",
      "app.tagline": "A cutting-edge platform connecting African businesses to global markets",
      "app.cta.finance": "Apply for Finance",
      "app.cta.marketplace": "Explore Marketplace",
      
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.tradeFinance": "Trade Finance",
      "nav.marketplace": "Marketplace",
      "nav.training": "Training",
      "nav.wallet": "Wallet",
      "nav.profile": "Profile",
      "nav.settings": "Settings",
      "nav.help": "Help & Support",
      
      // Trade Finance
      "finance.title": "Trade Finance",
      "finance.subtitle": "Quick access to financing through smart-contract approvals",
      "finance.apply": "Apply for Invoice Financing",
      "finance.upload": "Upload your invoice to get instant financing through our smart contract system",
      "finance.amount": "Invoice Amount",
      "finance.dueDate": "Invoice Due Date",
      "finance.uploadInvoice": "Upload Invoice",
      "finance.submit": "Submit for Approval",
      "finance.active": "Active Finance Contracts",
      
      // Marketplace
      "marketplace.title": "B2B Marketplace",
      "marketplace.subtitle": "Discover products and services from verified suppliers",
      "marketplace.search": "Search products...",
      "marketplace.allCategories": "All Categories",
      "marketplace.contactSupplier": "Contact Supplier",
      "marketplace.verified": "Verified",
      "marketplace.minOrder": "Min. Order",
      
      // Training
      "training.title": "Import/Export Training",
      "training.subtitle": "Interactive courses to build your trade expertise",
      "training.allCourses": "View All Courses",
      "training.progress": "Progress",
      "training.duration": "Duration",
      "training.certificate": "Certificate",
      "training.startCourse": "Start Course",
      "training.continueLearning": "Continue Learning",
      
      // Wallet
      "wallet.title": "Digital Wallet",
      "wallet.subtitle": "Manage your PADC stablecoin and make cross-border payments",
      "wallet.balance": "Balance",
      "wallet.transactions": "Recent Transactions",
      "wallet.send": "Send",
      "wallet.receive": "Receive",
      "wallet.papss": "Pay with PAPSS",
      "wallet.papss.description": "Make quick cross-border payments using the Pan-African Payment and Settlement System.",
      
      // Ava AI Assistant
      "ava.title": "Ava AI Assistant",
      "ava.welcome": "Hello! I'm Ava, your AI assistant. How can I help you with trade finance or marketplace questions today?",
      "ava.placeholder": "Type your question...",
    }
  },
  fr: {
    translation: {
      // General
      "app.name": "Système Numérique de Financement du Commerce",
      "app.tagline": "Une plateforme de pointe reliant les entreprises africaines aux marchés mondiaux",
      "app.cta.finance": "Demander un Financement",
      "app.cta.marketplace": "Explorer le Marché",
      
      // Navigation
      "nav.dashboard": "Tableau de Bord",
      "nav.tradeFinance": "Financement Commercial",
      "nav.marketplace": "Marché",
      "nav.training": "Formation",
      "nav.wallet": "Portefeuille",
      "nav.profile": "Profil",
      "nav.settings": "Paramètres",
      "nav.help": "Aide & Support",
      
      // Trade Finance
      "finance.title": "Financement Commercial",
      "finance.subtitle": "Accès rapide au financement grâce aux approbations par contrats intelligents",
      "finance.apply": "Demander un Financement de Facture",
      "finance.upload": "Téléchargez votre facture pour obtenir un financement instantané via notre système de contrat intelligent",
      "finance.amount": "Montant de la Facture",
      "finance.dueDate": "Date d'Échéance",
      "finance.uploadInvoice": "Télécharger la Facture",
      "finance.submit": "Soumettre pour Approbation",
      "finance.active": "Contrats de Financement Actifs",
      
      // More translations for other sections...
    }
  },
  sw: {
    translation: {
      // Swahili translations
      "app.name": "Mfumo wa Kidijitali wa Fedha za Biashara",
      // Add more Swahili translations...
    }
  },
  ar: {
    translation: {
      // Arabic translations
      "app.name": "نظام تمويل التجارة الرقمي",
      // Add more Arabic translations...
    }
  },
  ha: {
    translation: {
      // Hausa translations
      "app.name": "Tsarin Kuɗin Ciniki na Dijital",
      // Add more Hausa translations...
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
