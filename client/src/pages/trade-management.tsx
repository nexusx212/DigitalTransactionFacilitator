import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TradeOrder {
  id: string;
  orderNumber: string;
  product: string;
  buyer: string;
  seller: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'completed';
  currency: string;
  orderDate: string;
  expectedDelivery: string;
  country: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue';
}

interface TradeContract {
  id: string;
  contractNumber: string;
  parties: string[];
  product: string;
  terms: string;
  value: number;
  currency: string;
  status: 'draft' | 'active' | 'completed' | 'disputed';
  createdDate: string;
  expiryDate: string;
  smartContractAddress?: string;
}

interface ShipmentTracking {
  id: string;
  trackingNumber: string;
  orderId: string;
  currentLocation: string;
  status: 'preparing' | 'shipped' | 'in-transit' | 'customs' | 'delivered';
  estimatedDelivery: string;
  carrier: string;
  updates: {
    timestamp: string;
    location: string;
    status: string;
    description: string;
  }[];
}

export default function TradeManagement() {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for trade orders
  const [tradeOrders] = useState<TradeOrder[]>([
    {
      id: "ORD-001",
      orderNumber: "TRD-2024-001",
      product: "Premium Cocoa Beans",
      buyer: "European Chocolate Co.",
      seller: "Ghana Cocoa Exports Ltd",
      quantity: 5000,
      unitPrice: 3.2,
      totalValue: 16000,
      status: "confirmed",
      currency: "USD",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-02-20",
      country: "Ghana",
      paymentStatus: "paid"
    },
    {
      id: "ORD-002",
      orderNumber: "TRD-2024-002",
      product: "Organic Coffee Beans",
      buyer: "North American Imports",
      seller: "Ethiopian Coffee Cooperative",
      quantity: 2000,
      unitPrice: 5.8,
      totalValue: 11600,
      status: "shipped",
      currency: "USD",
      orderDate: "2024-01-18",
      expectedDelivery: "2024-02-25",
      country: "Ethiopia",
      paymentStatus: "paid"
    },
    {
      id: "ORD-003",
      orderNumber: "TRD-2024-003",
      product: "Cashew Nuts",
      buyer: "Asian Markets Inc.",
      seller: "Nigerian Cashew Processors",
      quantity: 3000,
      unitPrice: 4.5,
      totalValue: 13500,
      status: "pending",
      currency: "USD",
      orderDate: "2024-01-20",
      expectedDelivery: "2024-03-05",
      country: "Nigeria",
      paymentStatus: "pending"
    }
  ]);

  // Mock data for contracts
  const [tradeContracts] = useState<TradeContract[]>([
    {
      id: "CTR-001",
      contractNumber: "TC-2024-001",
      parties: ["Global Spice Traders", "Mediterranean Foods Ltd"],
      product: "Black Pepper (Premium Grade)",
      terms: "FOB Port, 30-day payment terms",
      value: 75000,
      currency: "USD",
      status: "active",
      createdDate: "2024-01-10",
      expiryDate: "2024-12-31",
      smartContractAddress: "0x742d35Cc6639C0532fba96b9c8..."
    },
    {
      id: "CTR-002", 
      contractNumber: "TC-2024-002",
      parties: ["African Textile Exports", "European Fashion Group"],
      product: "Organic Cotton Fabric",
      terms: "CIF Delivery, 45-day payment terms",
      value: 120000,
      currency: "EUR",
      status: "active",
      createdDate: "2024-01-12",
      expiryDate: "2024-06-30"
    }
  ]);

  // Mock data for shipment tracking
  const [shipmentTracking] = useState<ShipmentTracking[]>([
    {
      id: "SHP-001",
      trackingNumber: "MAEU-789456123",
      orderId: "ORD-002",
      currentLocation: "Suez Canal, Egypt",
      status: "in-transit",
      estimatedDelivery: "2024-02-25",
      carrier: "Maersk Line",
      updates: [
        {
          timestamp: "2024-01-25T08:00:00Z",
          location: "Addis Ababa Port, Ethiopia",
          status: "shipped",
          description: "Container loaded and departed from origin port"
        },
        {
          timestamp: "2024-01-28T14:30:00Z",
          location: "Djibouti Port, Djibouti",
          status: "in-transit",
          description: "Container in transit through Djibouti"
        },
        {
          timestamp: "2024-02-02T09:15:00Z",
          location: "Suez Canal, Egypt",
          status: "in-transit",
          description: "Container passing through Suez Canal"
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'disputed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = tradeOrders.filter(order => {
    const matchesSearch = order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredContracts = tradeContracts.filter(contract => {
    const matchesSearch = contract.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.parties.some(party => party.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-4 md:p-6">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-semibold mb-4">
            <span className="material-icons text-sm">business_center</span>
            Trade Management Hub
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Manage Your Trade Operations
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Track orders, manage contracts, and monitor shipments all in one place
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                <Input
                  placeholder="Search orders, contracts, or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-blue-200 rounded-xl h-12"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 border-2 border-blue-200 rounded-xl h-12">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-2 h-14">
          <TabsTrigger value="orders" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <span className="material-icons mr-2">shopping_cart</span>
            Trade Orders
          </TabsTrigger>
          <TabsTrigger value="contracts" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <span className="material-icons mr-2">description</span>
            Contracts
          </TabsTrigger>
          <TabsTrigger value="shipments" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <span className="material-icons mr-2">local_shipping</span>
            Shipments
          </TabsTrigger>
        </TabsList>

        {/* Trade Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-blue-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                          {order.product}
                        </CardTitle>
                        <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`px-3 py-1 font-semibold border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge className={`px-3 py-1 font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          Payment: {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="material-icons text-blue-600">person</span>
                          <div>
                            <p className="text-sm text-gray-500">Buyer</p>
                            <p className="font-semibold text-gray-800">{order.buyer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-icons text-green-600">business</span>
                          <div>
                            <p className="text-sm text-gray-500">Seller</p>
                            <p className="font-semibold text-gray-800">{order.seller}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-icons text-purple-600">location_on</span>
                          <div>
                            <p className="text-sm text-gray-500">Origin Country</p>
                            <p className="font-semibold text-gray-800">{order.country}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Quantity</p>
                              <p className="font-bold text-blue-800">{order.quantity.toLocaleString()} kg</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Unit Price</p>
                              <p className="font-bold text-blue-800">${order.unitPrice}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-gray-500">Total Value</p>
                              <p className="text-2xl font-bold text-blue-800">
                                ${order.totalValue.toLocaleString()} {order.currency}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-icons text-orange-600">schedule</span>
                          <div>
                            <p className="text-sm text-gray-500">Expected Delivery</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(order.expectedDelivery).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl">
                        <span className="material-icons mr-2 text-sm">visibility</span>
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl">
                        <span className="material-icons mr-2 text-sm">edit</span>
                        Edit Order
                      </Button>
                      <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50 rounded-xl">
                        <span className="material-icons mr-2 text-sm">local_shipping</span>
                        Track Shipment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-6">
          <div className="grid gap-6">
            {filteredContracts.map((contract) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-teal-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                          {contract.product}
                        </CardTitle>
                        <p className="text-sm text-gray-600">Contract #{contract.contractNumber}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`px-3 py-1 font-semibold border ${getStatusColor(contract.status)}`}>
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </Badge>
                        {contract.smartContractAddress && (
                          <Badge className="px-3 py-1 font-semibold bg-purple-100 text-purple-800 border-purple-200">
                            Smart Contract
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Contract Parties</p>
                          <div className="space-y-2">
                            {contract.parties.map((party, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-teal-100 text-teal-800 text-xs">
                                    {party.split(' ').map(w => w[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-gray-800">{party}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Terms & Conditions</p>
                          <p className="font-semibold text-gray-800">{contract.terms}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-500">Contract Value</p>
                              <p className="text-2xl font-bold text-teal-800">
                                ${contract.value.toLocaleString()} {contract.currency}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Created</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(contract.createdDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Expires</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(contract.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {contract.smartContractAddress && (
                          <div>
                            <p className="text-sm text-gray-500">Smart Contract Address</p>
                            <p className="font-mono text-xs text-purple-700 bg-purple-50 p-2 rounded">
                              {contract.smartContractAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <Button size="sm" className="bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white rounded-xl">
                        <span className="material-icons mr-2 text-sm">description</span>
                        View Contract
                      </Button>
                      <Button variant="outline" size="sm" className="border-teal-300 text-teal-700 hover:bg-teal-50 rounded-xl">
                        <span className="material-icons mr-2 text-sm">edit</span>
                        Modify Terms
                      </Button>
                      {contract.smartContractAddress && (
                        <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50 rounded-xl">
                          <span className="material-icons mr-2 text-sm">link</span>
                          View on Blockchain
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Shipments Tab */}
        <TabsContent value="shipments" className="space-y-6">
          <div className="grid gap-6">
            {shipmentTracking.map((shipment) => (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-orange-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                          Tracking: {shipment.trackingNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600">Order ID: {shipment.orderId}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`px-3 py-1 font-semibold border ${getStatusColor(shipment.status)}`}>
                          {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                        </Badge>
                        <Badge className="px-3 py-1 font-semibold bg-orange-100 text-orange-800 border-orange-200">
                          {shipment.carrier}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="material-icons text-orange-600">location_on</span>
                          <div>
                            <p className="text-sm text-gray-500">Current Location</p>
                            <p className="font-bold text-orange-800">{shipment.currentLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-icons text-green-600">schedule</span>
                          <div>
                            <p className="text-sm text-gray-500">Estimated Delivery</p>
                            <p className="font-bold text-green-800">
                              {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 mb-3">Shipment History</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {shipment.updates.map((update, index) => (
                            <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">{update.location}</p>
                                <p className="text-xs text-gray-600">{update.description}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(update.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl">
                        <span className="material-icons mr-2 text-sm">track_changes</span>
                        Full Tracking
                      </Button>
                      <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl">
                        <span className="material-icons mr-2 text-sm">notifications</span>
                        Set Alerts
                      </Button>
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl">
                        <span className="material-icons mr-2 text-sm">contact_support</span>
                        Contact Carrier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}