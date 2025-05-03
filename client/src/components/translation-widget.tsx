import { useState, useEffect, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportedLanguages, translateText, detectLanguage } from "@/lib/translation-service";
import { AppContext } from "@/context/app-context";
import { Loader2 } from "lucide-react";

export function TranslationWidget() {
  const { selectedLanguage, setSelectedLanguage } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [detectedLanguage, setDetectedLanguage] = useState<string>("auto");
  const [targetLanguage, setTargetLanguage] = useState<string>(selectedLanguage);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Update the context when the target language changes
  useEffect(() => {
    if (targetLanguage !== selectedLanguage) {
      setSelectedLanguage(targetLanguage);
    }
  }, [targetLanguage, selectedLanguage, setSelectedLanguage]);

  // Reset the form when closed
  useEffect(() => {
    if (!isOpen) {
      setInputText("");
      setTranslatedText("");
      setIsTranslating(false);
    }
  }, [isOpen]);

  // Function to translate text
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    
    try {
      // Detect language if set to auto
      if (detectedLanguage === "auto") {
        const detected = await detectLanguage(inputText);
        setDetectedLanguage(detected);
      }
      
      // Translate the text
      const result = await translateText(
        inputText,
        targetLanguage,
        detectedLanguage === "auto" ? undefined : detectedLanguage
      );
      
      setTranslatedText(result);
    } catch (error) {
      setTranslatedText("Translation failed. Please try again.");
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Listen for clicks outside the widget to close it
  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // Add event listener for click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-20 right-6 z-50 bg-white shadow-md hover:bg-primary-50"
          aria-label="Open translation widget"
        >
          <span className="material-icons">translate</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        ref={popoverRef}
        className="w-80 sm:w-96 p-0 border border-neutral-200 shadow-lg"
        side="top"
        align="end"
      >
        <div className="rounded-t-md bg-primary-50 p-3 flex items-center justify-between border-b border-primary-100">
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary">translate</span>
            <h3 className="font-medium text-primary-900">Instant Translator</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
            <span className="material-icons text-sm">close</span>
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm text-neutral-500">Translate from:</div>
              <Select value={detectedLanguage} onValueChange={setDetectedLanguage}>
                <SelectTrigger className="h-7 text-xs w-[120px]">
                  <SelectValue placeholder="Auto detect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto detect</SelectItem>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-1.5">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[100px] text-sm"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-sm text-neutral-500">Translate to:</div>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="h-7 text-xs w-[120px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-1.5">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleTranslate} 
              disabled={isTranslating || !inputText.trim()}
              size="sm"
              className="text-xs gap-1"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <span className="material-icons text-xs">translate</span>
                  Translate
                </>
              )}
            </Button>
          </div>
          
          {translatedText && (
            <div className="space-y-2">
              <div className="text-sm text-neutral-500">Translation:</div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200 min-h-[100px] text-sm">
                {translatedText}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}