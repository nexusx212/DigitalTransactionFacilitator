import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { AddProductDialog } from "@/components/add-product-dialog";
import { useState } from "react";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plus,
  BarChart3,
  FileText,
  MessageSquare
} from "lucide-react";

export function ExporterDashboard() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products/my"],
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders/export"],
  });

  const { data: analytics = {} } = useQuery({
    queryKey: ["/api/analytics/export"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exporter Dashboard</h1>
          <p className="text-muted-foreground">Manage your export business and trade opportunities</p>
        </div>
        <Button onClick={() => setIsAddProductOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.filter((o: any) => o.status === 'active')?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyer Inquiries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +5 new this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Your latest product listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products?.slice(0, 5).map((product: any) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${product.price}</p>
                    <Badge variant={product.isVerified ? "default" : "secondary"}>
                      {product.isVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No products yet. Add your first product to get started.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common exporter tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="outline" className="justify-start">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Request Trade Finance
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with Buyers
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Export Orders</CardTitle>
          <CardDescription>Track your export transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders?.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Order #{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.buyerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${order.amount}</p>
                  <Badge variant={
                    order.status === 'completed' ? 'default' : 
                    order.status === 'processing' ? 'secondary' : 'destructive'
                  }>
                    {order.status}
                  </Badge>
                </div>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground">No orders yet. Start selling to see orders here.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <AddProductDialog 
        open={isAddProductOpen} 
        onOpenChange={setIsAddProductOpen} 
      />
    </div>
  );
}