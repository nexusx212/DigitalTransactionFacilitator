// Translation service module
// This is a mock translation service since we don't have an actual API key for translation services
// In a production environment, you would connect this to a real translation API like Google Translate, DeepL, etc.

// Define supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

// Mock translations for demonstration purposes
const mockTranslations: Record<string, Record<string, string>> = {
  // Sample English text with translations
  'Hi there, I saw your listing for cotton fabrics. Do you ship to North America?': {
    'es': '¡Hola! Vi tu anuncio de telas de algodón. ¿Hacen envíos a América del Norte?',
    'fr': 'Bonjour, j\'ai vu votre annonce pour les tissus en coton. Livrez-vous en Amérique du Nord?',
    'de': 'Hallo, ich habe Ihre Auflistung für Baumwollstoffe gesehen. Versenden Sie nach Nordamerika?',
    'zh': '你好，我看到了你的棉布产品。你们发货到北美吗？',
    'ja': 'こんにちは、あなたの綿織物のリストを見ました。北米に出荷していますか？',
    'ar': 'مرحبًا ، لقد رأيت قائمة الأقمشة القطنية الخاصة بك. هل تشحن إلى أمريكا الشمالية؟',
  },
  'Great! What would be the lead time for an order of about 5,000 yards?': {
    'es': '¡Excelente! ¿Cuál sería el tiempo de entrega para un pedido de aproximadamente 5,000 yardas?',
    'fr': 'Super ! Quel serait le délai pour une commande d\'environ 5 000 yards ?',
    'de': 'Großartig! Wie lange würde die Lieferzeit für eine Bestellung von etwa 5.000 Yards betragen?',
    'zh': '太好了！订购约5,000码的交货时间是多久？',
    'ja': '素晴らしい！約5,000ヤードの注文のリードタイムはどのくらいですか？',
    'ar': 'رائع! ما هي المهلة الزمنية لطلب حوالي 5000 ياردة؟',
  },
  'Hello, I\'m interested in your agricultural machinery. Do you have any special models for desert conditions?': {
    'es': 'Hola, estoy interesado en su maquinaria agrícola. ¿Tiene modelos especiales para condiciones desérticas?',
    'fr': 'Bonjour, je suis intéressé par vos machines agricoles. Avez-vous des modèles spéciaux pour les conditions désertiques ?',
    'de': 'Hallo, ich interessiere mich für Ihre landwirtschaftlichen Maschinen. Haben Sie spezielle Modelle für Wüstenbedingungen?',
    'zh': '你好，我对你们的农业机械感兴趣。你们有专门适合沙漠条件的特殊型号吗？',
    'ja': 'こんにちは、あなたの農業機械に興味があります。砂漠の条件に適した特別なモデルはありますか？',
    'ar': 'مرحبًا ، أنا مهتم بآلاتك الزراعية. هل لديك أي طرازات خاصة لظروف الصحراء؟',
  },
  'Interested in purchasing your latest batch of organic cocoa beans. Can we discuss pricing and shipping terms?': {
    'es': 'Interesado en comprar su último lote de granos de cacao orgánico. ¿Podemos discutir los precios y las condiciones de envío?',
    'fr': 'Intéressé par l\'achat de votre dernier lot de fèves de cacao bio. Pouvons-nous discuter des prix et des conditions d\'expédition ?',
    'de': 'Interessiert am Kauf Ihrer neuesten Charge Bio-Kakaobohnen. Können wir über Preise und Versandbedingungen sprechen?',
    'zh': '有兴趣购买您最新一批有机可可豆。我们可以讨论定价和运输条款吗？',
    'ja': 'あなたの最新のオーガニックカカオ豆のバッチの購入に興味があります。価格と配送条件について話し合うことができますか？',
    'ar': 'مهتم بشراء أحدث دفعة من حبوب الكاكاو العضوية. هل يمكننا مناقشة الأسعار وشروط الشحن؟',
  },
};

// Determine the best match for the input text in our mock database
const findBestTranslationMatch = (text: string): string | null => {
  // Exact match
  if (mockTranslations[text]) {
    return text;
  }
  
  // Find similar text (very simple implementation - in a real scenario, this would be more sophisticated)
  const mockTexts = Object.keys(mockTranslations);
  
  for (const mockText of mockTexts) {
    // If the text is at least 80% similar to one of our mock texts, use that
    if (text.length > 10 && mockText.includes(text.substring(0, 10))) {
      return mockText;
    }
  }
  
  // No match found
  return null;
};

// Mock translation function
export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<string> => {
  // In a real implementation, this would call an external translation API
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Try to find a match in our mock database
      const bestMatch = findBestTranslationMatch(text);
      
      if (bestMatch && mockTranslations[bestMatch][targetLanguage]) {
        resolve(mockTranslations[bestMatch][targetLanguage]);
      } else {
        // If no translation is available, return a message indicating this
        // In a real implementation, this would be replaced with an actual translation API call
        if (targetLanguage === 'en') {
          resolve(text); // If target is English, just return the original
        } else {
          resolve(`[Translation to ${targetLanguage} is not available for this text. This is a simulation - in a production environment, this would be connected to a real translation API.]`);
        }
      }
    }, 800); // Simulate a delay for the API call
  });
};

// Function to detect the language of a text
export const detectLanguage = async (text: string): Promise<string> => {
  // In a real implementation, this would call a language detection API
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Simplified mock implementation - in reality would use ML or API
      const langPatterns = [
        { lang: 'es', pattern: /[áéíóúüñ¿¡]/i },
        { lang: 'fr', pattern: /[àâçéèêëîïôùûüÿœæ]/i },
        { lang: 'de', pattern: /[äöüß]/i },
        { lang: 'zh', pattern: /[\u4e00-\u9fff]/i },
        { lang: 'ja', pattern: /[\u3040-\u309f\u30a0-\u30ff]/i },
        { lang: 'ar', pattern: /[\u0600-\u06ff]/i },
        { lang: 'ru', pattern: /[\u0400-\u04ff]/i },
      ];
      
      for (const { lang, pattern } of langPatterns) {
        if (pattern.test(text)) {
          resolve(lang);
          return;
        }
      }
      
      // Default to English if we can't detect
      resolve('en');
    }, 300);
  });
};