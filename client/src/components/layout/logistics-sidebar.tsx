import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import {
  Truck,
  Package,
  Route,
  MapPin,
  Clock,
  BarChart3,
  MessageSquare,
  Bell,
  Navigation,
  Ship,
  Plane,
  Calendar,
  Shield,
  AlertTriangle,
  Users,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Target,
  Fuel,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const logisticsSidebarItems = [
  {
    title: "Control Center",
    href: "/logistics",
    icon: BarChart3,
    description: "Operations overview"
  },
  {
    title: "Active Shipments",
    href: "/shipments",
    icon: Package,
    description: "Track deliveries",
    badge: "24"
  },
  {
    title: "Fleet Management",
    href: "/fleet",
    icon: Truck,
    description: "Vehicle status",
    badge: "8"
  },
  {
    title: "Route Planning",
    href: "/routes",
    icon: Route,
    description: "Optimize paths"
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: Calendar,
    description: "Delivery calendar",
    badge: "15"
  },
  {
    title: "Driver Network",
    href: "/drivers",
    icon: Users,
    description: "Team management"
  },
  {
    title: "Warehouse",
    href: "/warehouse",
    icon: MapPin,
    description: "Storage facilities"
  },
  {
    title: "Communications",
    href: "/chat",
    icon: MessageSquare,
    description: "Client updates",
    badge: "12"
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
    description: "System notifications",
    badge: "3"
  }
];

const fleetOverview = [
  { type: "Road", count: 15, icon: Truck, status: "active", color: "text-green-600" },
  { type: "Maritime", count: 8, icon: Ship, status: "operational", color: "text-blue-600" },
  { type: "Air", count: 5, icon: Plane, status: "available", color: "text-purple-600" }
];

const quickActions = [
  { label: "New Route", icon: Plus, color: "bg-green-500" },
  { label: "Track", icon: Navigation, color: "bg-blue-500" },
  { label: "Maintenance", icon: Wrench, color: "bg-orange-500" },
  { label: "Fuel", icon: Fuel, color: "bg-red-500" }
];

interface LogisticsSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function LogisticsSidebar({ isCollapsed, setIsCollapsed }: LogisticsSidebarProps) {
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
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-neutral-800">Logistics Hub</h2>
                <p className="text-xs text-neutral-500">Operations Center</p>
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

        {/* Operations Status */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-neutral-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-neutral-800">Operations Online</p>
                <p className="text-sm text-green-600">All systems active</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-neutral-800">94.2%</p>
                <p className="text-xs text-neutral-500">On-Time</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-800">28</p>
                <p className="text-xs text-neutral-500">Active</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-800">91%</p>
                <p className="text-xs text-neutral-500">Efficiency</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {!isCollapsed && (
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              Logistics Operations
            </p>
          )}
          
          <div className="space-y-2">
            {logisticsSidebarItems.map((item, index) => {
              const isActive = location === item.href;
              
              return (
                <Link key={index} href={item.href}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-600 shadow-sm border border-green-100"
                        : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50",
                      isCollapsed && "justify-center p-2"
                    )}
                    whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      "flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-green-600" : "text-neutral-500 group-hover:text-neutral-700"
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
                      <Badge variant="secondary" className="bg-green-100 text-green-600 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Fleet Overview */}
          {!isCollapsed && (
            <div className="mt-8">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
                Fleet Status
              </p>
              <div className="space-y-3">
                {fleetOverview.map((fleet, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <fleet.icon className={cn("w-4 h-4", fleet.color)} />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">{fleet.type}</p>
                        <p className="text-xs text-neutral-500">{fleet.status}</p>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-800">{fleet.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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