import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
};

type WalletBalance = {
  id: string;
  type: string;
  balance: number;
  currency: string;
  usdEquivalent?: number;
  description?: string;
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
});

export default function Wallet() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Wallet balances
  const balances: WalletBalance[] = [
    {
      id: "balance-1",
      type: "PADC",
      balance: 12450,
      currency: "PADC",
      usdEquivalent: 12450,
      description: "Pan-African Digital Currency"
    },
    {
      id: "balance-2",
      type: "DTFS",
      balance: 580,
      currency: "DTFS",
      description: "Reward points for platform usage"
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
      currency: "PADC"
    },
    {
      id: "tx-002",
      type: "received",
      description: "Received from AfroCotton Inc",
      date: new Date("2023-05-29"),
      transactionType: "PADC Transfer",
      amount: 3500,
      currency: "PADC"
    },
    {
      id: "tx-003",
      type: "exchanged",
      description: "Currency Exchange",
      date: new Date("2023-05-25"),
      transactionType: "USD to PADC",
      amount: 5000,
      currency: "PADC"
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
        return <span className="material-icons text-primary-500">arrow_upward</span>;
      case 'received':
        return <span className="material-icons text-success">arrow_downward</span>;
      case 'exchanged':
        return <span className="material-icons text-warning">sync</span>;
      default:
        return <span className="material-icons text-neutral-500">swap_horiz</span>;
    }
  };
  
  const getTransactionBgColor = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return 'bg-primary-50';
      case 'received':
        return 'bg-success/10';
      case 'exchanged':
        return 'bg-warning/10';
      default:
        return 'bg-neutral-100';
    }
  };
  
  const getAmountColor = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return 'text-error';
      case 'received':
      case 'exchanged':
        return 'text-success';
      default:
        return 'text-neutral-800';
    }
  };
  
  const getAmountPrefix = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return '-';
      case 'received':
      case 'exchanged':
        return '+';
      default:
        return '';
    }
  };

  return (
    <section id="wallet" className="mb-16 fade-in" ref={sectionRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-1">Digital Wallet</h2>
          <p className="text-neutral-600">Manage your PADC stablecoin and make cross-border payments</p>
        </div>
        <a href="#" className="mt-3 md:mt-0 text-primary-500 hover:text-primary-700 font-medium flex items-center">
          Transaction History <span className="material-icons ml-1">arrow_forward</span>
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Balance Cards & Transactions */}
        <div className="col-span-2">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {balances.map((balance, index) => (
              <motion.div
                key={balance.id}
                className={`rounded-xl shadow-lg p-6 card-lift text-white ${
                  balance.type === "PADC" 
                    ? "bg-gradient-to-br from-primary-500 to-primary-700" 
                    : "bg-gradient-to-br from-secondary-500 to-secondary-700"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{balance.type} Balance</h3>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="material-icons">
                      {balance.type === "PADC" ? "account_balance_wallet" : "token"}
                    </span>
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {balance.balance.toLocaleString()} <span className="text-lg">{balance.currency}</span>
                </p>
                <p className="text-white/80 text-sm">
                  {balance.usdEquivalent 
                    ? `≈ ${formatCurrency(balance.usdEquivalent, "USD")}` 
                    : balance.description}
                </p>
                
                <div className="flex gap-2 mt-6">
                  <Button 
                    variant="default"
                    className="flex-1 bg-white text-primary-700 font-medium py-2 rounded transition-all hover:bg-white/90 text-sm flex items-center justify-center"
                  >
                    <span className="material-icons text-sm mr-1">
                      {balance.type === "PADC" ? "arrow_upward" : "redeem"}
                    </span> 
                    {balance.type === "PADC" ? "Send" : "Redeem"}
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 bg-white/20 text-white font-medium py-2 rounded transition-all hover:bg-white/30 text-sm flex items-center justify-center"
                  >
                    <span className="material-icons text-sm mr-1">
                      {balance.type === "PADC" ? "arrow_downward" : "history"}
                    </span> 
                    {balance.type === "PADC" ? "Receive" : "History"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Recent Transactions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold text-lg mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${getTransactionBgColor(transaction.type)} flex items-center justify-center mr-3`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-neutral-500">
                          {transaction.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} • {transaction.transactionType}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold ${getAmountColor(transaction.type)}`}>
                      {getAmountPrefix(transaction.type)}{transaction.amount.toLocaleString()} {transaction.currency}
                    </p>
                  </motion.div>
                ))}
                
                {transactions.length === 0 && (
                  <div className="text-center py-8">
                    <span className="material-icons text-4xl text-neutral-300 mb-2">receipt_long</span>
                    <p className="text-neutral-500">No transactions yet</p>
                    <p className="text-sm text-neutral-400 mt-1">Your transaction history will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* PAPSS Payment */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <span className="material-icons text-primary-500 mr-2">payments</span>
              <h3 className="font-heading font-semibold text-lg">Pay with PAPSS</h3>
            </div>
            
            <p className="text-neutral-600 text-sm mb-6">Make quick cross-border payments using the Pan-African Payment and Settlement System.</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-700">Amount</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="0.00"
                            className="w-full pl-4 pr-16 py-3"
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
                                <SelectTrigger className="border-0 bg-transparent text-neutral-700 focus:ring-0 w-[70px]">
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PADC">PADC</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
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
                
                <FormField
                  control={form.control}
                  name="recipientCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-700">Recipient Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="nigeria">Nigeria</SelectItem>
                          <SelectItem value="south-africa">South Africa</SelectItem>
                          <SelectItem value="egypt">Egypt</SelectItem>
                          <SelectItem value="ghana">Ghana</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-700">Recipient</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Business name or ID"
                          className="w-full px-4 py-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-700">Payment Purpose</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="goods">Goods Payment</SelectItem>
                          <SelectItem value="services">Services Payment</SelectItem>
                          <SelectItem value="invoice">Invoice Settlement</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-primary-500 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg shadow-button transition-all mt-2"
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
                    "Continue to Payment"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
