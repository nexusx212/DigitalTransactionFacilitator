import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  Plus,
  Route,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export function LogisticsDashboard() {
  const { data: shipments } = useQuery({
    queryKey: ["/api/shipments"],
  });

  const { data: routes } = useQuery({
    queryKey: ["/api/routes"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logistics Dashboard</h1>
          <p className="text-muted-foreground">Manage shipments and logistics operations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Shipment
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Across 8 countries
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$78,540</div>
            <p className="text-xs text-muted-foreground">
              +18.7% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Shipments */}
        <Card>
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>
            <CardDescription>Current shipments in transit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">SH-2024-001</p>
                  <p className="text-xs text-muted-foreground">Lagos → Nairobi</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">
                    <Truck className="mr-1 h-3 w-3" />
                    In Transit
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">ETA: 2 days</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">SH-2024-002</p>
                  <p className="text-xs text-muted-foreground">Accra → Cairo</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">
                    <MapPin className="mr-1 h-3 w-3" />
                    At Port
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">ETA: 5 days</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">SH-2024-003</p>
                  <p className="text-xs text-muted-foreground">Durban → Dar es Salaam</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Delayed
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">ETA: 7 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>Successfully completed shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">SH-2024-045</p>
                  <p className="text-xs text-muted-foreground">Casablanca → Tunis</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Delivered
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">On time</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">SH-2024-044</p>
                  <p className="text-xs text-muted-foreground">Abidjan → Bamako</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Delivered
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">1 day early</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">SH-2024-043</p>
                  <p className="text-xs text-muted-foreground">Kigali → Kampala</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Delivered
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">On time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common logistics tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <Truck className="mr-2 h-4 w-4" />
              Track Shipments
            </Button>
            <Button variant="outline" className="justify-start">
              <Route className="mr-2 h-4 w-4" />
              Plan Routes
            </Button>
            <Button variant="outline" className="justify-start">
              <Package className="mr-2 h-4 w-4" />
              Manage Inventory
            </Button>
            <Button variant="outline" className="justify-start">
              <MapPin className="mr-2 h-4 w-4" />
              Fleet Management
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}