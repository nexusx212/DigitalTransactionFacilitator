import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  Plus,
  Handshake,
  Target,
  Award
} from "lucide-react";

export function AgentDashboard() {
  const { data: clients } = useQuery({
    queryKey: ["/api/agent/clients"],
  });

  const { data: deals } = useQuery({
    queryKey: ["/api/agent/deals"],
  });

  const { data: commission } = useQuery({
    queryKey: ["/api/agent/commission"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Dashboard</h1>
          <p className="text-muted-foreground">Manage clients and track commission earnings</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              +8 this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">
              +22.4% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              $340K total value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Above industry average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Deals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>Your latest brokered transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Coffee Export Deal</p>
                  <p className="text-xs text-muted-foreground">Ethiopia → Germany</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$85,000</p>
                  <Badge variant="default">Completed</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Commission: $2,550</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Textile Order</p>
                  <p className="text-xs text-muted-foreground">Morocco → UK</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$120,000</p>
                  <Badge variant="secondary">In Progress</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Expected: $3,600</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mining Equipment</p>
                  <p className="text-xs text-muted-foreground">South Africa → Ghana</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$450,000</p>
                  <Badge variant="outline">Negotiating</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Expected: $13,500</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
            <CardDescription>Your highest value clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">African Mining Corp</p>
                  <p className="text-xs text-muted-foreground">Premium client</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$1.2M</p>
                  <p className="text-xs text-muted-foreground">Total volume</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Global Textiles Ltd</p>
                  <p className="text-xs text-muted-foreground">Regular client</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$850K</p>
                  <p className="text-xs text-muted-foreground">Total volume</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Agro Exports Inc</p>
                  <p className="text-xs text-muted-foreground">New client</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$320K</p>
                  <p className="text-xs text-muted-foreground">Total volume</p>
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
          <CardDescription>Common agent tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Clients
            </Button>
            <Button variant="outline" className="justify-start">
              <Handshake className="mr-2 h-4 w-4" />
              Track Deals
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Client Communication
            </Button>
            <Button variant="outline" className="justify-start">
              <Award className="mr-2 h-4 w-4" />
              Commission Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}