import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type MobileNavLinkProps = {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
  isNew?: boolean;
  onClick?: () => void;
};

const MobileNavLink = ({ href, icon, label, isActive, badge, isNew, onClick }: MobileNavLinkProps) => {
  return (
    <a 
      href={href} 
      onClick={onClick}
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
  );
};

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  trigger?: React.ReactNode;
};

export function MobileDrawer({ isOpen, onClose, trigger }: MobileDrawerProps) {
  const [location] = useLocation();
  const { user, signOut, loading } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="left" className="w-[300px] p-0 bg-white">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Access all app features and settings</SheetDescription>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-neutral-100">
            <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md">
              <span className="font-heading font-bold text-xl">D</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-neutral-800">DTFS</h1>
              <div className="text-[10px] text-neutral-500 leading-none -mt-1">Digital Trade Finance System</div>
            </div>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Main Menu */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase mb-3 px-4">Main Menu</p>
              <div className="space-y-1">
                <MobileNavLink 
                  href="/" 
                  icon="dashboard" 
                  label="Dashboard" 
                  isActive={location === "/" || location === ""}
                  onClick={handleLinkClick}
                />
                <MobileNavLink 
                  href="/chat" 
                  icon="chat" 
                  label="Chat" 
                  isActive={location === "/chat"} 
                  badge="3"
                  onClick={handleLinkClick}
                />
                <MobileNavLink 
                  href="/documents" 
                  icon="description" 
                  label="Document Wizard" 
                  isActive={location === "/documents"} 
                  isNew={true}
                  onClick={handleLinkClick}
                />
                <MobileNavLink 
                  href="/trade-finance" 
                  icon="receipt_long" 
                  label="Trade Finance" 
                  isActive={location === "/trade-finance"} 
                  badge="2"
                  onClick={handleLinkClick}
                />
                <MobileNavLink 
                  href="/marketplace" 
                  icon="storefront" 
                  label="Marketplace" 
                  isActive={location === "/marketplace"}
                  onClick={handleLinkClick}
                />
                <MobileNavLink 
                  href="/training" 
                  icon="school" 
                  label="Training" 
                  isActive={location === "/training"}
                  onClick={handleLinkClick}
                />
                <MobileNavLink 
                  href="/wallet" 
                  icon="account_balance_wallet" 
                  label="Wallet" 
                  isActive={location === "/wallet"}
                  onClick={handleLinkClick}
                />
                <MobileNavLink 
                  href="/badges" 
                  icon="workspace_premium" 
                  label="Badges" 
                  isActive={location === "/badges"} 
                  isNew={true}
                  onClick={handleLinkClick}
                />
              </div>
            </div>
            
            {/* Settings & Support */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase mb-3 px-4">Settings</p>
              <div className="space-y-1">
                <MobileNavLink 
                  href="/profile" 
                  icon="person_outline" 
                  label="Profile"
                  isActive={location === "/profile"}
                  onClick={handleLinkClick}
                />
                <MobileNavLink 
                  href="/settings" 
                  icon="settings" 
                  label="Settings"
                  isActive={location === "/settings"}
                  onClick={handleLinkClick}
                />
                <MobileNavLink 
                  href="/help-support" 
                  icon="help_outline" 
                  label="Help & Support"
                  isActive={location === "/help-support"}
                  onClick={handleLinkClick}
                />
              </div>
            </div>
            
            {/* Pro Features Callout */}
            <div className="bg-gradient-to-br from-primary-light to-primary/10 rounded-xl p-4 border border-primary/10">
              <div className="flex items-center mb-3">
                <span className="material-icons text-primary mr-2">stars</span>
                <h4 className="font-semibold text-primary-dark">DTFS Premium</h4>
              </div>
              <p className="text-sm text-neutral-700 mb-3">Unlock advanced features with our premium plan.</p>
              <Button 
                onClick={handleLinkClick}
                className="w-full bg-primary hover:bg-primary-dark text-white"
              >
                <a href="/upgrade" className="w-full">Upgrade Now</a>
              </Button>
            </div>
          </div>
          
          {/* User Profile Footer */}
          <div className="border-t border-neutral-100 bg-neutral-50/50 p-4">
            <div className="flex items-center gap-3 mb-3">
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
                <p className="font-medium text-sm text-neutral-800">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-neutral-500">{user?.email || 'Sign in to access all features'}</p>
              </div>
            </div>
            {user ? (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-error border-error/20 hover:bg-error/10"
                onClick={async () => {
                  try {
                    await signOut();
                    onClose();
                  } catch (error) {
                    console.error("Sign out error:", error);
                  }
                }}
                disabled={loading}
              >
                <span className="material-icons text-[16px] mr-2">logout</span>
                Sign Out
              </Button>
            ) : (
              <Button 
                className="w-full"
                onClick={() => {
                  window.location.href = '/auth';
                  onClose();
                }}
              >
                <span className="material-icons text-[16px] mr-2">login</span>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}