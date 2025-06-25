import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Truck, 
  Ship, 
  Plane,
  MapPin,
  Clock,
  Eye
} from "lucide-react";

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockShipments = [
    { 
      id: "SH-001", 
      origin: "Lagos, Nigeria", 
      destination: "Accra, Ghana", 
      status: "in-transit", 
      client: "Ghana Imports Ltd",
      eta: "2024-01-20",
      progress: 65,
      method: "road",
      value: "$25,000",
      weight: "15 tons"
    },
    { 
      id: "SH-002", 
      origin: "Durban, South Africa", 
      destination: "Mombasa, Kenya", 
      status: "loading", 
      client: "East Africa Trading",
      eta: "2024-01-25",
      progress: 15,
      method: "sea",
      value: "$180,000",
      weight: "500 tons"
    },
    { 
      id: "SH-003", 
      origin: "Cairo, Egypt", 
      destination: "Casablanca, Morocco", 
      status: "delivered", 
      client: "Morocco Exports Co",
      eta: "2024-01-18",
      progress: 100,
      method: "air",
      value: "$45,000",
      weight: "2.5 tons"
    },
    { 
      id: "SH-004", 
      origin: "Addis Ababa, Ethiopia", 
      destination: "Kigali, Rwanda", 
      status: "scheduled", 
      client: "Rwanda Coffee Corp",
      eta: "2024-01-22",
      progress: 5,
      method: "road",
      value: "$12,000",
      weight: "8 tons"
    }
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
            Shipment Management
          </h1>
          <p className="text-neutral-600">Track and manage all your shipments across Africa</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Plus className="w-4 h-4" />
            New Shipment
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <Input
                  placeholder="Search shipments by ID, client, or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shipments Grid */}
      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {mockShipments.map((shipment, index) => (
          <motion.div
            key={shipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      shipment.status === 'delivered' ? 'bg-green-100 text-green-600' :
                      shipment.status === 'in-transit' ? 'bg-blue-100 text-blue-600' :
                      shipment.status === 'loading' ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {shipment.method === 'road' ? <Truck className="w-6 h-6" /> :
                       shipment.method === 'sea' ? <Ship className="w-6 h-6" /> :
                       shipment.method === 'air' ? <Plane className="w-6 h-6" /> :
                       <Package className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">{shipment.id}</h3>
                      <p className="text-sm text-neutral-600">{shipment.client}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={
                      shipment.status === 'delivered' ? 'default' : 
                      shipment.status === 'in-transit' ? 'secondary' : 
                      shipment.status === 'loading' ? 'outline' : 'destructive'
                    }>
                      {shipment.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        Origin
                      </div>
                      <p className="font-medium">{shipment.origin}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        Destination
                      </div>
                      <p className="font-medium">{shipment.destination}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500">Value</p>
                      <p className="font-medium">{shipment.value}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Weight</p>
                      <p className="font-medium">{shipment.weight}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">ETA</p>
                      <p className="font-medium">{shipment.eta}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-neutral-600">Progress</span>
                      <span className="font-medium">{shipment.progress}%</span>
                    </div>
                    <Progress value={shipment.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}