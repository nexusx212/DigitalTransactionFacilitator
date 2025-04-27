import { useContext, useState } from "react";
import { AppContext } from "@/context/app-context";
import { getInitials } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, selectedLanguage, setSelectedLanguage } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "sw", name: "Kiswahili" },
    { code: "ar", name: "العربية" },
    { code: "ha", name: "Hausa" }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // This would need to be connected to a sidebar state in a real implementation
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 lg:hidden">
        <button 
          className="p-2 rounded-full hover:bg-neutral-100" 
          aria-label="Menu"
          onClick={toggleSidebar}
        >
          <span className="material-icons">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
            <span className="font-heading font-bold text-lg">D</span>
          </div>
          <h1 className="font-heading font-semibold text-lg text-neutral-800">DTFS</h1>
        </div>
      </div>
      
      <div className="flex items-center ml-auto gap-3">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 py-1 px-3 rounded-full border border-neutral-200 text-sm hover:bg-neutral-50">
              <span className="material-icons text-sm">language</span>
              <span>{selectedLanguage.toUpperCase()}</span>
              <span className="material-icons text-sm">expand_more</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-neutral-100 relative" aria-label="Notifications">
          <span className="material-icons">notifications_none</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        
        {/* User Menu - Mobile Only */}
        <button className="lg:hidden p-2 rounded-full hover:bg-neutral-100" aria-label="User Menu">
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={user.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
              <span className="text-sm">{getInitials(user.name)}</span>
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
