import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/app-context";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

type SidebarLinkProps = {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
  isNew?: boolean;
  isCollapsed?: boolean;
};

const SidebarLink = ({ href, icon, label, isActive, badge, isNew, isCollapsed }: SidebarLinkProps) => {
  // If sidebar is collapsed, wrap in tooltip
  if (isCollapsed) {
    return (
      <li>
        <Tooltip>
          <TooltipTrigger asChild>
            <a 
              href={href} 
              className={cn(
                "group flex items-center justify-center py-3 rounded-lg font-medium transition-all duration-normal",
                isActive 
                  ? "bg-primary-light text-primary-dark" 
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-9 h-9 rounded-md transition-all duration-normal",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-neutral-500 bg-neutral-100 group-hover:bg-neutral-200"
              )}>
                <span className="material-icons text-[20px]">{icon}</span>
                {(badge || isNew) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-neutral-800 text-white border-0">
            <div>{label}</div>
            {badge && <div className="text-xs opacity-70">({badge} items)</div>}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }
  
  // Regular expanded sidebar link
  return (
    <li>
      <a 
        href={href} 
        className={cn(
          "group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-normal",
          isActive 
            ? "bg-primary-light text-primary-dark" 
            : "text-neutral-700 hover:bg-neutral-100"
        )}
      >
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md transition-all duration-normal",
          isActive 
            ? "bg-primary text-white" 
            : "text-neutral-500 bg-neutral-100 group-hover:bg-neutral-200"
        )}>
          <span className="material-icons text-[20px]">{icon}</span>
        </div>
        <span className="flex-1">{label}</span>
        {isNew && (
          <Badge variant="secondary" className="text-[10px] py-0 px-2 h-5">NEW</Badge>
        )}
        {badge && (
          <Badge variant="outline" className="bg-neutral-100 text-neutral-700 text-xs">{badge}</Badge>
        )}
      </a>
    </li>
  );
};

export function Sidebar() {
  const [location] = useLocation();
  const { user, signOut, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Initialize sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);
  
  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleLogoClick = () => {
    if (isSpinning) {
      setIsSpinning(false);
    } else {
      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 3000);
    }
  };

  return (
    <TooltipProvider>
      <aside 
        className={cn(
          "hidden lg:flex flex-col h-full bg-white border-r border-neutral-100 overflow-hidden transition-all duration-300 ease-in-out z-20",
          isCollapsed ? "w-[72px]" : "w-72"
        )}
      >
        <div className={cn(
          "flex-1 overflow-y-auto scrollbar-hide",
          isCollapsed ? "p-3" : "p-6"
        )}>
          <div className={cn(
            "flex items-center gap-3 mb-10 relative",
            isCollapsed && "justify-center"
          )}>
            <motion.div 
              className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md cursor-pointer"
              onClick={handleLogoClick}
              animate={{ rotate: isSpinning ? 360 : 0 }}
              transition={{ 
                duration: isSpinning ? 1 : 0.3,
                repeat: isSpinning ? Infinity : 0,
                ease: "linear"
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-heading font-bold text-xl">D</span>
            </motion.div>
            {!isCollapsed && (
              <div>
                <h1 className="font-heading font-bold text-2xl text-neutral-800">DTFS</h1>
                <div className="text-[10px] text-neutral-500 leading-none -mt-1">Digital Trade Finance System</div>
              </div>
            )}
            
            {/* Toggle sidebar button */}
            <button 
              onClick={toggleSidebar}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 transition-all duration-normal absolute",
                isCollapsed ? "right-0 top-1" : "right-0 top-1"
              )}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <span className="material-icons text-[18px]">
                {isCollapsed ? "chevron_right" : "chevron_left"}
              </span>
            </button>
          </div>
          
          <div className="space-y-8">
            {/* Navigation Links */}
            <div>
              {!isCollapsed && (
                <p className="text-xs font-semibold text-neutral-500 uppercase mb-3 px-4">Main Menu</p>
              )}
              <ul className={cn(
                "space-y-1",
                isCollapsed && "flex flex-col items-center"
              )}>
                <SidebarLink 
                  href="/" 
                  icon="dashboard" 
                  label="Dashboard" 
                  isActive={location === "/" || location === ""}
                  isCollapsed={isCollapsed}
                />
                <SidebarLink 
                  href="/chat" 
                  icon="chat" 
                  label="Chat" 
                  isActive={location === "/chat"} 
                  badge="3"
                  isCollapsed={isCollapsed}
                />
                <SidebarLink 
                  href="/documents" 
                  icon="description" 
                  label="Document Wizard" 
                  isActive={location === "/documents"} 
                  isNew={true}
                  isCollapsed={isCollapsed}
                />
                <SidebarLink 
                  href="/trade-finance" 
                  icon="receipt_long" 
                  label="Trade Finance" 
                  isActive={location === "/trade-finance"} 
                  badge="2"
                  isCollapsed={isCollapsed}
                />
                <SidebarLink 
                  href="/marketplace" 
                  icon="storefront" 
                  label="Marketplace" 
                  isActive={location === "/marketplace"}
                  isCollapsed={isCollapsed}
                />
                <SidebarLink 
                  href="/training" 
                  icon="school" 
                  label="Training" 
                  isActive={location === "/training"}
                  isCollapsed={isCollapsed}
                />
                <SidebarLink 
                  href="/wallet" 
                  icon="account_balance_wallet" 
                  label="Wallet" 
                  isActive={location === "/wallet"}
                  isCollapsed={isCollapsed}
                />

                <SidebarLink 
                  href="/badges" 
                  icon="workspace_premium" 
                  label="Badges" 
                  isActive={location === "/badges"} 
                  isNew={true}
                  isCollapsed={isCollapsed}
                />
              </ul>
            </div>
            
            {/* Settings & Support */}
            <div>
              {!isCollapsed && (
                <p className="text-xs font-semibold text-neutral-500 uppercase mb-3 px-4">Settings</p>
              )}
              <ul className={cn(
                "space-y-1",
                isCollapsed && "flex flex-col items-center"
              )}>
                <SidebarLink 
                  href="#" 
                  icon="person_outline" 
                  label="Profile"
                  isCollapsed={isCollapsed}
                />
                <SidebarLink 
                  href="#" 
                  icon="settings" 
                  label="Settings"
                  isCollapsed={isCollapsed}
                />
                <SidebarLink 
                  href="#" 
                  icon="help_outline" 
                  label="Help & Support"
                  isCollapsed={isCollapsed}
                />
              </ul>
            </div>
            
            {/* Pro Features Callout - only show when expanded */}
            {!isCollapsed && (
              <div className="bg-gradient-to-br from-primary-light to-primary/10 rounded-xl p-4 border border-primary/10">
                <div className="flex items-center mb-3">
                  <span className="material-icons text-primary mr-2">stars</span>
                  <h4 className="font-semibold text-primary-dark">DTFS Premium</h4>
                </div>
                <p className="text-sm text-neutral-700 mb-3">Unlock advanced features with our premium plan.</p>
                <button className="w-full bg-primary hover:bg-primary-dark text-white text-sm py-2 rounded-lg transition-colors duration-normal">
                  Upgrade Now
                </button>
              </div>
            )}
            
            {/* Collapsed Pro Button */}
            {isCollapsed && (
              <div className="flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-md">
                      <span className="material-icons">stars</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-neutral-800 text-white border-0">
                    <div>Upgrade to Premium</div>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
        
        {/* User Profile */}
        <div className={cn(
          "border-t border-neutral-100 bg-neutral-50/50",
          isCollapsed ? "p-3" : "p-4"
        )}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center">
                  {user && user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user?.name || 'User'} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary border-2 border-white shadow-sm cursor-pointer">
                      <span className="font-medium">{user ? getInitials(user.name) : 'G'}</span>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-neutral-800 text-white border-0 p-3 min-w-[200px]">
                <div className="flex flex-col gap-2">
                  <p className="font-medium">{user?.name || 'Guest User'}</p>
                  <p className="text-xs opacity-80">{user?.email || 'Not signed in'}</p>
                  <button 
                    onClick={async () => {
                      try {
                        await signOut();
                      } catch (error) {
                        console.error("Sign out error:", error);
                      }
                    }}
                    className="mt-1 w-full flex items-center justify-center gap-2 bg-error/20 text-error px-3 py-1.5 rounded-md text-sm"
                  >
                    <span className="material-icons text-[16px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3">
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
              <div>
                <p className="font-medium text-sm text-neutral-800">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-neutral-500">{user?.email || 'Sign in to access all features'}</p>
              </div>
              {user ? (
                <button 
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      console.error("Sign out error:", error);
                    }
                  }}
                  className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-all duration-normal"
                  title="Log out"
                >
                  <span className="material-icons text-[20px]">logout</span>
                </button>
              ) : (
                <a 
                  href="/auth" 
                  className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-all duration-normal"
                  title="Log in"
                >
                  <span className="material-icons text-[20px]">login</span>
                </a>
              )}
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
