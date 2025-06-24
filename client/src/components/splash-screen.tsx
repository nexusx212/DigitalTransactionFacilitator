import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { MapPin, Volume2, VolumeX, Globe, ChevronRight, Mic, MicOff } from 'lucide-react';
import { Badge } from './ui/badge';

interface SplashScreenProps {
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  language: string;
  country: string;
  role: string;
  gpsLocation?: { lat: number; lng: number; country: string; region: string };
  preferredVoiceLanguage: string;
  accessibilityMode: boolean;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', voice: 'en-US' },
  { code: 'ha', name: 'Hausa', nativeName: 'هَوُسَ', voice: 'en-US' }, // Fallback to English voice
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', voice: 'en-US' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', voice: 'en-US' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', voice: 'en-US' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', voice: 'ar-SA' },
  { code: 'fr', name: 'French', nativeName: 'Français', voice: 'fr-FR' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', voice: 'pt-BR' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', voice: 'es-ES' },
];

const userRoles = [
  {
    id: 'exporter',
    title: 'Exporter',
    description: 'Sell your products to international markets',
    icon: '🚢',
    color: 'bg-blue-500'
  },
  {
    id: 'buyer',
    title: 'Buyer', 
    description: 'Find and purchase products from exporters',
    icon: '🛒',
    color: 'bg-green-500'
  },
  {
    id: 'logistics_provider',
    title: 'Logistics Provider',
    description: 'Provide shipping and logistics services',
    icon: '🚚',
    color: 'bg-orange-500'
  },
  {
    id: 'agent',
    title: 'Agent',
    description: 'Help facilitate trade connections and deals',
    icon: '🤝',
    color: 'bg-purple-500'
  }
];

const translations = {
  en: {
    welcome: "Welcome to DTFS",
    subtitle: "Digital Trade Finance System",
    description: "Connecting African markets through digital trade",
    selectLanguage: "Select your language",
    selectRole: "Choose your role",
    continue: "Continue",
    useGPS: "Use GPS Location",
    manualLocation: "Select Manually",
    voiceGuide: "Voice Guide",
    accessibilityMode: "Simple Mode for Beginners",
    listening: "Listening...",
    speakYourChoice: "Speak your choice or tap to select",
  },
  fr: {
    welcome: "Bienvenue sur DTFS",
    subtitle: "Système de financement du commerce numérique",
    description: "Connecter les marchés africains grâce au commerce numérique",
    selectLanguage: "Sélectionnez votre langue",
    selectRole: "Choisissez votre rôle",
    continue: "Continuer",
    useGPS: "Utiliser la géolocalisation",
    manualLocation: "Sélectionner manuellement",
    voiceGuide: "Guide vocal",
    accessibilityMode: "Mode simple pour débutants",
    listening: "Écoute...",
    speakYourChoice: "Parlez votre choix ou appuyez pour sélectionner",
  },
  ar: {
    welcome: "مرحباً بك في DTFS",
    subtitle: "نظام التمويل التجاري الرقمي",
    description: "ربط الأسواق الأفريقية من خلال التجارة الرقمية",
    selectLanguage: "اختر لغتك",
    selectRole: "اختر دورك",
    continue: "متابعة",
    useGPS: "استخدام موقع GPS",
    manualLocation: "اختيار يدوي",
    voiceGuide: "الدليل الصوتي",
    accessibilityMode: "وضع بسيط للمبتدئين",
    listening: "يستمع...",
    speakYourChoice: "تحدث باختيارك أو اضغط للتحديد",
  }
} as const;

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRole, setSelectedRole] = useState('');
  const [country, setCountry] = useState('');
  const [gpsLocation, setGpsLocation] = useState<any>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const speechRecognition = useRef<any>(null);
  
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesis.current = window.speechSynthesis;
      
      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        speechRecognition.current = new SpeechRecognition();
        speechRecognition.current.continuous = false;
        speechRecognition.current.interimResults = false;
        speechRecognition.current.lang = selectedLanguage;
      }
    }
  }, [selectedLanguage]);

  const speak = (text: string) => {
    if (voiceEnabled && speechSynthesis.current) {
      speechSynthesis.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const selectedLang = languages.find(l => l.code === selectedLanguage);
      if (selectedLang) {
        utterance.lang = selectedLang.voice;
      }
      speechSynthesis.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (speechRecognition.current && voiceEnabled) {
      setIsListening(true);
      speechRecognition.current.start();
      
      speechRecognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
        setIsListening(false);
      };
      
      speechRecognition.current.onerror = () => {
        setIsListening(false);
      };
    }
  };

  const handleVoiceCommand = (command: string) => {
    if (currentStep === 1) {
      // Language selection
      const foundLang = languages.find(lang => 
        command.includes(lang.name.toLowerCase()) || 
        command.includes(lang.nativeName.toLowerCase())
      );
      if (foundLang) {
        setSelectedLanguage(foundLang.code);
        speak(`Selected ${foundLang.name}`);
      }
    } else if (currentStep === 2) {
      // Role selection
      const foundRole = userRoles.find(role => 
        command.includes(role.title.toLowerCase()) ||
        command.includes(role.id.toLowerCase())
      );
      if (foundRole) {
        setSelectedRole(foundRole.id);
        speak(`Selected ${foundRole.title}`);
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGpsLocation({ lat: latitude, lng: longitude });
          // In a real app, you'd reverse geocode to get country/region
          setCountry('Auto-detected');
          speak('Location detected');
        },
        (error) => {
          console.error('Error getting location:', error);
          speak('Location access denied. Please select manually.');
        }
      );
    }
  };

  const handleComplete = () => {
    const onboardingData: OnboardingData = {
      language: selectedLanguage,
      country: country || 'Unknown',
      role: selectedRole,
      gpsLocation,
      preferredVoiceLanguage: selectedLanguage,
      accessibilityMode
    };
    
    onComplete(onboardingData);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      
      // Provide voice guidance for next step
      setTimeout(() => {
        if (currentStep === 0) {
          speak(t.selectLanguage);
        } else if (currentStep === 1) {
          speak(t.selectRole);
        } else if (currentStep === 2) {
          speak(t.useGPS + ' or ' + t.manualLocation);
        }
      }, 500);
    } else {
      handleComplete();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white font-bold"
              >
                D
              </motion.div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t.welcome}
              </h1>
              <p className="text-xl text-gray-600">{t.subtitle}</p>
              <p className="text-gray-500">{t.description}</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                variant={voiceEnabled ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                {t.voiceGuide}
              </Button>
              
              <Button
                onClick={() => setAccessibilityMode(!accessibilityMode)}
                variant={accessibilityMode ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Globe size={20} />
                {t.accessibilityMode}
              </Button>
            </div>
            
            <Button onClick={nextStep} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600">
              {t.continue} <ChevronRight size={20} />
            </Button>
          </motion.div>
        );
        
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{t.selectLanguage}</h2>
              {voiceEnabled && (
                <Button
                  onClick={startListening}
                  variant="outline"
                  className="mb-4"
                  disabled={isListening}
                >
                  {isListening ? <Mic className="animate-pulse" size={20} /> : <MicOff size={20} />}
                  {isListening ? t.listening : t.speakYourChoice}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <Card
                  key={lang.code}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedLanguage === lang.code ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    speak(lang.name);
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-semibold">{lang.nativeName}</div>
                    <div className="text-sm text-gray-500">{lang.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedLanguage && (
              <div className="text-center">
                <Button onClick={nextStep} size="lg">
                  {t.continue} <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{t.selectRole}</h2>
              {voiceEnabled && (
                <Button
                  onClick={startListening}
                  variant="outline"
                  className="mb-4"
                  disabled={isListening}
                >
                  {isListening ? <Mic className="animate-pulse" size={20} /> : <MicOff size={20} />}
                  {isListening ? t.listening : t.speakYourChoice}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRoles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedRole === role.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedRole(role.id);
                    speak(role.title);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center text-2xl`}>
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{role.title}</h3>
                        <p className="text-gray-600 text-sm">{role.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedRole && (
              <div className="text-center">
                <Button onClick={nextStep} size="lg">
                  {t.continue} <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 text-center"
          >
            <h2 className="text-2xl font-bold">Location Setup</h2>
            
            <div className="space-y-4">
              <Button
                onClick={getCurrentLocation}
                size="lg"
                className="w-full flex items-center gap-2"
              >
                <MapPin size={20} />
                {t.useGPS}
              </Button>
              
              <div className="text-gray-500">or</div>
              
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t.manualLocation} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NG">Nigeria</SelectItem>
                  <SelectItem value="KE">Kenya</SelectItem>
                  <SelectItem value="GH">Ghana</SelectItem>
                  <SelectItem value="ZA">South Africa</SelectItem>
                  <SelectItem value="EG">Egypt</SelectItem>
                  <SelectItem value="MA">Morocco</SelectItem>
                  <SelectItem value="ET">Ethiopia</SelectItem>
                  <SelectItem value="UG">Uganda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(country || gpsLocation) && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Language: {languages.find(l => l.code === selectedLanguage)?.name}</Badge>
                  <Badge variant="secondary">Role: {userRoles.find(r => r.id === selectedRole)?.title}</Badge>
                  <Badge variant="secondary">Location: {country}</Badge>
                  {voiceEnabled && <Badge variant="secondary">Voice Enabled</Badge>}
                  {accessibilityMode && <Badge variant="secondary">Simple Mode</Badge>}
                </div>
                
                <Button onClick={handleComplete} size="lg" className="bg-gradient-to-r from-green-500 to-blue-600">
                  Complete Setup <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0">
          <CardContent className="p-8 md:p-12">
            {/* Progress indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all ${
                      step <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}