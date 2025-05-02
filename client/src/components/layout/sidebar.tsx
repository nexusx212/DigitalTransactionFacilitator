import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { useContext } from "react";
import { AppContext } from "@/context/app-context";
import { Badge } from "@/components/ui/badge";

type SidebarLinkProps = {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
  isNew?: boolean;
};

const SidebarLink = ({ href, icon, label, isActive, badge, isNew }: SidebarLinkProps) => {
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
  const { user, logout } = useContext(AppContext);

  return (
    <aside className="hidden lg:flex flex-col w-72 h-full bg-white border-r border-neutral-100 overflow-hidden transition-all duration-300 ease-in-out z-20">
      <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-3 mb-10">
          <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md">
            <span className="font-heading font-bold text-xl">D</span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-neutral-800">DTFS</h1>
            <div className="text-[10px] text-neutral-500 leading-none -mt-1">Digital Trade Finance System</div>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Navigation Links */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase mb-3 px-4">Main Menu</p>
            <ul className="space-y-1">
              <SidebarLink 
                href="/" 
                icon="dashboard" 
                label="Dashboard" 
                isActive={location === "/" || location === ""} 
              />
              <SidebarLink 
                href="/trade-finance" 
                icon="receipt_long" 
                label="Trade Finance" 
                isActive={location === "/trade-finance"} 
                badge="2"
              />
              <SidebarLink 
                href="/marketplace" 
                icon="storefront" 
                label="Marketplace" 
                isActive={location === "/marketplace"} 
              />
              <SidebarLink 
                href="/training" 
                icon="school" 
                label="Training" 
                isActive={location === "/training"} 
              />
              <SidebarLink 
                href="/wallet" 
                icon="account_balance_wallet" 
                label="Wallet" 
                isActive={location === "/wallet"} 
              />
            </ul>
          </div>
          
          {/* Settings & Support */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase mb-3 px-4">Settings</p>
            <ul className="space-y-1">
              <SidebarLink 
                href="#" 
                icon="person_outline" 
                label="Profile" 
              />
              <SidebarLink 
                href="#" 
                icon="settings" 
                label="Settings" 
              />
              <SidebarLink 
                href="#" 
                icon="help_outline" 
                label="Help & Support" 
              />
            </ul>
          </div>
          
          {/* Pro Features Callout */}
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
        </div>
      </div>
      
      {/* User Profile */}
      <div className="border-t border-neutral-100 p-4 bg-neutral-50/50">
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
              onClick={() => {
                if (user) {
                  const { logout } = useContext(AppContext);
                  logout();
                  window.location.href = '/auth';
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
      </div>
    </aside>
  );
}
