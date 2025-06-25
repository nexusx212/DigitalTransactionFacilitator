import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BuyerSidebar } from "@/components/layout/buyer-sidebar";
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Truck, 
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";

export default function OrdersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mockOrders = [
    {
      id: "ORD-2024-001",
      supplier: "Ghana Coffee Exports Ltd",
      items: "Premium Arabica Coffee Beans",
      quantity: "500kg",
      status: "delivered",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-22",
      total: "$3,250",
      progress: 100
    },
    {
      id: "ORD-2024-002", 
      supplier: "Kenya Tea Growers",
      items: "Earl Grey Tea Leaves",
      quantity: "200kg",
      status: "in-transit",
      orderDate: "2024-01-18",
      deliveryDate: "2024-01-25",
      total: "$1,800",
      progress: 75
    },
    {
      id: "ORD-2024-003",
      supplier: "Nigerian Textile Mills",
      items: "Cotton Fabric Rolls",
      quantity: "100 rolls",
      status: "processing",
      orderDate: "2024-01-20",
      deliveryDate: "2024-01-28",
      total: "$4,500",
      progress: 30
    },
    {
      id: "ORD-2024-004",
      supplier: "South African Minerals Co",
      items: "Raw Copper Sheets",
      quantity: "2 tons",
      status: "pending",
      orderDate: "2024-01-22",
      deliveryDate: "2024-02-05",
      total: "$12,000",
      progress: 10
    }
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <BuyerSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      
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
                My Orders
              </h1>
              <p className="text-neutral-600">Track your purchases and manage order status</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter Orders
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4" />
                New Order
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
                      placeholder="Search orders by ID, supplier, or product..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders List */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {mockOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                          order.status === 'in-transit' ? 'bg-blue-100 text-blue-600' :
                          order.status === 'processing' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-800">{order.id}</h3>
                          <p className="text-sm text-neutral-600">{order.supplier}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          order.status === 'delivered' ? 'default' : 
                          order.status === 'in-transit' ? 'secondary' : 
                          order.status === 'processing' ? 'outline' : 'destructive'
                        }>
                          {order.status === 'delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {order.status === 'in-transit' && <Truck className="w-3 h-3 mr-1" />}
                          {order.status === 'processing' && <Clock className="w-3 h-3 mr-1" />}
                          {order.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-neutral-500">Product</p>
                          <p className="font-medium">{order.items}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Quantity</p>
                          <p className="font-medium">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Order Date</p>
                          <p className="font-medium">{order.orderDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Total Value</p>
                          <p className="font-medium text-green-600">{order.total}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-neutral-600">Order Progress</span>
                          <span className="font-medium">{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-neutral-500 mt-1">
                          <span>Expected Delivery: {order.deliveryDate}</span>
                          {order.status === 'in-transit' && (
                            <span className="text-blue-600">Tracking Available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}