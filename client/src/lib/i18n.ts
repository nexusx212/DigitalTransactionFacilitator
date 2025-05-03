import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      "app.name": "DTFS",
      "app.tagline": "Digital Trade Finance System",
      "app.loading": "Loading...",
      
      // Auth
      "auth.login": "Login",
      "auth.register": "Register",
      "auth.username": "Username",
      "auth.password": "Password",
      "auth.email": "Email",
      "auth.fullName": "Full Name",
      "auth.confirmPassword": "Confirm Password",
      "auth.createAccount": "Create Account",
      "auth.alreadyHaveAccount": "Already have an account?",
      "auth.dontHaveAccount": "Don't have an account?",
      "auth.registerNow": "Register now",
      "auth.signIn": "Sign In",
      "auth.forgotPassword": "Forgot Password",
      "auth.resetPassword": "Reset Password",
      
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.tradeFinance": "Trade Finance",
      "nav.marketplace": "Marketplace",
      "nav.training": "Training",
      "nav.wallet": "Wallet",
      "nav.chat": "Chat",
      "nav.profile": "Profile",
      "nav.settings": "Settings",
      "nav.help": "Help & Support",
      "nav.upgrade": "Upgrade",
      "nav.logout": "Logout",
      
      // Dashboard
      "dashboard.title": "Dashboard",
      "dashboard.welcomeBack": "Welcome back",
      "dashboard.overview": "Overview",
      "dashboard.recentActivity": "Recent Activity",
      "dashboard.quickStats": "Quick Stats",
      "dashboard.noActivity": "No recent activity",
      
      // Trade Finance
      "tradeFinance.title": "Trade Finance",
      "tradeFinance.createRequest": "Create Request",
      "tradeFinance.myRequests": "My Requests",
      "tradeFinance.invoices": "Invoices",
      "tradeFinance.factoring": "Factoring",
      "tradeFinance.exportFinance": "Export Finance",
      "tradeFinance.importFinance": "Import Finance",
      "tradeFinance.supplyChainFinance": "Supply Chain Finance",
      "tradeFinance.nonInterestFinance": "Non-Interest Finance",
      "tradeFinance.startupFinance": "Startup Trade Finance",
      
      // Marketplace
      "marketplace.title": "Marketplace",
      "marketplace.search": "Search products...",
      "marketplace.filters": "Filters",
      "marketplace.categories": "Categories",
      "marketplace.addProduct": "Add Product",
      "marketplace.myProducts": "My Products",
      "marketplace.featuredProducts": "Featured Products",
      
      // Wallet
      "wallet.title": "Wallet",
      "wallet.balance": "Balance",
      "wallet.deposit": "Deposit",
      "wallet.withdraw": "Withdraw",
      "wallet.transfer": "Transfer",
      "wallet.transactions": "Transactions",
      "wallet.padc": "PADC",
      
      // Profile
      "profile.title": "Profile",
      "profile.personalInfo": "Personal Information",
      "profile.documents": "Documents",
      "profile.verification": "Verification",
      "profile.saveChanges": "Save Changes",
      
      // Settings
      "settings.title": "Settings",
      "settings.general": "General",
      "settings.security": "Security",
      "settings.notifications": "Notifications",
      "settings.language": "Language",
      "settings.theme": "Theme",
      "settings.theme.light": "Light",
      "settings.theme.dark": "Dark",
      "settings.theme.system": "System",
      
      // Help & Support
      "help.title": "Help & Support",
      "help.faq": "FAQs",
      "help.contact": "Contact Us",
      "help.knowledgeBase": "Knowledge Base",
      "help.tutorials": "Tutorials",
      
      // Upgrade
      "upgrade.title": "Upgrade Your Plan",
      "upgrade.plans": "Plans",
      "upgrade.features": "Features",
      "upgrade.payment": "Payment",
      "upgrade.currentPlan": "Current Plan",
      "upgrade.basic": "Basic",
      "upgrade.professional": "Professional",
      "upgrade.enterprise": "Enterprise",
      
      // Buttons
      "button.submit": "Submit",
      "button.cancel": "Cancel",
      "button.save": "Save",
      "button.continue": "Continue",
      "button.back": "Back",
      "button.next": "Next",
      "button.confirm": "Confirm",
      "button.update": "Update",
      "button.delete": "Delete",
      
      // Messages
      "message.success": "Success",
      "message.error": "Error",
      "message.warning": "Warning",
      "message.info": "Information",
      "message.loading": "Loading",
      "message.saving": "Saving...",
      "message.processing": "Processing...",
      "message.pleaseWait": "Please wait..."
    }
  },
  fr: {
    translation: {
      // Common
      "app.name": "DTFS",
      "app.tagline": "Système Numérique de Financement du Commerce",
      "app.loading": "Chargement...",
      
      // Auth
      "auth.login": "Connexion",
      "auth.register": "S'inscrire",
      "auth.username": "Nom d'utilisateur",
      "auth.password": "Mot de passe",
      "auth.email": "E-mail",
      "auth.fullName": "Nom complet",
      "auth.confirmPassword": "Confirmer le mot de passe",
      "auth.createAccount": "Créer un compte",
      "auth.alreadyHaveAccount": "Vous avez déjà un compte?",
      "auth.dontHaveAccount": "Vous n'avez pas de compte?",
      "auth.registerNow": "S'inscrire maintenant",
      "auth.signIn": "Se connecter",
      "auth.forgotPassword": "Mot de passe oublié",
      "auth.resetPassword": "Réinitialiser le mot de passe",
      
      // Navigation
      "nav.dashboard": "Tableau de bord",
      "nav.tradeFinance": "Financement du commerce",
      "nav.marketplace": "Marché",
      "nav.training": "Formation",
      "nav.wallet": "Portefeuille",
      "nav.chat": "Chat",
      "nav.profile": "Profil",
      "nav.settings": "Paramètres",
      "nav.help": "Aide et support",
      "nav.upgrade": "Mettre à niveau",
      "nav.logout": "Déconnexion",
      
      // Dashboard
      "dashboard.title": "Tableau de bord",
      "dashboard.welcomeBack": "Bienvenue à nouveau",
      "dashboard.overview": "Aperçu",
      "dashboard.recentActivity": "Activité récente",
      "dashboard.quickStats": "Statistiques rapides",
      "dashboard.noActivity": "Aucune activité récente",
      
      // Trade Finance
      "tradeFinance.title": "Financement du commerce",
      "tradeFinance.createRequest": "Créer une demande",
      "tradeFinance.myRequests": "Mes demandes",
      "tradeFinance.invoices": "Factures",
      "tradeFinance.factoring": "Affacturage",
      "tradeFinance.exportFinance": "Financement à l'exportation",
      "tradeFinance.importFinance": "Financement à l'importation",
      "tradeFinance.supplyChainFinance": "Financement de la chaîne d'approvisionnement",
      "tradeFinance.nonInterestFinance": "Financement sans intérêt",
      "tradeFinance.startupFinance": "Financement de démarrage",
      
      // Buttons
      "button.submit": "Soumettre",
      "button.cancel": "Annuler",
      "button.save": "Enregistrer",
      "button.continue": "Continuer",
      "button.back": "Retour",
      "button.next": "Suivant",
      "button.confirm": "Confirmer",
      "button.update": "Mettre à jour",
      "button.delete": "Supprimer",
      
      // Messages
      "message.success": "Succès",
      "message.error": "Erreur",
      "message.warning": "Avertissement",
      "message.info": "Information",
      "message.loading": "Chargement",
      "message.saving": "Enregistrement...",
      "message.processing": "Traitement...",
      "message.pleaseWait": "Veuillez patienter..."
    }
  },
  ar: {
    translation: {
      // Common
      "app.name": "DTFS",
      "app.tagline": "نظام تمويل التجارة الرقمية",
      "app.loading": "جاري التحميل...",
      
      // Auth
      "auth.login": "تسجيل الدخول",
      "auth.register": "التسجيل",
      "auth.username": "اسم المستخدم",
      "auth.password": "كلمة المرور",
      "auth.email": "البريد الإلكتروني",
      "auth.fullName": "الاسم الكامل",
      "auth.confirmPassword": "تأكيد كلمة المرور",
      "auth.createAccount": "إنشاء حساب",
      "auth.alreadyHaveAccount": "لديك حساب بالفعل؟",
      "auth.dontHaveAccount": "ليس لديك حساب؟",
      "auth.registerNow": "سجل الآن",
      "auth.signIn": "تسجيل الدخول",
      "auth.forgotPassword": "نسيت كلمة المرور",
      "auth.resetPassword": "إعادة تعيين كلمة المرور",
      
      // Navigation
      "nav.dashboard": "لوحة التحكم",
      "nav.tradeFinance": "تمويل التجارة",
      "nav.marketplace": "السوق",
      "nav.training": "التدريب",
      "nav.wallet": "المحفظة",
      "nav.chat": "الدردشة",
      "nav.profile": "الملف الشخصي",
      "nav.settings": "الإعدادات",
      "nav.help": "المساعدة والدعم",
      "nav.upgrade": "الترقية",
      "nav.logout": "تسجيل الخروج",
      
      // Dashboard
      "dashboard.title": "لوحة التحكم",
      "dashboard.welcomeBack": "مرحبًا بعودتك",
      "dashboard.overview": "نظرة عامة",
      "dashboard.recentActivity": "النشاط الأخير",
      "dashboard.quickStats": "إحصائيات سريعة",
      "dashboard.noActivity": "لا يوجد نشاط حديث",
      
      // Buttons
      "button.submit": "إرسال",
      "button.cancel": "إلغاء",
      "button.save": "حفظ",
      "button.continue": "متابعة",
      "button.back": "رجوع",
      "button.next": "التالي",
      "button.confirm": "تأكيد",
      "button.update": "تحديث",
      "button.delete": "حذف",
      
      // Messages
      "message.success": "نجاح",
      "message.error": "خطأ",
      "message.warning": "تحذير",
      "message.info": "معلومات",
      "message.loading": "جاري التحميل",
      "message.saving": "جاري الحفظ...",
      "message.processing": "جاري المعالجة...",
      "message.pleaseWait": "يرجى الانتظار..."
    }
  },
  sw: {
    translation: {
      // Common
      "app.name": "DTFS",
      "app.tagline": "Mfumo wa Kidijitali wa Ufadhili wa Biashara",
      "app.loading": "Inapakia...",
      
      // Auth
      "auth.login": "Ingia",
      "auth.register": "Jiandikishe",
      "auth.username": "Jina la mtumiaji",
      "auth.password": "Nywila",
      "auth.email": "Barua pepe",
      "auth.fullName": "Jina kamili",
      "auth.confirmPassword": "Thibitisha nywila",
      "auth.createAccount": "Tengeneza akaunti",
      "auth.alreadyHaveAccount": "Una akaunti tayari?",
      "auth.dontHaveAccount": "Huna akaunti?",
      "auth.registerNow": "Jiandikishe sasa",
      "auth.signIn": "Ingia",
      "auth.forgotPassword": "Umesahau nywila",
      "auth.resetPassword": "Weka nywila upya",
      
      // Navigation
      "nav.dashboard": "Dashibodi",
      "nav.tradeFinance": "Ufadhili wa Biashara",
      "nav.marketplace": "Soko",
      "nav.training": "Mafunzo",
      "nav.wallet": "Pochi",
      "nav.chat": "Mazungumzo",
      "nav.profile": "Wasifu",
      "nav.settings": "Mipangilio",
      "nav.help": "Usaidizi",
      "nav.upgrade": "Boresha",
      "nav.logout": "Toka",
      
      // Buttons
      "button.submit": "Wasilisha",
      "button.cancel": "Ghairi",
      "button.save": "Hifadhi",
      "button.continue": "Endelea",
      "button.back": "Rudi",
      "button.next": "Ifuatayo",
      "button.confirm": "Thibitisha",
      "button.update": "Sasisha",
      "button.delete": "Futa",
      
      // Messages
      "message.success": "Mafanikio",
      "message.error": "Hitilafu",
      "message.warning": "Onyo",
      "message.info": "Taarifa",
      "message.loading": "Inapakia",
      "message.saving": "Inahifadhi...",
      "message.processing": "Inachakata...",
      "message.pleaseWait": "Tafadhali subiri..."
    }
  },
  zh: {
    translation: {
      // Common
      "app.name": "DTFS",
      "app.tagline": "数字贸易金融系统",
      "app.loading": "加载中...",
      
      // Auth
      "auth.login": "登录",
      "auth.register": "注册",
      "auth.username": "用户名",
      "auth.password": "密码",
      "auth.email": "电子邮件",
      "auth.fullName": "全名",
      "auth.confirmPassword": "确认密码",
      "auth.createAccount": "创建账户",
      "auth.alreadyHaveAccount": "已有账户？",
      "auth.dontHaveAccount": "没有账户？",
      "auth.registerNow": "立即注册",
      "auth.signIn": "登录",
      "auth.forgotPassword": "忘记密码",
      "auth.resetPassword": "重设密码",
      
      // Navigation
      "nav.dashboard": "仪表盘",
      "nav.tradeFinance": "贸易融资",
      "nav.marketplace": "市场",
      "nav.training": "培训",
      "nav.wallet": "钱包",
      "nav.chat": "对话",
      "nav.profile": "个人资料",
      "nav.settings": "设置",
      "nav.help": "帮助与支持",
      "nav.upgrade": "升级",
      "nav.logout": "登出",
      
      // Buttons
      "button.submit": "提交",
      "button.cancel": "取消",
      "button.save": "保存",
      "button.continue": "继续",
      "button.back": "返回",
      "button.next": "下一步",
      "button.confirm": "确认",
      "button.update": "更新",
      "button.delete": "删除",
      
      // Messages
      "message.success": "成功",
      "message.error": "错误",
      "message.warning": "警告",
      "message.info": "信息",
      "message.loading": "加载中",
      "message.saving": "保存中...",
      "message.processing": "处理中...",
      "message.pleaseWait": "请稍候..."
    }
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    initImmediate: true,
    resources,
    fallbackLng: ['en'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;