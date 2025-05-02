import { useContext, useState } from "react";
import { AppContext } from "@/context/app-context";
import { getInitials } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const { user, selectedLanguage, setSelectedLanguage, isOfflineMode, toggleOfflineMode } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
    { code: "ar", name: "العربية", flag: "🇪🇬" },
    { code: "ha", name: "Hausa", flag: "🇳🇬" }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // This would need to be connected to a sidebar state in a real implementation
  };

  const getFlag = (code: string) => {
    const language = languages.find((lang) => lang.code === code);
    return language ? language.flag : "🌐";
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 px-4 md:px-6 py-3 flex items-center justify-between">
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-all duration-normal" 
          aria-label="Menu"
          onClick={toggleSidebar}
        >
          <span className="material-icons">menu</span>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="gradient-primary w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-md">
            <span className="font-heading font-bold text-xl">D</span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-neutral-800">DTFS</h1>
            {!isMobile && (
              <div className="text-[10px] text-neutral-500 leading-none -mt-0.5">Digital Trade Finance</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Bar - Desktop Only */}
      <div className="hidden lg:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-normal"
          />
          <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">search</span>
        </div>
      </div>
      
      <div className="flex items-center ml-auto gap-2 md:gap-4">
        {/* Offline Mode Toggle */}
        <button 
          onClick={toggleOfflineMode}
          className={`hidden md:flex items-center gap-1.5 p-1.5 pl-2 md:pl-3 rounded-full text-xs border transition-all duration-normal ${
            isOfflineMode 
              ? "bg-success/10 text-success border-success/10" 
              : "bg-neutral-100 text-neutral-600 border-transparent hover:bg-neutral-200"
          }`}
        >
          <span className="material-icons text-base md:text-sm">
            {isOfflineMode ? "wifi_off" : "wifi"}
          </span>
          <span className="hidden md:inline-block">
            {isOfflineMode ? "Offline Mode" : "Online"}
          </span>
        </button>
        
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center h-10 gap-1 md:gap-2 py-1 px-2 md:px-3 rounded-lg border border-neutral-200 text-sm hover:bg-neutral-50 transition-all duration-normal">
              <span className="text-lg">{getFlag(selectedLanguage)}</span>
              <span className="hidden md:inline-block">{selectedLanguage.toUpperCase()}</span>
              <span className="material-icons text-[18px] text-neutral-400">expand_more</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px]">
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className="gap-2"
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                {lang.code === selectedLanguage && (
                  <span className="material-icons text-[16px] text-primary ml-auto">check</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-all duration-normal relative" aria-label="Notifications">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-error rounded-full animate-pulse-opacity"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px] md:w-[360px]" align="end">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="outline" className="ml-2">3 New</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[320px] overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-neutral-50">
                <div className="flex w-full">
                  <span className="w-8 h-8 flex-shrink-0 rounded-full bg-primary-light flex items-center justify-center text-primary">
                    <span className="material-icons text-[18px]">receipt_long</span>
                  </span>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">Invoice Approved</p>
                    <p className="text-xs text-neutral-500">Your invoice INV-2023-0042 was approved</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 whitespace-nowrap">5 min ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-neutral-50">
                <div className="flex w-full">
                  <span className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary-light flex items-center justify-center text-secondary">
                    <span className="material-icons text-[18px]">school</span>
                  </span>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">Course Completed</p>
                    <p className="text-xs text-neutral-500">You've completed Export Documentation Mastery</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 whitespace-nowrap">2 hours ago</span>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-center text-primary text-sm font-medium">
              View All Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="lg:h-10 p-1.5 rounded-lg hover:bg-neutral-100 transition-all duration-normal" aria-label="User Menu">
              {user && user.photoUrl ? (
                <img 
                  src={user.photoUrl} 
                  alt={user?.name || 'User'} 
                  className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-primary border-2 border-white shadow-sm">
                  <span className="text-xs font-medium">{user ? getInitials(user.name) : 'G'}</span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px]">
            <div className="flex items-center gap-3 p-3">
              {user && user.photoUrl ? (
                <img 
                  src={user.photoUrl} 
                  alt={user?.name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary border-2 border-white shadow-sm">
                  <span className="font-medium">{user ? getInitials(user.name) : 'G'}</span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-sm">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-neutral-500">{user?.email || 'Sign in to access all features'}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span className="material-icons text-[18px] mr-2">person_outline</span>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="material-icons text-[18px] mr-2">settings</span>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="material-icons text-[18px] mr-2">help_outline</span>
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-error">
              <span className="material-icons text-[18px] mr-2">logout</span>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
