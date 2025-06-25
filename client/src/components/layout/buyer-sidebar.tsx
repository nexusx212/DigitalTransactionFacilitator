import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import {
  ShoppingBag,
  Package,
  Heart,
  Star,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Bell,
  Search,
  Filter,
  ShoppingCart,
  CreditCard,
  MapPin,
  Truck,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const buyerSidebarItems = [
  {
    title: "Buyer Overview",
    href: "/buyer",
    icon: BarChart3,
    description: "Dashboard & analytics"
  },
  {
    title: "Browse Products",
    href: "/marketplace",
    icon: Search,
    description: "Find suppliers",
    badge: "2.5K"
  },
  {
    title: "My Orders",
    href: "/orders",
    icon: Package,
    description: "Track purchases",
    badge: "5"
  },
  {
    title: "Saved Items",
    href: "/saved",
    icon: Heart,
    description: "Wishlist & favorites",
    badge: "12"
  },
  {
    title: "Shopping Cart",
    href: "/cart",
    icon: ShoppingCart,
    description: "Review items",
    badge: "3"
  },
  {
    title: "Payments",
    href: "/wallet",
    icon: CreditCard,
    description: "Payment methods"
  },
  {
    title: "Supplier Network",
    href: "/suppliers",
    icon: TrendingUp,
    description: "Your connections"
  },
  {
    title: "Messages",
    href: "/chat",
    icon: MessageSquare,
    description: "Supplier chat",
    badge: "7"
  },
  {
    title: "Shipments",
    href: "/shipments",
    icon: Truck,
    description: "Delivery tracking"
  }
];

const quickActions = [
  { label: "Quick Order", icon: Plus, color: "bg-blue-500" },
  { label: "Price Alert", icon: Bell, color: "bg-orange-500" },
  { label: "Compare", icon: Filter, color: "bg-purple-500" },
  { label: "Reviews", icon: Star, color: "bg-yellow-500" }
];

interface BuyerSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function BuyerSidebar({ isCollapsed, setIsCollapsed }: BuyerSidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-72"
      )}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 288 }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-neutral-800">Buyer Hub</h2>
                <p className="text-xs text-neutral-500">Procurement Center</p>
              </div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 p-0 hover:bg-neutral-100"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-neutral-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-neutral-800">{user.username}</p>
                <p className="text-sm text-blue-600">Premium Buyer</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div>
                <p className="text-lg font-bold text-neutral-800">142</p>
                <p className="text-xs text-neutral-500">Orders</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-800">28</p>
                <p className="text-xs text-neutral-500">Suppliers</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-800">4.9</p>
                <p className="text-xs text-neutral-500">Rating</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {!isCollapsed && (
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              Buyer Tools
            </p>
          )}
          
          <div className="space-y-2">
            {buyerSidebarItems.map((item, index) => {
              const isActive = location === item.href;
              
              return (
                <Link key={index} href={item.href}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 shadow-sm border border-blue-100"
                        : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50",
                      isCollapsed && "justify-center p-2"
                    )}
                    whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      "flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-blue-600" : "text-neutral-500 group-hover:text-neutral-700"
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-neutral-500">{item.description}</p>
                      </div>
                    )}
                    {!isCollapsed && item.badge && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          {!isCollapsed && (
            <div className="mt-8">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", action.color)}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-neutral-700">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200">
          <div className={cn("flex gap-2", isCollapsed && "flex-col items-center")}>
            <Link href="/profile">
              <Button variant="outline" size="sm" className={cn("flex-1", isCollapsed && "w-full p-2")}>
                <User className="w-4 h-4" />
                {!isCollapsed && <span className="ml-2">Profile</span>}
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="sm" className={cn("flex-1", isCollapsed && "w-full p-2")}>
                <Settings className="w-4 h-4" />
                {!isCollapsed && <span className="ml-2">Settings</span>}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}