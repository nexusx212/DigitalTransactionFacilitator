import { useState } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TranslationWidget() {
  const { language, changeLanguage, languages } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    setIsOpen(false);
  };
  
  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === language) || languages[0];
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-background shadow-md hover:bg-accent transition-all"
          >
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className={`flex items-center cursor-pointer ${lang.code === language ? 'bg-muted' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="mr-2 text-lg" role="img" aria-label={lang.name}>
                {lang.flag}
              </span>
              <span>{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}