import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { ProgressTracker } from "@/components/ui/progress-tracker";
import { Mic, MicOff, Globe, Wallet, Mail, Phone, Upload, FileText, Users, Building2, Shield, Eye, EyeOff } from "lucide-react";

interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zu', name: 'IsiZulu', flag: '🇿🇦' },
];

const countries = [
  'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Morocco', 'Egypt', 'Tanzania', 'Uganda', 'Rwanda', 'Senegal'
];

const govIdTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'nin', label: 'National ID (NIN)' },
  { value: 'drivers_license', label: 'Driver\'s License' },
];

const businessTypes = [
  { value: 'llc', label: 'Limited Liability Company' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
];

export default function EnhancedAuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();

  // Form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState(1);
  const [userRole, setUserRole] = useState<'exporter' | 'buyer' | 'logistics_provider' | 'financier' | 'agent'>('buyer');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  
  // Progress tracking
  const totalSteps = 4; // Role selection, Basic info, Verification, Complete
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Voice recognition state
  const [voiceState, setVoiceState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    isSupported: typeof window !== 'undefined' && 'webkitSpeechRecognition' in window
  });

  // Form data
  const [formData, setFormData] = useState({
    // Basic auth
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    name: '',
    phoneNumber: '',
    country: '',
    walletAddress: '',
    
    // KYC data
    govIdType: '',
    govIdNumber: '',
    selfieFile: null as File | null,
    idDocumentFile: null as File | null,
    proofOfAddressFile: null as File | null,
    
    // KYB data
    businessName: '',
    registrationNumber: '',
    taxId: '',
    businessAddress: '',
    businessType: '',
    incorporationCountry: '',
    businessCertificateFile: null as File | null,
    utilityBillFile: null as File | null,
    directorList: [] as any[],
  });

  const recognition = useRef<any>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (voiceState.isSupported) {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage;

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceState(prev => ({ ...prev, transcript }));
        processVoiceCommand(transcript);
      };

      recognition.current.onend = () => {
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };
    }
  }, [selectedLanguage]);

  const processVoiceCommand = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Process voice registration commands
    if (lowerTranscript.includes('register') || lowerTranscript.includes('sign up')) {
      if (lowerTranscript.includes('export') || lowerTranscript.includes('sell')) {
        setUserRole('exporter');
        setAuthMode('register');
        setStep(2);
      } else if (lowerTranscript.includes('buy') || lowerTranscript.includes('purchase')) {
        setUserRole('buyer');
        setAuthMode('register');
        setStep(2);
      } else if (lowerTranscript.includes('logistics') || lowerTranscript.includes('ship')) {
        setUserRole('logistics_provider');
        setAuthMode('register');
        setStep(2);
      } else if (lowerTranscript.includes('finance') || lowerTranscript.includes('invest')) {
        setUserRole('financier');
        setAuthMode('register');
        setStep(2);
      } else if (lowerTranscript.includes('agent') || lowerTranscript.includes('refer')) {
        setUserRole('agent');
        setAuthMode('register');
        setStep(2);
      } else {
        setUserRole('buyer');
        setAuthMode('register');
        setStep(2);
      }
    }
    
    // Process login commands
    if (lowerTranscript.includes('log in') || lowerTranscript.includes('login')) {
      setAuthMode('login');
    }
    
    // Extract name and location
    const nameMatch = transcript.match(/my name is (\w+)/i) || transcript.match(/i am (\w+)/i);
    if (nameMatch) {
      setFormData(prev => ({ ...prev, name: nameMatch[1] }));
    }
    
    const countryMatch = transcript.match(/from (\w+)/i) || transcript.match(/in (\w+)/i);
    if (countryMatch && countries.some(c => c.toLowerCase().includes(countryMatch[1].toLowerCase()))) {
      const foundCountry = countries.find(c => c.toLowerCase().includes(countryMatch[1].toLowerCase()));
      if (foundCountry) {
        setFormData(prev => ({ ...prev, country: foundCountry }));
      }
    }

    // Business name extraction
    const businessMatch = transcript.match(/company (\w+[\w\s]*)/i) || transcript.match(/business (\w+[\w\s]*)/i);
    if (businessMatch) {
      setFormData(prev => ({ ...prev, businessName: businessMatch[1] }));
    }
  };

  const startVoiceRecognition = () => {
    if (recognition.current && voiceState.isSupported) {
      setVoiceState(prev => ({ ...prev, isListening: true, transcript: '' }));
      recognition.current.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  const handleFileUpload = (field: string, file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({
        username: formData.email,
        password: formData.password
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      await registerMutation.mutateAsync({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        role: userRole,
        language: selectedLanguage,
        walletAddress: formData.walletAddress,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  const renderLoginForm = () => (
    <Card className="w-full max-w-md border-2 border-blue-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back</CardTitle>
        <CardDescription>Access your DTFS account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Wallet className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderRegistrationStep1 = () => (
    <Card className="w-full max-w-2xl border-2 border-blue-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">Join DTFS Platform</CardTitle>
        <CardDescription>Choose your account type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${userRole === 'exporter' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'}`}
            onClick={() => setUserRole('exporter')}
          >
            <CardContent className="p-4 text-center">
              <Building2 className="h-10 w-10 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-base">Exporter</h3>
              <p className="text-xs text-gray-600 mt-1">Sell products across African markets</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all ${userRole === 'buyer' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
            onClick={() => setUserRole('buyer')}
          >
            <CardContent className="p-4 text-center">
              <Users className="h-10 w-10 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold text-base">Buyer</h3>
              <p className="text-xs text-gray-600 mt-1">Source products from verified exporters</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${userRole === 'logistics_provider' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'}`}
            onClick={() => setUserRole('logistics_provider')}
          >
            <CardContent className="p-4 text-center">
              <Wallet className="h-10 w-10 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold text-base">Logistics Provider</h3>
              <p className="text-xs text-gray-600 mt-1">Provide shipping and logistics services</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${userRole === 'financier' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'}`}
            onClick={() => setUserRole('financier')}
          >
            <CardContent className="p-4 text-center">
              <Shield className="h-10 w-10 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold text-base">Financier</h3>
              <p className="text-xs text-gray-600 mt-1">Provide trade finance and investment</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${userRole === 'agent' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'}`}
            onClick={() => setUserRole('agent')}
          >
            <CardContent className="p-4 text-center">
              <Globe className="h-10 w-10 mx-auto mb-3 text-teal-600" />
              <h3 className="font-semibold text-base">Agent</h3>
              <p className="text-xs text-gray-600 mt-1">Connect rural MSMEs to the platform</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setAuthMode('login')}
          >
            Back to Login
          </Button>
          <Button 
            onClick={() => setStep(2)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderRegistrationStep2 = () => (
    <Card className="w-full max-w-2xl border-2 border-blue-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">Account Information</CardTitle>
        <CardDescription>Tell us about yourself</CardDescription>
        
        {voiceState.isSupported && (
          <div className="flex justify-center mt-4">
            <Button
              type="button"
              variant={voiceState.isListening ? "destructive" : "outline"}
              size="sm"
              onClick={voiceState.isListening ? stopVoiceRecognition : startVoiceRecognition}
              className="flex items-center gap-2"
            >
              {voiceState.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {voiceState.isListening ? 'Stop Recording' : 'Voice Register'}
            </Button>
          </div>
        )}
        
        {voiceState.transcript && (
          <Badge variant="secondary" className="mt-2">
            "{voiceState.transcript}"
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address (Optional)</Label>
            <Input
              id="walletAddress"
              value={formData.walletAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
              placeholder="Connect wallet or enter manually"
            />
          </div>

          <div className="flex justify-between items-center">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button 
              type="button"
              onClick={() => setStep(3)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Continue to Verification
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderKYCStep = () => (
    <Card className="w-full max-w-2xl border-2 border-green-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-green-600" />
          KYC Verification
        </CardTitle>
        <CardDescription>Verify your identity to complete registration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Government ID Type</Label>
          <Select value={formData.govIdType} onValueChange={(value) => setFormData(prev => ({ ...prev, govIdType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {govIdTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="govIdNumber">ID Number</Label>
          <Input
            id="govIdNumber"
            value={formData.govIdNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, govIdNumber: e.target.value }))}
            placeholder="Enter your ID number"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Selfie Photo</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('selfieFile', e.target.files[0])}
                className="hidden"
                id="selfie"
              />
              <Label htmlFor="selfie" className="cursor-pointer text-sm text-blue-600">
                Upload Selfie
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>ID Document</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('idDocumentFile', e.target.files[0])}
                className="hidden"
                id="idDocument"
              />
              <Label htmlFor="idDocument" className="cursor-pointer text-sm text-blue-600">
                Upload ID
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Proof of Address</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('proofOfAddressFile', e.target.files[0])}
                className="hidden"
                id="proofAddress"
              />
              <Label htmlFor="proofAddress" className="cursor-pointer text-sm text-blue-600">
                Upload Document
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => setStep(2)}
          >
            Back
          </Button>
          <Button 
            onClick={handleRegister}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderKYBStep = () => (
    <Card className="w-full max-w-2xl border-2 border-purple-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Building2 className="h-6 w-6 text-purple-600" />
          KYB Verification
        </CardTitle>
        <CardDescription>Verify your business to complete registration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Business Type</Label>
            <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
              placeholder="CAC registration number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAddress">Business Address</Label>
          <Input
            id="businessAddress"
            value={formData.businessAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Business Certificate</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('businessCertificateFile', e.target.files[0])}
                className="hidden"
                id="businessCert"
              />
              <Label htmlFor="businessCert" className="cursor-pointer text-sm text-blue-600">
                Upload Certificate
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Utility Bill</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('utilityBillFile', e.target.files[0])}
                className="hidden"
                id="utilityBill"
              />
              <Label htmlFor="utilityBill" className="cursor-pointer text-sm text-blue-600">
                Upload Bill
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => setStep(2)}
          >
            Back
          </Button>
          <Button 
            onClick={handleRegister}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Auth Forms */}
          <div className="flex flex-col items-center space-y-6">
            {/* Language Selector */}
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-gray-600" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Progress Tracker - only show during registration */}
            {authMode === 'register' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <ProgressTracker
                  currentStep={step}
                  totalSteps={totalSteps}
                  userRole={userRole}
                  onStepComplete={(completedStep) => {
                    setCompletedSteps(prev => new Set([...Array.from(prev), completedStep]));
                  }}
                  className="mb-6"
                />
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {authMode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderLoginForm()}
                </motion.div>
              )}
              
              {authMode === 'register' && step === 1 && (
                <motion.div
                  key="register-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderRegistrationStep1()}
                </motion.div>
              )}
              
              {authMode === 'register' && step === 2 && (
                <motion.div
                  key="register-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderRegistrationStep2()}
                </motion.div>
              )}
              
              {authMode === 'register' && step === 3 && userRole === 'buyer' && (
                <motion.div
                  key="kyc"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderKYCStep()}
                </motion.div>
              )}
              
              {authMode === 'register' && step === 3 && (userRole === 'exporter' || userRole === 'logistics_provider' || userRole === 'financier' || userRole === 'agent') && (
                <motion.div
                  key="kyb"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderKYBStep()}
                </motion.div>
              )}
            </AnimatePresence>

            {authMode === 'login' && (
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button variant="link" onClick={() => setAuthMode('register')} className="p-0 h-auto">
                  Sign up here
                </Button>
              </p>
            )}
          </div>

          {/* Right side - Hero Section */}
          <div className="hidden lg:block">
            <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-blue-600 to-purple-700 text-white">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h1 className="text-4xl font-bold">DTFS Platform</h1>
                  <p className="text-xl opacity-90">
                    Decentralized AI-Native Digital Trade Finance Ecosystem
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6" />
                      <span>Secure KYC/KYB Verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mic className="h-6 w-6" />
                      <span>Voice-Guided Multilingual Onboarding</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wallet className="h-6 w-6" />
                      <span>Web3 Wallet Integration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-6 w-6" />
                      <span>Trade Finance Solutions</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <p className="text-sm opacity-90">
                      Empowering African SMEs with blockchain-enabled trade finance, 
                      AI-powered marketplace, and secure digital wallet solutions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}