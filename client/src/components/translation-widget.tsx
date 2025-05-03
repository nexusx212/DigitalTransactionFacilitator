import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "@/context/app-context";
import { translateText, supportedLanguages, getLanguageFlag } from "@/lib/translation-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Check, RefreshCw, ArrowRightLeft } from "lucide-react";

export function TranslationWidget() {
  const { selectedLanguage } = useContext(AppContext);
  const [sourceLanguage, setSourceLanguage] = useState<string>('auto');
  const [targetLanguage, setTargetLanguage] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('text');
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  const translatorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Set default target language based on app selected language
  useEffect(() => {
    if (!targetLanguage && selectedLanguage) {
      // Default target is the app language
      setTargetLanguage(selectedLanguage);
    }
  }, [selectedLanguage, targetLanguage]);

  // Handle translation
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      return;
    }

    try {
      setIsTranslating(true);
      const translatedContent = await translateText(inputText, targetLanguage, sourceLanguage);
      setTranslatedText(translatedContent);
    } catch (error) {
      toast({
        title: "Translation Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  // Auto-translate when inputs change
  useEffect(() => {
    const delayTranslation = setTimeout(() => {
      if (inputText.trim() && targetLanguage) {
        handleTranslate();
      }
    }, 800);
    
    return () => clearTimeout(delayTranslation);
  }, [inputText, targetLanguage, sourceLanguage]);

  // Handle copying translated text
  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "Translation has been copied",
      });
    }
  };

  // Swap languages
  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      // Also swap the text
      setInputText(translatedText);
      setTranslatedText(inputText);
    } else {
      toast({
        description: "Cannot swap when source language is set to auto-detect",
      });
    }
  };

  // Close translator when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (translatorRef.current && !translatorRef.current.contains(event.target as Node)) {
        setShowTranslator(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle visibility
  const toggleTranslator = () => {
    setShowTranslator(!showTranslator);
  };

  return (
    <>
      {/* Floating button to show translator */}
      <Button
        onClick={toggleTranslator}
        className="fixed bottom-6 right-6 rounded-full p-3 shadow-lg"
        size="icon"
      >
        <span className="material-icons">translate</span>
      </Button>

      {/* Translation Widget */}
      {showTranslator && (
        <div 
          ref={translatorRef}
          className="fixed bottom-20 right-6 z-50 w-[350px] md:w-[400px] shadow-xl animate-in fade-in slide-in-from-bottom-10 duration-300"
        >
          <Card className="border-primary/20">
            <CardHeader className="bg-primary-50 py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="material-icons">translate</span>
                Instant Translator
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowTranslator(false)} className="h-7 w-7">
                <span className="material-icons text-sm">close</span>
              </Button>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-4 pt-2">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="text" className="text-sm">Text Translation</TabsTrigger>
                  <TabsTrigger value="chat" className="text-sm">Chat Translation</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="text" className="space-y-4 p-4 pt-3">
                <div className="flex justify-between items-center gap-2">
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger className="w-[45%]">
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto Detect</SelectItem>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={`source-${lang.code}`} value={lang.code} className="flex items-center gap-2">
                          <span>{lang.flag} {lang.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSwapLanguages}
                    disabled={sourceLanguage === 'auto'}
                    className="h-8 w-8"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>

                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="w-[45%]">
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={`target-${lang.code}`} value={lang.code}>
                          <span>{lang.flag} {lang.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Textarea
                    placeholder="Enter text to translate..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="resize-none h-24"
                  />
                  
                  <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 min-h-[100px] relative">
                    {isTranslating ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : translatedText ? (
                      <div className="text-sm whitespace-pre-wrap">{translatedText}</div>
                    ) : (
                      <div className="text-neutral-400 text-center mt-3">Translation will appear here</div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTranslate}
                    disabled={!inputText.trim() || isTranslating}
                    className="gap-1"
                  >
                    {isTranslating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Translate
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!translatedText}
                    className="gap-1"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="p-4">
                <div className="flex flex-col items-center justify-center h-[220px] text-center">
                  <span className="material-icons text-5xl text-neutral-300 mb-3">chat</span>
                  <h3 className="text-base font-medium mb-1">Chat Translation</h3>
                  <p className="text-neutral-500 text-sm">
                    Translate your chats in real-time to communicate with trade partners in different languages.
                  </p>
                  <Button variant="default" className="mt-4">
                    Go to Trade Chat
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <CardFooter className="flex justify-between p-3 text-xs border-t text-neutral-500">
              <div>Powered by DTFS Translation API</div>
              <div className="flex items-center">
                <span className="material-icons text-xs mr-1">language</span>
                {supportedLanguages.length} Languages
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}