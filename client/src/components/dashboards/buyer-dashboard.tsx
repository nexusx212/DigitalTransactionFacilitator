import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  TrendingDown, 
  Plus,
  Package,
  MessageSquare,
  CreditCard,
  Globe,
  Truck,
  Star,
  Filter,
  Eye,
  Clock
} from "lucide-react";

export function BuyerDashboard() {
  const { user } = useAuth();
  
  const { data: orders } = useQuery({
    queryKey: ["/api/orders/my"],
  });

  const { data: wishlist } = useQuery({
    queryKey: ["/api/wishlist"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/buyer"],
  });

  // Mock data for demonstration
  const mockOrders = [
    { id: "ORD-001", productName: "Premium Coffee Beans", amount: 2500, status: "shipped", supplier: "Ethiopian Coffee Co.", date: "2024-01-15" },
    { id: "ORD-002", productName: "Organic Cashew Nuts", amount: 1800, status: "processing", supplier: "Ghana Nuts Ltd", date: "2024-01-14" },
    { id: "ORD-003", productName: "Raw Cocoa Beans", amount: 3200, status: "delivered", supplier: "Ivory Coast Exports", date: "2024-01-12" },
  ];

  const mockRecommendations = [
    { id: 1, name: "Premium Quinoa", supplier: "Bolivia Trade Co.", price: 450, rating: 4.8, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
    { id: 2, name: "Organic Vanilla Pods", supplier: "Madagascar Vanilla", price: 890, rating: 4.9, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400" },
    { id: 3, name: "Raw Shea Butter", supplier: "Ghana Cosmetics", price: 320, rating: 4.7, image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400" },
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
            Welcome back, {user?.name?.split(' ')[0] || 'Buyer'}! 👋
          </h1>
          <p className="text-neutral-600">Discover quality products and manage your global imports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Advanced Search
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Search className="w-4 h-4" />
            Browse Marketplace
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
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Active Orders</CardTitle>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{mockOrders.filter(o => o.status !== 'delivered').length}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              3 in transit
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Spent</CardTitle>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">$7,500</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Suppliers</CardTitle>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">15</div>
            <p className="text-xs text-purple-600 flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Active partnerships
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Avg. Savings</CardTitle>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">22%</div>
            <p className="text-xs text-orange-600 flex items-center gap-1">
              <Heart className="w-3 h-3" />
              vs market prices
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Orders */}
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
                    <Package className="w-5 h-5 text-blue-600" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Track your import orders and shipments</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order, index) => (
                  <motion.div 
                    key={order.id} 
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {order.status === 'delivered' ? <Package className="w-5 h-5" /> :
                         order.status === 'shipped' ? <Truck className="w-5 h-5" /> :
                         <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">{order.productName}</p>
                        <p className="text-sm text-neutral-600">{order.supplier} • {order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-800">${order.amount.toLocaleString()}</p>
                      <Badge variant={
                        order.status === 'delivered' ? 'default' : 
                        order.status === 'shipped' ? 'secondary' : 'outline'
                      } className="mt-1">
                        {order.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Streamline your buying process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Search Products</p>
                    <p className="text-xs text-neutral-500">Find quality suppliers</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Track Orders</p>
                    <p className="text-xs text-neutral-500">Monitor shipments</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Contact Suppliers</p>
                    <p className="text-xs text-neutral-500">Direct communication</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Trade Finance</p>
                    <p className="text-xs text-neutral-500">Secure funding</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommended Products */}
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
                  <Star className="w-5 h-5 text-yellow-500" />
                  Recommended for You
                </CardTitle>
                <CardDescription>Premium products curated based on your preferences</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="w-4 h-4" />
                View More
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockRecommendations.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  className="group border border-neutral-200 rounded-xl p-4 space-y-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-neutral-800">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600">{product.supplier}</p>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-neutral-800">${product.price}</span>
                        <span className="text-sm text-neutral-500 ml-1">per unit</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Heart className="w-3 h-3" />
                        </Button>
                        <Button size="sm" className="gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Plus className="w-3 h-3" />
                          Inquire
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}