import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
};

const NavItem = ({ href, icon, label, isActive, badge }: NavItemProps) => {
  return (
    <a 
      href={href} 
      className={cn(
        "group flex flex-col items-center justify-center relative px-2 py-2 transition-all duration-normal",
        isActive ? "text-primary" : "text-neutral-500"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-normal mb-1",
        isActive 
          ? "bg-primary-light" 
          : "bg-transparent group-hover:bg-neutral-100"
      )}>
        <span className="material-icons text-[22px]">{icon}</span>
      </div>
      <span className="text-xs font-medium">{label}</span>
      
      {badge && (
        <span className="absolute top-1 right-1 bg-primary text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </a>
  );
};

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-2 pt-2 pb-3 flex justify-around lg:hidden z-40 shadow-lg">
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
        href="/training" 
        icon="school" 
        label="Training" 
        isActive={location === "/training"} 
      />
      <NavItem 
        href="/wallet" 
        icon="account_balance_wallet" 
        label="Wallet" 
        isActive={location === "/wallet"} 
      />
    </nav>
  );
}
