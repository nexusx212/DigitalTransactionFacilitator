import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  TrendingDown, 
  Plus,
  Package,
  MessageSquare,
  CreditCard
} from "lucide-react";

export function BuyerDashboard() {
  const { data: orders } = useQuery({
    queryKey: ["/api/orders/my"],
  });

  const { data: wishlist } = useQuery({
    queryKey: ["/api/wishlist"],
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/products/recommended"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Discover products and manage your imports</p>
        </div>
        <Button>
          <Search className="mr-2 h-4 w-4" />
          Browse Products
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.filter((o: any) => o.status === 'active')?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishlist?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              2 price drops this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18%</div>
            <p className="text-xs text-muted-foreground">
              vs market prices
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track your import orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders?.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Order #{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${order.amount}</p>
                    <Badge variant={
                      order.status === 'delivered' ? 'default' : 
                      order.status === 'shipped' ? 'secondary' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No orders yet. Start shopping to see orders here.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common buyer tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="outline" className="justify-start">
                <Search className="mr-2 h-4 w-4" />
                Search Products
              </Button>
              <Button variant="outline" className="justify-start">
                <Package className="mr-2 h-4 w-4" />
                Track Orders
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Suppliers
              </Button>
              <Button variant="outline" className="justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Request Trade Finance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Products based on your interests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations?.slice(0, 6).map((product: any) => (
              <div key={product.id} className="border rounded-lg p-4 space-y-2">
                <div className="aspect-square bg-muted rounded-md"></div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.supplier}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">${product.price}</span>
                  <Button size="sm">
                    <Plus className="mr-1 h-3 w-3" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground col-span-3">
                Browse products to get personalized recommendations.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}