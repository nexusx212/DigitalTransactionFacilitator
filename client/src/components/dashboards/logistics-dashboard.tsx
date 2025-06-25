import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Plus,
  Ship,
  Plane,
  AlertCircle,
  TrendingUp,
  Globe,
  Route,
  Anchor,
  Navigation,
  Timer,
  Shield,
  BarChart3,
  Eye,
  MessageSquare,
  Calendar
} from "lucide-react";

export function LogisticsDashboard() {
  const { user } = useAuth();
  
  const { data: shipments } = useQuery({
    queryKey: ["/api/shipments"],
  });

  const { data: routes } = useQuery({
    queryKey: ["/api/routes"],
  });

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/logistics"],
  });

  // Mock data for demonstration
  const mockShipments = [
    { 
      id: "SH-001", 
      origin: "Lagos, Nigeria", 
      destination: "Accra, Ghana", 
      status: "in-transit", 
      client: "Ghana Imports Ltd",
      eta: "2024-01-20",
      progress: 65,
      method: "road"
    },
    { 
      id: "SH-002", 
      origin: "Durban, South Africa", 
      destination: "Mombasa, Kenya", 
      status: "loading", 
      client: "East Africa Trading",
      eta: "2024-01-25",
      progress: 15,
      method: "sea"
    },
    { 
      id: "SH-003", 
      origin: "Cairo, Egypt", 
      destination: "Casablanca, Morocco", 
      status: "delivered", 
      client: "Morocco Exports Co",
      eta: "2024-01-18",
      progress: 100,
      method: "air"
    },
    { 
      id: "SH-004", 
      origin: "Addis Ababa, Ethiopia", 
      destination: "Kigali, Rwanda", 
      status: "scheduled", 
      client: "Rwanda Coffee Corp",
      eta: "2024-01-22",
      progress: 5,
      method: "road"
    }
  ];

  const mockRoutes = [
    { id: 1, name: "West Africa Corridor", distance: "1,450 km", duration: "3-4 days", capacity: "20 tons", efficiency: 92 },
    { id: 2, name: "East Africa Maritime", distance: "2,800 km", duration: "7-10 days", capacity: "500 tons", efficiency: 88 },
    { id: 3, name: "North Africa Express", distance: "1,200 km", duration: "2-3 days", capacity: "15 tons", efficiency: 95 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-2">
            Logistics Control Center 🚛
          </h1>
          <p className="text-neutral-600">Monitor shipments, optimize routes, and manage your logistics operations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Route className="w-4 h-4" />
            Route Optimizer
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Plus className="w-4 h-4" />
            New Shipment
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Active Shipments</CardTitle>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{mockShipments.filter(s => s.status !== 'delivered').length}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">On-Time Delivery</CardTitle>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">94.2%</div>
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Excellent performance
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Active Routes</CardTitle>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Route className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{mockRoutes.length}</div>
            <p className="text-xs text-purple-600 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Cross-border coverage
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Fleet Efficiency</CardTitle>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">91.5%</div>
            <p className="text-xs text-orange-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Above industry avg
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Shipments */}
        <motion.div 
          className="lg:col-span-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-600" />
                    Active Shipments
                  </CardTitle>
                  <CardDescription>Monitor real-time shipment progress and delivery status</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockShipments.map((shipment, index) => (
                  <motion.div 
                    key={shipment.id} 
                    className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          shipment.status === 'delivered' ? 'bg-green-100 text-green-600' :
                          shipment.status === 'in-transit' ? 'bg-blue-100 text-blue-600' :
                          shipment.status === 'loading' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {shipment.method === 'road' ? <Truck className="w-5 h-5" /> :
                           shipment.method === 'sea' ? <Ship className="w-5 h-5" /> :
                           shipment.method === 'air' ? <Plane className="w-5 h-5" /> :
                           <Package className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800">{shipment.id}</p>
                          <p className="text-sm text-neutral-600">{shipment.client}</p>
                        </div>
                      </div>
                      <Badge variant={
                        shipment.status === 'delivered' ? 'default' : 
                        shipment.status === 'in-transit' ? 'secondary' : 
                        shipment.status === 'loading' ? 'outline' : 'destructive'
                      }>
                        {shipment.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-neutral-500">Origin</p>
                        <p className="text-sm font-medium">{shipment.origin}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Destination</p>
                        <p className="text-sm font-medium">{shipment.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                          <span>Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <Progress value={shipment.progress} className="h-2" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500">ETA</p>
                        <p className="text-sm font-medium">{shipment.eta}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Route Efficiency */}
        <motion.div 
          className="lg:col-span-4 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Streamline logistics operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Create Shipment</p>
                    <p className="text-xs text-neutral-500">New delivery order</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Route className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Route Optimizer</p>
                    <p className="text-xs text-neutral-500">Plan efficient routes</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fleet Analytics</p>
                    <p className="text-xs text-neutral-500">Performance insights</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Client Updates</p>
                    <p className="text-xs text-neutral-500">Send notifications</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Route Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-purple-600" />
                Route Efficiency
              </CardTitle>
              <CardDescription>Performance by route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRoutes.slice(0, 3).map((route, index) => (
                  <div key={route.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{route.name}</p>
                      <span className="text-sm text-neutral-600">{route.efficiency}%</span>
                    </div>
                    <Progress value={route.efficiency} className="h-2" />
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>{route.distance}</span>
                      <span>{route.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fleet Overview & Route Network */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Fleet & Route Network
                </CardTitle>
                <CardDescription>Monitor vehicle status, routes, and network coverage across Africa</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Maintenance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Fleet Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-800 mb-4">Fleet Status</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Road Fleet</p>
                        <p className="text-sm text-green-600">15 vehicles active</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-900">87%</p>
                      <p className="text-xs text-green-600">Utilization</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Ship className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Maritime Fleet</p>
                        <p className="text-sm text-blue-600">8 vessels operational</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">92%</p>
                      <p className="text-xs text-blue-600">Utilization</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Plane className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-800">Air Cargo</p>
                        <p className="text-sm text-purple-600">5 aircraft available</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-900">78%</p>
                      <p className="text-xs text-purple-600">Utilization</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Network */}
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-800 mb-4">Primary Routes</h3>
                <div className="space-y-3">
                  {mockRoutes.map((route, index) => (
                    <motion.div 
                      key={route.id}
                      className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-neutral-800">{route.name}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          route.efficiency >= 95 ? 'bg-green-100 text-green-700' :
                          route.efficiency >= 90 ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {route.efficiency}% efficient
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-neutral-600">
                        <div>
                          <p className="text-xs text-neutral-500">Distance</p>
                          <p className="font-medium">{route.distance}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Duration</p>
                          <p className="font-medium">{route.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Capacity</p>
                          <p className="font-medium">{route.capacity}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}