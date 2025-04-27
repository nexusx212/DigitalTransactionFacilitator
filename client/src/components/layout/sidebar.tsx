import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { useContext } from "react";
import { AppContext } from "@/context/app-context";

type SidebarLinkProps = {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
};

const SidebarLink = ({ href, icon, label, isActive }: SidebarLinkProps) => {
  return (
    <li>
      <a 
        href={href} 
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all",
          isActive 
            ? "bg-primary-50 text-primary-700" 
            : "text-neutral-700 hover:bg-neutral-100"
        )}
      >
        <span className={cn(
          "material-icons",
          isActive ? "text-primary-500" : "text-neutral-500"
        )}>
          {icon}
        </span>
        <span>{label}</span>
      </a>
    </li>
  );
};

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useContext(AppContext);

  return (
    <aside className="hidden lg:block w-72 h-full bg-white shadow-sidebar overflow-y-auto transition-all duration-300 ease-in-out z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white">
            <span className="font-heading font-bold text-xl">D</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-neutral-800">DTFS</h1>
        </div>
        
        <div className="space-y-6">
          {/* Navigation Links */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase mb-3">Main Menu</p>
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
            <p className="text-xs font-semibold text-neutral-500 uppercase mb-3">Settings</p>
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
        </div>
      </div>
      
      {/* User Profile */}
      <div className="mt-auto border-t border-neutral-200 p-4">
        <div className="flex items-center gap-3">
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
              <span>{getInitials(user.name)}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-neutral-500">{user.email}</p>
          </div>
          <button className="ml-auto text-neutral-500 hover:text-neutral-700">
            <span className="material-icons">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
