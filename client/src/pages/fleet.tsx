import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { LogisticsSidebar } from "@/components/layout/logistics-sidebar";
import { 
  Truck, 
  Ship, 
  Plane, 
  Search, 
  Filter, 
  Plus, 
  MapPin,
  Fuel,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3
} from "lucide-react";

export default function FleetPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mockFleet = [
    {
      id: "VH-001",
      name: "Lagos Express",
      type: "truck",
      status: "active",
      location: "Lagos, Nigeria",
      driver: "Adebayo Johnson",
      utilization: 87,
      fuelLevel: 75,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      capacity: "20 tons",
      currentLoad: "17.4 tons"
    },
    {
      id: "VH-002",
      name: "African Star",
      type: "ship",
      status: "operational",
      location: "Port of Durban",
      captain: "Samuel Mthembu",
      utilization: 92,
      fuelLevel: 60,
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-03-05",
      capacity: "500 tons",
      currentLoad: "460 tons"
    },
    {
      id: "VH-003",
      name: "Sahara Wing",
      type: "plane",
      status: "maintenance",
      location: "Cairo Airport",
      pilot: "Mohamed Hassan",
      utilization: 0,
      fuelLevel: 0,
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-01-25",
      capacity: "5 tons",
      currentLoad: "0 tons"
    },
    {
      id: "VH-004",
      name: "Accra Freight",
      type: "truck",
      status: "active",
      location: "Accra, Ghana",
      driver: "Kwame Asante",
      utilization: 65,
      fuelLevel: 90,
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-02-15",
      capacity: "15 tons",
      currentLoad: "9.8 tons"
    }
  ];

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'truck': return Truck;
      case 'ship': return Ship;
      case 'plane': return Plane;
      default: return Truck;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'operational': return 'bg-blue-100 text-blue-600';
      case 'maintenance': return 'bg-orange-100 text-orange-600';
      case 'inactive': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <LogisticsSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-72'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-2">
                Fleet Management
              </h1>
              <p className="text-neutral-600">Monitor and manage your transportation fleet</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Plus className="w-4 h-4" />
                Add Vehicle
              </Button>
            </div>
          </motion.div>

          {/* Fleet Overview */}
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Active Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {mockFleet.filter(v => v.status === 'active' || v.status === 'operational').length}
                </div>
                <p className="text-xs text-green-600">Out of {mockFleet.length} total</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Avg Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">86%</div>
                <p className="text-xs text-blue-600">Above target</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Maintenance Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">
                  {mockFleet.filter(v => v.status === 'maintenance').length}
                </div>
                <p className="text-xs text-orange-600">This week</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Total Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">540</div>
                <p className="text-xs text-purple-600">Tons available</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      placeholder="Search vehicles by name, ID, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Fleet List */}
          <motion.div
            className="grid gap-6 lg:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {mockFleet.map((vehicle, index) => {
              const VehicleIcon = getVehicleIcon(vehicle.type);
              
              return (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(vehicle.status)}`}>
                            <VehicleIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-800">{vehicle.name}</h3>
                            <p className="text-sm text-neutral-600">{vehicle.id}</p>
                          </div>
                        </div>
                        <Badge variant={vehicle.status === 'maintenance' ? 'destructive' : 'default'}>
                          {vehicle.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                              <MapPin className="w-4 h-4" />
                              Location
                            </div>
                            <p className="font-medium">{vehicle.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">
                              {vehicle.type === 'ship' ? 'Captain' : vehicle.type === 'plane' ? 'Pilot' : 'Driver'}
                            </p>
                            <p className="font-medium">{vehicle.type === 'ship' ? vehicle.captain : vehicle.type === 'plane' ? vehicle.pilot : vehicle.driver}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-neutral-500">Capacity</p>
                            <p className="font-medium">{vehicle.capacity}</p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Current Load</p>
                            <p className="font-medium">{vehicle.currentLoad}</p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Fuel Level</p>
                            <p className="font-medium">{vehicle.fuelLevel}%</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-neutral-600">Utilization</span>
                            <span className="font-medium">{vehicle.utilization}%</span>
                          </div>
                          <Progress value={vehicle.utilization} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Wrench className="w-4 h-4" />
                            <span>Next Maintenance: {vehicle.nextMaintenance}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Calendar className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Fuel className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}