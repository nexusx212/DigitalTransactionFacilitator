import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

// Types
type Transaction = {
  id: string;
  type: "sent" | "received" | "exchanged";
  description: string;
  date: Date;
  transactionType: string;
  amount: number;
  currency: string;
  status?: "completed" | "pending" | "failed";
  recipient?: string;
};

type WalletBalance = {
  id: string;
  type: string;
  balance: number;
  currency: string;
  usdEquivalent?: number;
  change?: number; // Percentage change
  description?: string;
  icon?: string;
};

// Form schema for payments
const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  currency: z.string().min(1, "Currency is required"),
  recipientCountry: z.string().min(1, "Recipient country is required"),
  recipient: z.string().min(1, "Recipient is required"),
  purpose: z.string().min(1, "Payment purpose is required"),
  smart_contract: z.boolean().optional(),
});

export default function Wallet() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showQrCode, setShowQrCode] = useState(false);
  
  // Wallet balances
  const balances: WalletBalance[] = [
    {
      id: "balance-1",
      type: "PADC",
      balance: 12450,
      currency: "PADC",
      usdEquivalent: 12450,
      change: 2.4,
      description: "Pan-African Digital Currency",
      icon: "account_balance_wallet"
    },
    {
      id: "balance-2",
      type: "DTFS",
      balance: 580,
      currency: "DTFS",
      change: 0,
      description: "Reward points for platform usage",
      icon: "token"
    },
    {
      id: "balance-3",
      type: "BTC",
      balance: 0.027,
      currency: "BTC",
      usdEquivalent: 1648.35,
      change: -1.2,
      description: "Bitcoin",
      icon: "currency_bitcoin"
    }
  ];
  
  // Recent transactions
  const transactions: Transaction[] = [
    {
      id: "tx-001",
      type: "sent",
      description: "Sent to GreenHarvest Ltd",
      date: new Date("2023-06-02"),
      transactionType: "PADC Transfer",
      amount: 1250,
      currency: "PADC",
      status: "completed",
      recipient: "GreenHarvest Ltd"
    },
    {
      id: "tx-002",
      type: "received",
      description: "Received from AfroCotton Inc",
      date: new Date("2023-05-29"),
      transactionType: "PADC Transfer",
      amount: 3500,
      currency: "PADC",
      status: "completed",
      recipient: "AfroCotton Inc"
    },
    {
      id: "tx-003",
      type: "exchanged",
      description: "Currency Exchange",
      date: new Date("2023-05-25"),
      transactionType: "USD to PADC",
      amount: 5000,
      currency: "PADC",
      status: "completed"
    },
    {
      id: "tx-004",
      type: "sent",
      description: "Invoice Payment",
      date: new Date("2023-05-20"),
      transactionType: "Smart Contract",
      amount: 2750,
      currency: "PADC",
      status: "pending",
      recipient: "SunTech Solutions"
    }
  ];
  
  // Form setup
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      currency: "PADC",
      recipientCountry: "",
      recipient: "",
      purpose: "",
      smart_contract: false
    },
  });
  
  // Fade-in animation setup
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add("appear");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  const onSubmit = async (data: z.infer<typeof paymentSchema>) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Initiated",
        description: `Your payment of ${data.amount} ${data.currency} to ${data.recipient} is being processed.`,
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment request.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return <span className="material-icons text-[18px]">arrow_upward</span>;
      case 'received':
        return <span className="material-icons text-[18px]">arrow_downward</span>;
      case 'exchanged':
        return <span className="material-icons text-[18px]">sync</span>;
      default:
        return <span className="material-icons text-[18px]">swap_horiz</span>;
    }
  };
  
  const getTransactionBgColor = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return 'bg-primary-light';
      case 'received':
        return 'bg-success-light';
      case 'exchanged':
        return 'bg-warning-light';
      default:
        return 'bg-neutral-100';
    }
  };
  
  const getTransactionIconColor = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return 'text-primary';
      case 'received':
        return 'text-success';
      case 'exchanged':
        return 'text-warning';
      default:
        return 'text-neutral-500';
    }
  };
  
  const getAmountColor = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return 'text-error';
      case 'received':
        return 'text-success';
      case 'exchanged':
        return 'text-neutral-800';
      default:
        return 'text-neutral-800';
    }
  };
  
  const getAmountPrefix = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return '-';
      case 'received':
        return '+';
      case 'exchanged':
        return '±';
      default:
        return '';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-success-light text-success border-success/20">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-warning-light text-warning border-warning/20">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-error-light text-error border-error/20">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <section id="wallet" className="mb-16 py-2" ref={sectionRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-800 mb-1">
            <span className="gradient-text">Digital Wallet</span>
          </h1>
          <p className="text-neutral-600">Manage your digital assets and make secure cross-border payments</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <span className="material-icons text-[18px]">history</span>
            <span>History</span>
          </Button>
          <Button className="flex items-center gap-2">
            <span className="material-icons text-[18px]">add</span>
            <span>Deposit</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="send" className="text-sm">Send Money</TabsTrigger>
          <TabsTrigger value="receive" className="text-sm">Receive</TabsTrigger>
          <TabsTrigger value="exchange" className="text-sm">Exchange</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {balances.map((balance, index) => (
              <motion.div
                key={balance.id}
                className="rounded-xl overflow-hidden shadow-md bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  transition: { duration: 0.2 }
                }}
              >
                <div className={`px-6 pt-5 pb-6 ${
                  balance.type === "PADC" 
                    ? "gradient-primary" 
                    : balance.type === "DTFS"
                      ? "gradient-secondary"
                      : "bg-gradient-to-r from-neutral-700 to-neutral-900"
                } text-white`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{balance.type}</h3>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="material-icons">
                        {balance.icon || "account_balance_wallet"}
                      </span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {balance.balance.toLocaleString()} <span className="text-sm font-normal">{balance.currency}</span>
                  </p>
                  <p className="text-white/80 text-sm flex items-center">
                    {balance.usdEquivalent 
                      ? `≈ ${formatCurrency(balance.usdEquivalent, "USD")}` 
                      : balance.description}
                    
                    {typeof balance.change === 'number' && balance.change !== 0 && (
                      <span className={`ml-2 text-xs flex items-center ${balance.change > 0 ? 'text-green-300' : 'text-red-300'}`}>
                        <span className="material-icons text-[14px] mr-0.5">
                          {balance.change > 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        {balance.change > 0 ? '+' : ''}{balance.change}%
                      </span>
                    )}
                  </p>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">{balance.description}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <span className="material-icons text-[18px] text-neutral-500">info</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <span className="material-icons text-[18px] text-neutral-500">more_vert</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Recent Activities & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary h-8">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-1">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      className="flex items-center justify-between py-4 px-2 rounded-lg hover:bg-neutral-50 transition-all duration-normal border-b border-neutral-100 last:border-b-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${getTransactionBgColor(transaction.type)} flex items-center justify-center ${getTransactionIconColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-neutral-800">{transaction.description}</p>
                            {getStatusBadge(transaction.status)}
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {transaction.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} 
                            {transaction.recipient && ` • ${transaction.recipient}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
                          {getAmountPrefix(transaction.type)}{transaction.amount.toLocaleString()} {transaction.currency}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">{transaction.transactionType}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Perform common operations</CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex-col h-auto py-4 justify-start items-center gap-2">
                    <span className="material-icons text-primary">send</span>
                    <span className="text-xs">Send Money</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-auto py-4 justify-start items-center gap-2">
                    <span className="material-icons text-primary">qr_code_scanner</span>
                    <span className="text-xs">Scan QR</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-auto py-4 justify-start items-center gap-2">
                    <span className="material-icons text-primary">sync_alt</span>
                    <span className="text-xs">Exchange</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-auto py-4 justify-start items-center gap-2">
                    <span className="material-icons text-primary">history</span>
                    <span className="text-xs">History</span>
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Saved Wallets</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary">
                          <span className="material-icons text-[16px]">person</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-neutral-500">ID: DW28301</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="material-icons text-[18px]">send</span>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary">
                          <span className="material-icons text-[16px]">business</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">AfroCotton Inc</p>
                          <p className="text-xs text-neutral-500">ID: DW52910</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="material-icons text-[18px]">send</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send Payment</CardTitle>
              <CardDescription>Make secure cross-border payments with PAPSS</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Amount & Currency */}
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="0.00"
                                className="pl-4 pr-20"
                                {...field}
                              />
                            </FormControl>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="border-0 bg-transparent text-neutral-700 focus:ring-0 w-16 px-0">
                                      <SelectValue placeholder="Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PADC">PADC</SelectItem>
                                      <SelectItem value="USD">USD</SelectItem>
                                      <SelectItem value="EUR">EUR</SelectItem>
                                      <SelectItem value="BTC">BTC</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Recipient Country */}
                    <FormField
                      control={form.control}
                      name="recipientCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kenya">Kenya</SelectItem>
                              <SelectItem value="nigeria">Nigeria</SelectItem>
                              <SelectItem value="south-africa">South Africa</SelectItem>
                              <SelectItem value="egypt">Egypt</SelectItem>
                              <SelectItem value="ghana">Ghana</SelectItem>
                              <SelectItem value="ethiopia">Ethiopia</SelectItem>
                              <SelectItem value="tanzania">Tanzania</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Recipient */}
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Business name, ID, or wallet address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Payment Purpose */}
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Purpose</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select purpose" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="goods">Goods Payment</SelectItem>
                              <SelectItem value="services">Services Payment</SelectItem>
                              <SelectItem value="invoice">Invoice Settlement</SelectItem>
                              <SelectItem value="donation">Donation</SelectItem>
                              <SelectItem value="refund">Refund</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Smart Contract */}
                    <FormField
                      control={form.control}
                      name="smart_contract"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 space-y-0 py-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Use Smart Contract</FormLabel>
                            <p className="text-sm text-neutral-500">
                              Adds escrow protection to your transaction
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="bg-primary-light/50 rounded-lg p-4 text-sm text-neutral-700 flex items-start">
                    <span className="material-icons text-primary mr-3 mt-0.5">info</span>
                    <div>
                      <p className="font-medium">Transaction Fee: 0.5%</p>
                      <p className="mt-1">Estimated delivery time: Instant to 24 hours depending on the recipient's bank.</p>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="material-icons mr-2">send</span>
                        Send Payment
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="receive">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Receive Payment</CardTitle>
              <CardDescription>Share your wallet details or QR code</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {!showQrCode ? (
                <>
                  <div className="w-24 h-24 mb-6 rounded-full bg-primary-light flex items-center justify-center">
                    <span className="material-icons text-5xl text-primary">qr_code</span>
                  </div>
                  
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-medium mb-2">Your Wallet Details</h3>
                    <p className="text-neutral-600 mb-4">Share these details with the sender</p>
                    
                    <div className="space-y-3 text-left max-w-md mx-auto">
                      <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                        <div>
                          <p className="text-sm text-neutral-500">Wallet ID</p>
                          <p className="font-medium">DW729045</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => {
                          navigator.clipboard.writeText("DW729045");
                          toast({
                            title: "Copied to clipboard",
                            duration: 2000,
                          });
                        }}>
                          <span className="material-icons text-[16px]">content_copy</span>
                          <span className="text-xs">Copy</span>
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                        <div>
                          <p className="text-sm text-neutral-500">PADC Address</p>
                          <p className="font-medium text-sm">padc://0x3a8d...7b4f</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => {
                          navigator.clipboard.writeText("padc://0x3a8d...7b4f");
                          toast({
                            title: "Copied to clipboard",
                            duration: 2000,
                          });
                        }}>
                          <span className="material-icons text-[16px]">content_copy</span>
                          <span className="text-xs">Copy</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="mb-3 gap-2" onClick={() => setShowQrCode(true)}>
                    <span className="material-icons">qr_code_scanner</span>
                    <span>Show QR Code</span>
                  </Button>
                  <Button variant="outline">
                    <span>Request Specific Amount</span>
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 border-4 border-primary rounded-lg mb-6 bg-white">
                    <div className="w-64 h-64 bg-white flex items-center justify-center">
                      <div className="p-2 bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                          {/* This is a simple placeholder for a QR code - in a real app you'd generate this */}
                          <rect x="0" y="0" width="200" height="200" fill="white" />
                          <rect x="50" y="50" width="100" height="100" fill="#475BE8" />
                          <rect x="60" y="60" width="80" height="80" fill="white" />
                          <rect x="70" y="70" width="60" height="60" fill="#475BE8" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-medium mb-2">Scan QR Code</h3>
                    <p className="text-neutral-600">Have the sender scan this QR code to send you payment</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => setShowQrCode(false)}>
                      <span className="material-icons">arrow_back</span>
                      <span>Back</span>
                    </Button>
                    <Button className="gap-2">
                      <span className="material-icons">download</span>
                      <span>Download QR</span>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exchange">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Currencies</CardTitle>
              <CardDescription>Convert between different currencies with competitive rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormLabel>From</FormLabel>
                    <div className="flex">
                      <Select defaultValue="PADC">
                        <SelectTrigger className="rounded-r-none w-28">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PADC">PADC</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input className="rounded-l-none" placeholder="0.00" />
                    </div>
                    <div className="text-right text-sm text-neutral-500">
                      Available: 12,450 PADC
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <FormLabel>To</FormLabel>
                    <div className="flex">
                      <Select defaultValue="USD">
                        <SelectTrigger className="rounded-r-none w-28">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PADC">PADC</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input className="rounded-l-none" placeholder="0.00" readOnly value="12,450.00" />
                    </div>
                    <div className="text-right text-sm text-neutral-500">
                      1 PADC = 1.00 USD
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <Button variant="outline" className="rounded-full w-12 h-12 p-0">
                    <span className="material-icons">swap_vert</span>
                  </Button>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-600">Exchange Rate</span>
                    <span className="font-medium">1 PADC = 1.00 USD</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-600">Fee</span>
                    <span className="font-medium">0.5% (62.25 PADC)</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">You'll receive</span>
                    <span className="font-bold">12,387.75 USD</span>
                  </div>
                </div>
                
                <Button className="w-full" size="lg">
                  <span className="material-icons mr-2">sync_alt</span>
                  Exchange Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
