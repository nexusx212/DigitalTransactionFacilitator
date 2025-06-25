import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { MobileDrawer } from "./mobile-drawer";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
  onClick?: () => void;
};

const NavItem = ({ href, icon, label, isActive, badge, onClick }: NavItemProps) => {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center relative px-1 py-2 transition-all duration-normal",
        isActive ? "text-primary" : "text-neutral-500"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-normal mb-1",
        isActive 
          ? "bg-primary-light" 
          : "bg-transparent group-hover:bg-neutral-100"
      )}>
        <span className="material-icons text-[20px]">{icon}</span>
      </div>
      <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
      
      {badge && (
        <span className="absolute top-1 right-0 bg-primary text-white text-[9px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </a>
  );
};

export function MobileNav() {
  const [location] = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrawerOpen(true);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-100 px-1 pt-2 pb-3 flex justify-around items-center lg:hidden z-40 shadow-lg">
        <NavItem 
          href="/" 
          icon="dashboard" 
          label="Dashboard" 
          isActive={location === "/" || location === ""} 
        />
        <NavItem 
          href="/trade-finance" 
          icon="receipt_long" 
          label="Finance" 
          isActive={location === "/trade-finance"} 
          badge="2"
        />
        <NavItem 
          href="/marketplace" 
          icon="storefront" 
          label="Market" 
          isActive={location === "/marketplace"} 
        />
        <NavItem 
          href="/chat" 
          icon="chat" 
          label="Chat" 
          isActive={location === "/chat"} 
          badge="3"
        />
        <NavItem 
          href="#" 
          icon="menu" 
          label="More" 
          onClick={handleMenuClick}
        />
      </nav>

      <MobileDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
