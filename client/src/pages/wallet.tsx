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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CryptoCurrency {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  icon: string;
  type: 'native' | 'stablecoin' | 'token';
  network: string;
  contractAddress?: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'deposit' | 'withdraw';
  amount: number;
  currency: string;
  to?: string;
  from?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  fee: number;
}

interface WalletConnection {
  id: string;
  name: string;
  icon: string;
  isConnected: boolean;
  address?: string;
  balance?: number;
}

const depositSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Please select a currency"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

const sendSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Please select a currency"),
  recipientAddress: z.string().min(1, "Recipient address is required"),
  memo: z.string().optional(),
});

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showWalletConnectDialog, setShowWalletConnectDialog] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoConvert, setAutoConvert] = useState(false);

  // Enhanced cryptocurrency portfolio with stablecoins
  const [cryptoPortfolio, setCryptoPortfolio] = useState<CryptoCurrency[]>([
    {
      symbol: 'PADC',
      name: 'Pan African Digital Coin',
      balance: 0.00,
      usdValue: 0.00,
      change24h: 0.00,
      icon: '🏛️',
      type: 'native',
      network: 'PAPSS'
    },
    {
      symbol: 'GTC',
      name: 'Global Trade Coin',
      balance: 8750.25,
      usdValue: 8750.25,
      change24h: 0.15,
      icon: '🌐',
      type: 'stablecoin',
      network: 'Ethereum',
      contractAddress: '0x...'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      balance: 8750.25,
      usdValue: 8750.25,
      change24h: 0.00,
      icon: '💵',
      type: 'stablecoin',
      network: 'Ethereum',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 12340.80,
      usdValue: 12340.80,
      change24h: 0.01,
      icon: '🔵',
      type: 'stablecoin',
      network: 'Ethereum',
      contractAddress: '0xA0b86a33E6441b17bF9F8C9D1C99C7f1f02e8B8E'
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      balance: 5670.15,
      usdValue: 5670.15,
      change24h: -0.01,
      icon: '🟡',
      type: 'stablecoin',
      network: 'Ethereum',
      contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    },
    {
      symbol: 'BUSD',
      name: 'Binance USD',
      balance: 3245.60,
      usdValue: 3245.60,
      change24h: 0.00,
      icon: '🟨',
      type: 'stablecoin',
      network: 'BSC',
      contractAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
    },
    {
      symbol: 'FRAX',
      name: 'Frax',
      balance: 1890.45,
      usdValue: 1890.45,
      change24h: 0.02,
      icon: '🔺',
      type: 'stablecoin',
      network: 'Ethereum',
      contractAddress: '0x853d955aCEf822Db058eb8505911ED77F175b99e'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 3.25,
      usdValue: 7425.50,
      change24h: 2.85,
      icon: '♦️',
      type: 'native',
      network: 'Ethereum'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.15,
      usdValue: 6750.00,
      change24h: 1.25,
      icon: '₿',
      type: 'native',
      network: 'Bitcoin'
    }
  ]);

  // Wallet connection options with WalletConnect
  const [walletConnections, setWalletConnections] = useState<WalletConnection[]>([
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      isConnected: false
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      isConnected: false
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      isConnected: false
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      isConnected: false
    },
    {
      id: 'papss',
      name: 'PAPSS Wallet',
      icon: '🏛️',
      isConnected: true,
      address: '0x742d35...9c8f3a',
      balance: 15420.50
    }
  ]);

  const [recentTransactions] = useState<Transaction[]>([
    {
      id: 'tx-001',
      type: 'receive',
      amount: 2500.00,
      currency: 'USDT',
      from: '0x8ba1...f2e7',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'completed',
      txHash: '0xabc123...def456',
      fee: 2.50
    },
    {
      id: 'tx-002',
      type: 'send',
      amount: 1200.00,
      currency: 'PADC',
      to: '0x9cd2...a1b3',
      timestamp: '2024-01-19T15:45:00Z',
      status: 'completed',
      txHash: '0x789xyz...123abc',
      fee: 1.00
    },
    {
      id: 'tx-003',
      type: 'swap',
      amount: 500.00,
      currency: 'USDC',
      timestamp: '2024-01-18T09:20:00Z',
      status: 'completed',
      fee: 5.00
    },
    {
      id: 'tx-004',
      type: 'deposit',
      amount: 3000.00,
      currency: 'DAI',
      timestamp: '2024-01-17T14:10:00Z',
      status: 'pending',
      fee: 0.00
    }
  ]);

  const depositForm = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: "",
      currency: "USDT",
      paymentMethod: "bank_transfer",
    },
  });

  const sendForm = useForm<z.infer<typeof sendSchema>>({
    resolver: zodResolver(sendSchema),
    defaultValues: {
      amount: "",
      currency: "PADC",
      recipientAddress: "",
      memo: "",
    },
  });

  const totalPortfolioValue = cryptoPortfolio.reduce((sum, coin) => sum + coin.usdValue, 0);
  const stablecoinValue = cryptoPortfolio
    .filter(coin => coin.type === 'stablecoin')
    .reduce((sum, coin) => sum + coin.usdValue, 0);

  const connectWallet = async (walletId: string) => {
    // Simulate wallet connection
    setWalletConnections(prev => 
      prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, isConnected: true, address: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4) }
          : wallet
      )
    );
    setShowWalletConnectDialog(false);
  };

  const disconnectWallet = (walletId: string) => {
    setWalletConnections(prev => 
      prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, isConnected: false, address: undefined }
          : wallet
      )
    );
  };

  const onDepositSubmit = (values: z.infer<typeof depositSchema>) => {
    console.log("Deposit request:", values);
    setShowDepositDialog(false);
    depositForm.reset();
    // Here you would integrate with your payment processing
  };

  const onSendSubmit = (values: z.infer<typeof sendSchema>) => {
    console.log("Send transaction:", values);
    setShowSendDialog(false);
    sendForm.reset();
    // Here you would process the transaction
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return '📤';
      case 'receive': return '📥';
      case 'swap': return '🔄';
      case 'deposit': return '💰';
      case 'withdraw': return '💸';
      default: return '💱';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-4 md:p-6">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 font-semibold mb-4">
            <span className="material-icons text-sm">account_balance_wallet</span>
            Digital Wallet Hub
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Your Multi-Currency Wallet
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage fiat and crypto funds with integrated stablecoin support and WalletConnect
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-green-200 shadow-xl bg-gradient-to-br from-green-50 to-teal-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-green-600">account_balance</span>
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-800 mb-2">
                ${totalPortfolioValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Across all currencies</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-blue-600">shield</span>
                Stablecoins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-800 mb-2">
                ${stablecoinValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">USDT, USDC, DAI, BUSD, FRAX</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-purple-600">link</span>
                Connected Wallets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-800 mb-2">
                {walletConnections.filter(w => w.isConnected).length}
              </p>
              <p className="text-sm text-gray-600">Active connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => setShowDepositDialog(true)}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-xl px-6 py-3 font-semibold"
            >
              <span className="material-icons mr-2">add_circle</span>
              Deposit Funds
            </Button>
            <Button 
              onClick={() => setShowSendDialog(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-semibold"
            >
              <span className="material-icons mr-2">send</span>
              Send Payment
            </Button>
            <Button 
              onClick={() => setShowWalletConnectDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl px-6 py-3 font-semibold"
            >
              <span className="material-icons mr-2">link</span>
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-2 h-14">
          <TabsTrigger value="overview" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
            <span className="material-icons mr-2">dashboard</span>
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
            <span className="material-icons mr-2">receipt_long</span>
            Transactions
          </TabsTrigger>
          <TabsTrigger value="exchange" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
            <span className="material-icons mr-2">swap_horiz</span>
            Exchange
          </TabsTrigger>
          <TabsTrigger value="wallets" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
            <span className="material-icons mr-2">account_balance_wallet</span>
            Wallets
          </TabsTrigger>
          <TabsTrigger value="papss" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
            <span className="material-icons mr-2">account_balance</span>
            PAPSS
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
            <span className="material-icons mr-2">settings</span>
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Portfolio Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {cryptoPortfolio.map((coin) => (
              <motion.div
                key={coin.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-2xl">
                          {coin.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{coin.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">{coin.symbol}</p>
                            <Badge className={`px-2 py-1 text-xs font-semibold ${
                              coin.type === 'stablecoin' ? 'bg-green-100 text-green-800' :
                              coin.type === 'native' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {coin.type === 'stablecoin' ? 'Stablecoin' : coin.type === 'native' ? 'Native' : 'Token'}
                            </Badge>
                            <Badge className="px-2 py-1 text-xs bg-gray-100 text-gray-700">
                              {coin.network}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {coin.symbol === 'PADC' ? (
                          <div>
                            <p className="text-2xl font-bold text-orange-600">
                              Coming Soon
                            </p>
                            <p className="text-lg text-gray-600">
                              Pan-African Digital Currency
                            </p>
                            <Badge className="px-3 py-1 text-xs bg-orange-100 text-orange-800 font-semibold">
                              Launch Q2 2025
                            </Badge>
                          </div>
                        ) : (
                          <div>
                            <p className="text-2xl font-bold text-gray-800">
                              {coin.balance.toLocaleString()} {coin.symbol}
                            </p>
                            <p className="text-lg text-gray-600">
                              ${coin.usdValue.toLocaleString()}
                            </p>
                            <div className={`flex items-center justify-end gap-1 text-sm ${
                              coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <span className="material-icons text-xs">
                                {coin.change24h >= 0 ? 'trending_up' : 'trending_down'}
                              </span>
                              {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {coin.contractAddress && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono">
                        Contract: {coin.contractAddress}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="grid gap-4">
            {recentTransactions.map((tx) => (
              <Card key={tx.id} className="border border-gray-200 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getTransactionIcon(tx.type)}</div>
                      <div>
                        <p className="font-semibold text-gray-800 capitalize">{tx.type}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                        {tx.txHash && (
                          <p className="text-xs text-gray-500 font-mono">
                            {tx.txHash}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">
                        {tx.type === 'send' ? '-' : '+'}{tx.amount.toLocaleString()} {tx.currency}
                      </p>
                      <Badge className={`px-2 py-1 text-xs font-semibold ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exchange Tab */}
        <TabsContent value="exchange" className="space-y-6">
          <Card className="border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-blue-600">swap_horiz</span>
                Cryptocurrency Exchange
              </CardTitle>
              <CardDescription>
                Trade between different cryptocurrencies and stablecoins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* From Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">From</h3>
                  <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                    <div className="space-y-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency to sell" />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptoPortfolio.filter(coin => coin.balance > 0).map((coin) => (
                            <SelectItem key={coin.symbol} value={coin.symbol}>
                              {coin.icon} {coin.symbol} - {coin.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Amount to sell"
                        className="text-lg font-semibold"
                      />
                      <p className="text-sm text-gray-600">Available: 8,750.25 GTC</p>
                    </div>
                  </div>
                </div>

                {/* To Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">To</h3>
                  <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <div className="space-y-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency to buy" />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptoPortfolio.map((coin) => (
                            <SelectItem key={coin.symbol} value={coin.symbol}>
                              {coin.icon} {coin.symbol} - {coin.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Amount to receive"
                        className="text-lg font-semibold"
                        readOnly
                      />
                      <p className="text-sm text-blue-700">Estimated: ~8,750.25 USDT</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exchange Rate Info */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-800">Exchange Rate</p>
                    <p className="text-sm text-green-700">1 GTC = 1.0005 USDT</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-800">Network Fee</p>
                    <p className="text-sm text-green-700">~0.25 GTC</p>
                  </div>
                </div>
              </div>

              {/* Exchange Actions */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  onClick={() => {
                    console.log("Exchange initiated");
                  }}
                >
                  <span className="material-icons mr-2">swap_horiz</span>
                  Exchange Now
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <span className="material-icons mr-2">refresh</span>
                  Refresh Rates
                </Button>
              </div>

              {/* Popular Exchange Pairs */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Popular Trading Pairs</h4>
                <div className="grid gap-2 md:grid-cols-3">
                  <Button variant="outline" className="justify-start text-sm">
                    🌐 GTC / 💵 USDT
                  </Button>
                  <Button variant="outline" className="justify-start text-sm">
                    🟡 BTC / 🌐 GTC
                  </Button>
                  <Button variant="outline" className="justify-start text-sm">
                    🔷 ETH / 💵 USDC
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connected Wallets Tab */}
        <TabsContent value="wallets" className="space-y-6">
          <div className="grid gap-6">
            {walletConnections.map((wallet) => (
              <Card key={wallet.id} className="border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{wallet.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{wallet.name}</h3>
                        {wallet.address && (
                          <p className="text-sm text-gray-600 font-mono">{wallet.address}</p>
                        )}
                        {wallet.balance && (
                          <p className="text-sm text-gray-600">
                            Balance: ${wallet.balance.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`px-3 py-1 font-semibold ${
                        wallet.isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {wallet.isConnected ? 'Connected' : 'Disconnected'}
                      </Badge>
                      {wallet.isConnected ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => disconnectWallet(wallet.id)}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => connectWallet(wallet.id)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PAPSS Payment Tab */}
        <TabsContent value="papss" className="space-y-6">
          <Card className="border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-blue-600">account_balance</span>
                PAPSS Payment Gateway
              </CardTitle>
              <CardDescription>
                Pan-African Payment and Settlement System for cross-border transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="papss-amount" className="text-sm font-semibold">Amount</Label>
                    <Input
                      id="papss-amount"
                      type="number"
                      placeholder="Enter amount"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="papss-currency" className="text-sm font-semibold">Currency</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                        <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                        <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="papss-recipient" className="text-sm font-semibold">Recipient Bank Account</Label>
                    <Input
                      id="papss-recipient"
                      placeholder="Enter recipient account details"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">PAPSS Benefits</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Real-time cross-border payments</li>
                      <li>• Lower transaction fees</li>
                      <li>• Multi-currency support</li>
                      <li>• Enhanced security protocols</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-icons text-green-600">security</span>
                      <span className="font-semibold text-green-800">Secure & Verified</span>
                    </div>
                    <p className="text-sm text-green-700">
                      All transactions are processed through the official PAPSS network with bank-grade security.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  onClick={() => {
                    console.log("PAPSS payment initiated");
                    // Handle PAPSS payment logic here
                  }}
                >
                  <span className="material-icons mr-2">send</span>
                  Send Payment via PAPSS
                </Button>
                <Button 
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <span className="material-icons mr-2">history</span>
                  Payment History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="border-2 border-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Wallet Settings</CardTitle>
              <CardDescription>Configure your wallet preferences and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Transaction Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified about incoming and outgoing transactions</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Auto-Convert to Stablecoins</Label>
                  <p className="text-sm text-gray-600">Automatically convert volatile assets to USDT/USDC</p>
                </div>
                <Switch checked={autoConvert} onCheckedChange={setAutoConvert} />
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="text-base font-semibold">Preferred Stablecoin</Label>
                <Select defaultValue="USDT">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT - Tether USD</SelectItem>
                    <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                    <SelectItem value="DAI">DAI - Dai Stablecoin</SelectItem>
                    <SelectItem value="BUSD">BUSD - Binance USD</SelectItem>
                    <SelectItem value="FRAX">FRAX - Frax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Deposit Funds</DialogTitle>
            <DialogDescription>
              Add funds to your wallet using various payment methods
            </DialogDescription>
          </DialogHeader>
          <Form {...depositForm}>
            <form onSubmit={depositForm.handleSubmit(onDepositSubmit)} className="space-y-4">
              <FormField
                control={depositForm.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USDT">USDT - Tether USD</SelectItem>
                        <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                        <SelectItem value="DAI">DAI - Dai Stablecoin</SelectItem>
                        <SelectItem value="PADC">PADC - Pan African Digital Coin</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={depositForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={depositForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                          <Label htmlFor="bank_transfer">Bank Transfer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card">Credit/Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="crypto" id="crypto" />
                          <Label htmlFor="crypto">Cryptocurrency</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="papss" id="papss" />
                          <Label htmlFor="papss">PAPSS Network</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setShowDepositDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">
                  Deposit Funds
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Send Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Send Payment</DialogTitle>
            <DialogDescription>
              Send cryptocurrency or digital currency to another wallet
            </DialogDescription>
          </DialogHeader>
          <Form {...sendForm}>
            <form onSubmit={sendForm.handleSubmit(onSendSubmit)} className="space-y-4">
              <FormField
                control={sendForm.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cryptoPortfolio.map((coin) => (
                          <SelectItem key={coin.symbol} value={coin.symbol}>
                            {coin.icon} {coin.symbol} - {coin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sendForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sendForm.control}
                name="recipientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Address</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sendForm.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memo (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Payment for..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setShowSendDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Send Payment
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* WalletConnect Dialog */}
      <Dialog open={showWalletConnectDialog} onOpenChange={setShowWalletConnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Connect Wallet</DialogTitle>
            <DialogDescription>
              Connect your external wallet using WalletConnect or browser extension
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {walletConnections.filter(w => !w.isConnected).map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                className="w-full justify-start text-left p-4 h-auto border-2 hover:border-blue-300"
                onClick={() => connectWallet(wallet.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div>
                    <p className="font-semibold">{wallet.name}</p>
                    <p className="text-xs text-gray-500">
                      {wallet.id === 'walletconnect' && 'Scan QR code with your mobile wallet'}
                      {wallet.id === 'metamask' && 'Connect using MetaMask browser extension'}
                      {wallet.id === 'coinbase' && 'Connect using Coinbase Wallet'}
                      {wallet.id === 'trust' && 'Connect using Trust Wallet'}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}