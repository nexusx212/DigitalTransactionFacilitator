import { useState, useContext, useEffect } from "react";
import { AppContext } from "@/context/app-context";
import { translateText, supportedLanguages } from "@/lib/translation-service";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type ChatTranslatorProps = {
  originalMessage: string;
  messageLanguage?: string;
  onClose: () => void;
};

export function ChatTranslator({ originalMessage, messageLanguage = 'auto', onClose }: ChatTranslatorProps) {
  const { selectedLanguage } = useContext(AppContext);
  const [targetLanguage, setTargetLanguage] = useState<string>(selectedLanguage);
  const [translatedMessage, setTranslatedMessage] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const { toast } = useToast();

  // Effect to translate message when component mounts or target language changes
  useEffect(() => {
    const translateMessage = async () => {
      if (!originalMessage || (messageLanguage !== 'auto' && targetLanguage === messageLanguage)) {
        setTranslatedMessage('');
        return;
      }

      try {
        setIsTranslating(true);
        const result = await translateText(originalMessage, targetLanguage, messageLanguage);
        setTranslatedMessage(result);
      } catch (error) {
        toast({
          title: "Translation Error",
          description: "Failed to translate message",
          variant: "destructive",
        });
      } finally {
        setIsTranslating(false);
      }
    };

    translateMessage();
  }, [originalMessage, targetLanguage, messageLanguage, toast]);

  return (
    <div className="rounded-md border border-neutral-200 p-3 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-icons text-sm text-primary">translate</span>
          <span className="text-sm font-medium">Translate Message</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <span className="material-icons text-xs">close</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-neutral-500">Translate to:</span>
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
      
      <div className="bg-neutral-50 rounded p-2 min-h-[40px]">
        {isTranslating ? (
          <div className="flex items-center justify-center p-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
            <span className="text-xs text-neutral-500">Translating...</span>
          </div>
        ) : translatedMessage ? (
          <p className="text-sm">{translatedMessage}</p>
        ) : (
          <p className="text-xs text-neutral-400 text-center py-2">
            Select a language to see the translation
          </p>
        )}
      </div>
    </div>
  );
}