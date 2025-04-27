import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
};

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <a 
      href={href} 
      className={cn(
        "flex flex-col items-center py-1",
        isActive ? "text-primary-500" : "text-neutral-500"
      )}
    >
      <span className="material-icons">{icon}</span>
      <span className="text-xs mt-1">{label}</span>
    </a>
  );
};

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2 flex justify-around lg:hidden z-40">
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
