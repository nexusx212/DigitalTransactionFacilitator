import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSmartContracts } from "@/hooks/use-smart-contracts";
import { formatCurrency, formatDate } from "@/lib/utils";
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
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

// Data types
type FinanceContract = {
  id: string;
  invoiceNumber: string;
  amount: number;
  issuedDate: Date;
  dueDate: Date;
  status: "Active" | "Pending" | "Completed";
  fundingStatus: "Funded" | "Processing" | "Awaiting Payment";
  smartContractStatus: "Active" | "Under Review" | "Completed";
  financeType?: string;
};

// Form Types
type FinanceType = 'factoring' | 'export' | 'supply' | 'import' | 'noninterest' | 'startup';

// Base form schema
const baseSchema = {
  amount: z.string().min(1, "Amount is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  dueDate: z.string().min(1, "Due date is required"),
  invoiceFile: z.any().optional(), // Make file optional for now to avoid issues
};

// Extended schemas for different finance types
const factoringSchema = z.object({
  ...baseSchema,
  customerName: z.string().min(1, "Customer name is required"),
});

const exportFinanceSchema = z.object({
  ...baseSchema,
  exportCountry: z.string().min(1, "Export country is required"),
  shipmentDate: z.string().min(1, "Shipment date is required"),
});

const nonInterestFinanceSchema = z.object({
  ...baseSchema,
  financingType: z.enum(["murabaha", "ijara", "musharaka"]),
  agreementToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the ethical finance terms",
  }),
});

const startupFinanceSchema = z.object({
  ...baseSchema,
  businessAge: z.string().min(1, "Business age is required")
});

// Default invoice schema
const invoiceSchema = z.object(baseSchema);

export default function TradeFinance() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFinanceType, setActiveFinanceType] = useState<FinanceType>('factoring');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    isConnected, 
    isLoading: isBlockchainLoading, 
    currentAddress,
    initialize, 
    createInvoice, 
    createLetterOfCredit,
    createSupplyChainFinancing
  } = useSmartContracts();
  
  // Sample active contracts
  const [activeContracts, setActiveContracts] = useState<FinanceContract[]>([
    {
      id: "fc-001",
      invoiceNumber: "INV-2023-0042",
      amount: 32500,
      issuedDate: new Date("2023-05-12"),
      dueDate: new Date("2023-06-12"),
      status: "Active",
      fundingStatus: "Funded",
      smartContractStatus: "Active",
      financeType: "Factoring"
    },
    {
      id: "fc-002",
      invoiceNumber: "INV-2023-0055",
      amount: 18750,
      issuedDate: new Date("2023-05-28"),
      dueDate: new Date("2023-06-28"),
      status: "Pending",
      fundingStatus: "Processing",
      smartContractStatus: "Under Review",
      financeType: "Export Finance"
    }
  ]);
  
  // Finance options data
  const financeOptions = [
    {
      id: 'factoring',
      name: 'Factoring',
      description: 'Convert your accounts receivable into immediate cash flow',
      icon: 'receipt_long',
      available: true
    },
    {
      id: 'export',
      name: 'Export Finance',
      description: 'Fund your international exports and secure payments',
      icon: 'local_shipping',
      available: true
    },
    {
      id: 'supply',
      name: 'Supply Chain Finance',
      description: 'Optimize working capital throughout the supply chain',
      icon: 'inventory',
      available: false,
      comingSoon: true
    },
    {
      id: 'import',
      name: 'Import Finance',
      description: 'Secure funding for international goods purchases',
      icon: 'shopping_cart',
      available: false,
      comingSoon: true
    },
    {
      id: 'noninterest',
      name: 'Non Interest Finance',
      description: 'Ethical financing solutions with no interest charges',
      icon: 'handshake',
      available: true
    },
    {
      id: 'startup',
      name: 'Startup Trade Finance',
      description: 'Specialized financing for early-stage trading businesses',
      icon: 'rocket_launch',
      available: true
    }
  ];
  
  // Get the appropriate schema based on finance type
  const getSchemaForFinanceType = () => {
    switch(activeFinanceType) {
      case 'factoring':
        return factoringSchema;
      case 'export':
        return exportFinanceSchema;
      case 'noninterest':
        return nonInterestFinanceSchema;
      case 'startup':
        return startupFinanceSchema;
      default:
        return invoiceSchema;
    }
  };
  
  // Form setup
  const form = useForm({
    resolver: zodResolver(getSchemaForFinanceType()),
    defaultValues: {
      amount: "",
      dueDate: "",
      ...(activeFinanceType === 'factoring' ? { customerName: "" } : {}),
      ...(activeFinanceType === 'export' ? { 
        exportCountry: "",
        shipmentDate: ""
      } : {}),
      ...(activeFinanceType === 'noninterest' ? { 
        financingType: "murabaha",
        agreementToTerms: false  
      } : {}),
      ...(activeFinanceType === 'startup' ? {
        businessAge: ""
      } : {})
    },
  });
  
  // Effect to update form when finance type changes
  useEffect(() => {
    // Reset form when finance type changes
    form.reset({
      amount: "",
      dueDate: "",
      ...(activeFinanceType === 'factoring' ? { customerName: "" } : {}),
      ...(activeFinanceType === 'export' ? { 
        exportCountry: "",
        shipmentDate: ""
      } : {}),
      ...(activeFinanceType === 'noninterest' ? { 
        financingType: "murabaha",
        agreementToTerms: false  
      } : {}),
      ...(activeFinanceType === 'startup' ? {
        businessAge: ""
      } : {})
    });
  }, [activeFinanceType, form]);
  
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
  
  // Effect to try connecting to blockchain when component mounts
  useEffect(() => {
    if (!isConnected && !isBlockchainLoading) {
      initialize();
    }
  }, [isConnected, isBlockchainLoading, initialize]);
  
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Ensure we're connected to MetaMask
      if (!isConnected) {
        const initialized = await initialize();
        if (!initialized) {
          toast({
            variant: "destructive",
            title: "Blockchain Connection Failed",
            description: "Please make sure MetaMask is installed and unlocked to proceed.",
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Format amount and calculate due date in seconds since epoch
      const amountValue = data.amount.replace(/,/g, "");
      const dueDateTimestamp = Math.floor(new Date(data.dueDate).getTime() / 1000);
      
      // Generate unique ID for this finance request
      const financeId = `fin-${Date.now().toString(36)}`;
      const invoiceNumber = `INV-2023-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Submit to the appropriate smart contract based on finance type
      let success = false;
      
      // Sample addresses for demo - in a real app we'd get these from the backend
      // In a real implementation, these would be actual blockchain addresses of registered users
      const exporterAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
      const importerAddress = currentAddress || "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
      
      if (activeFinanceType === 'factoring') {
        success = await createInvoice(
          financeId, 
          amountValue,
          exporterAddress, 
          importerAddress,
          dueDateTimestamp
        );
      } else if (activeFinanceType === 'export') {
        success = await createLetterOfCredit(
          financeId,
          importerAddress,
          exporterAddress,
          amountValue,
          `Export to ${data.exportCountry}, shipping on ${data.shipmentDate}`
        );
      } else if (activeFinanceType === 'noninterest' || activeFinanceType === 'startup') {
        success = await createSupplyChainFinancing(
          financeId,
          exporterAddress,
          importerAddress,
          amountValue,
          activeFinanceType === 'noninterest' ? 0 : 5, // 0% for non-interest, 5% for startup
          30 // 30 day term
        );
      } else {
        // Fallback to generic invoice creation for other types
        success = await createInvoice(
          financeId, 
          amountValue,
          exporterAddress, 
          importerAddress,
          dueDateTimestamp
        );
      }
      
      if (success) {
        // Add new contract to the list
        const newContract: FinanceContract = {
          id: financeId,
          invoiceNumber: invoiceNumber,
          amount: parseFloat(amountValue),
          issuedDate: new Date(),
          dueDate: new Date(data.dueDate),
          status: "Pending",
          fundingStatus: "Processing",
          smartContractStatus: "Active", // Changed to Active since contract was created
          financeType: getFinanceTypeLabel(activeFinanceType)
        };
        
        setActiveContracts(prev => [newContract, ...prev]);
        
        // Reset form
        form.reset();
        
        toast({
          title: "Smart Contract Deployed",
          description: `Your ${getFinanceTypeLabel(activeFinanceType)} smart contract has been created on the blockchain`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Smart Contract Deployment Failed",
          description: "The blockchain transaction could not be completed. Please check your wallet and try again.",
        });
      }
    } catch (error: any) {
      console.error("Finance submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "There was an error processing your finance request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getFinanceTypeLabel = (type: FinanceType): string => {
    switch(type) {
      case 'factoring': 
        return 'Factoring';
      case 'export': 
        return 'Export Finance';
      case 'supply': 
        return 'Supply Chain Finance';
      case 'import': 
        return 'Import Finance';
      case 'noninterest': 
        return 'Non Interest Finance';
      case 'startup': 
        return 'Startup Trade Finance';
      default: 
        return 'Invoice Finance';
    }
  };

  return (
    <section id="trade-finance" className="mb-16 fade-in" ref={sectionRef}>
      {/* Hero Section */}
      <div className="relative mb-10 bg-gradient-to-br from-primary-700 to-primary-900 text-white rounded-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 px-6 py-10 lg:py-14 max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Trade Finance Solutions
              </motion.h1>
              <motion.p 
                className="text-lg lg:text-xl mb-6 text-white/90 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Access instant blockchain-powered financing tailored to your business needs with smart contract approval systems that reduce processing time by up to 80%.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center mr-6 mb-2">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="material-icons text-white">verified</span>
                  </div>
                  <div>
                    <span className="block text-sm text-white/80">Finance Amount</span>
                    <span className="font-semibold">Up to $5M</span>
                  </div>
                </div>
                <div className="flex items-center mr-6 mb-2">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="material-icons text-white">schedule</span>
                  </div>
                  <div>
                    <span className="block text-sm text-white/80">Processing Time</span>
                    <span className="font-semibold">24-48 Hours</span>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="material-icons text-white">security</span>
                  </div>
                  <div>
                    <span className="block text-sm text-white/80">Security</span>
                    <span className="font-semibold">Blockchain Backed</span>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20"
                animate={{ 
                  y: [0, -10, 0], 
                  rotateZ: [0, 1, 0] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="material-icons mr-2 text-green-400">savings</span>
                    <h3 className="font-semibold">DTFS Smart Contract</h3>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                </div>
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-xs mb-1">Funding amount</p>
                      <p className="font-mono font-medium">$125,000.00</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Term</p>
                      <p className="font-mono font-medium">60 Days</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-xs mb-1">Interest rate</p>
                      <p className="font-mono font-medium">4.5% p.a.</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Status</p>
                      <p className="font-mono font-medium">Funded</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                  <p className="text-xs mb-1 text-white/60">Smart Contract ID</p>
                  <p className="font-mono text-xs">0xF3b4...A92c</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-1">Choose Your Finance Option</h2>
          <p className="text-neutral-600">Select from our range of specialized trade finance solutions</p>
        </div>
        <a href="#" className="mt-3 md:mt-0 text-primary-500 hover:text-primary-700 font-medium flex items-center">
          View Comparison Guide <span className="material-icons ml-1">arrow_forward</span>
        </a>
      </div>
      
      {/* Finance Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {financeOptions.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer
              ${!option.available ? 'opacity-80 grayscale-[30%]' : ''}
              ${activeFinanceType === option.id as FinanceType
                ? 'shadow-lg shadow-primary-500/10 ring-2 ring-primary-500 transform scale-[1.02]' 
                : 'shadow-md hover:shadow-lg border border-gray-100 hover:border-primary-200 hover:-translate-y-1'}
            `}
            onClick={() => option.available && setActiveFinanceType(option.id as FinanceType)}
          >
            <div className={`h-3 w-full ${activeFinanceType === option.id as FinanceType ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className={`
                  h-14 w-14 rounded-lg flex items-center justify-center mr-4
                  ${activeFinanceType === option.id as FinanceType 
                    ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md' 
                    : 'bg-gray-100 text-neutral-700'}
                `}>
                  <span className="material-icons text-2xl">{option.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-neutral-800 mb-1">{option.name}</h3>
                  <p className="text-sm text-neutral-600">{option.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {option.id === 'factoring' && (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                      <span className="material-icons text-[14px] mr-1">description</span>Invoice
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-teal-100 text-teal-800">
                      <span className="material-icons text-[14px] mr-1">bolt</span>Fast Approval
                    </span>
                  </>
                )}
                {option.id === 'export' && (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800">
                      <span className="material-icons text-[14px] mr-1">public</span>International
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                      <span className="material-icons text-[14px] mr-1">event_available</span>Pre-shipment
                    </span>
                  </>
                )}
                {option.id === 'noninterest' && (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                      <span className="material-icons text-[14px] mr-1">handshake</span>Ethical
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">
                      <span className="material-icons text-[14px] mr-1">verified</span>Compliant
                    </span>
                  </>
                )}
                {option.id === 'startup' && (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-rose-100 text-rose-800">
                      <span className="material-icons text-[14px] mr-1">rocket_launch</span>Growth
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-cyan-100 text-cyan-800">
                      <span className="material-icons text-[14px] mr-1">trending_up</span>Flexible
                    </span>
                  </>
                )}
                {option.comingSoon && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-warning/20 text-warning ml-auto">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Blockchain Connection Status */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-800 mb-1">Blockchain Wallet Status</h3>
            <div className="flex items-center">
              <div className={`h-2.5 w-2.5 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-sm text-neutral-600">
                {isConnected 
                  ? `Connected: ${currentAddress?.slice(0, 6)}...${currentAddress?.slice(-4)}` 
                  : 'Disconnected - Connect MetaMask to deploy smart contracts'}
              </p>
            </div>
          </div>
          <Button 
            type="button" 
            variant={isConnected ? "outline" : "default"} 
            size="sm"
            disabled={isBlockchainLoading}
            onClick={() => initialize()}
            className="flex items-center"
          >
            {isBlockchainLoading && (
              <span className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {isConnected ? 'Refresh Connection' : 'Connect Wallet'}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Finance Application Card */}
        <Card>
          <CardContent className="p-6 lg:p-8">
            <h3 className="text-xl font-heading font-semibold mb-4">
              {activeFinanceType === 'factoring' && 'Apply for Factoring'}
              {activeFinanceType === 'export' && 'Apply for Export Finance'}
              {activeFinanceType === 'supply' && 'Apply for Supply Chain Finance'}
              {activeFinanceType === 'import' && 'Apply for Import Finance'}
              {activeFinanceType === 'noninterest' && 'Apply for Non Interest Finance'}
              {activeFinanceType === 'startup' && 'Apply for Startup Trade Finance'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {activeFinanceType === 'factoring' && 'Convert your accounts receivable into immediate cash flow by uploading your invoice below.'}
              {activeFinanceType === 'export' && 'Secure funding for your export operations by providing your shipment and invoice details.'}
              {activeFinanceType === 'supply' && 'Optimize working capital throughout your supply chain with our advanced financing solutions.'}
              {activeFinanceType === 'import' && 'Get financing for international purchases and secure your import operations.'}
              {activeFinanceType === 'noninterest' && 'Access ethical financing solutions with no interest charges for your trade operations.'}
              {activeFinanceType === 'startup' && 'Specialized financing solutions for early-stage trading businesses.'}
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-700">Invoice Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                          <Input
                            placeholder="10,000"
                            className="pl-8 pr-4 py-3"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-700">Invoice Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="w-full px-4 py-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* File Upload Section - Show for all finance types */}
                <div className="border-t border-dashed border-neutral-200 mt-6 pt-6">
                  <div className="flex items-center mb-4">
                    <span className="material-icons text-primary-500 mr-2">upload_file</span>
                    <h4 className="text-sm font-semibold text-neutral-800">Upload Documents</h4>
                  </div>
                  
                  <div 
                    onClick={handleFileButtonClick}
                    className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
                  >
                    <span className="material-icons text-neutral-400 text-3xl mb-2">file_upload</span>
                    <p className="text-sm text-neutral-600 mb-1">Drag and drop your documents or click to browse</p>
                    <p className="text-xs text-neutral-500">PDF, JPG, PNG, DOC up to 10MB</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      multiple
                    />
                  </div>
                  <p className="text-xs text-center text-neutral-500 mt-2">Uploading all required documents will speed up the approval process</p>
                </div>
                
                {/* Factoring specific fields */}
                {activeFinanceType === 'factoring' && (
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-neutral-700">Customer Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the customer name"
                            className="w-full px-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-neutral-500">
                          The name of the customer who issued the invoice
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Document Requirements */}
                <div className="mt-6 mb-4">
                  <h4 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center">
                    <span className="material-icons text-primary-500 mr-2 text-lg">description</span>
                    Required Documents
                  </h4>
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <ul className="space-y-2">
                      {activeFinanceType === 'factoring' && (
                        <>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Invoice document</span>
                              <p className="text-xs text-neutral-500">Original invoice issued to your customer (PDF format)</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Proof of delivery</span>
                              <p className="text-xs text-neutral-500">Signed delivery note confirming goods/services received</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Customer contract</span>
                              <p className="text-xs text-neutral-500">Contract with customer (if applicable)</p>
                            </div>
                          </li>
                        </>
                      )}
                      
                      {activeFinanceType === 'export' && (
                        <>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Commercial invoice</span>
                              <p className="text-xs text-neutral-500">Invoice for goods being exported</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Bill of lading</span>
                              <p className="text-xs text-neutral-500">Shipping document issued by carrier</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Purchase order</span>
                              <p className="text-xs text-neutral-500">Order confirmation from buyer</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Export license</span>
                              <p className="text-xs text-neutral-500">Valid permit for exporting goods (if applicable)</p>
                            </div>
                          </li>
                        </>
                      )}
                      
                      {activeFinanceType === 'noninterest' && (
                        <>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Commercial invoice</span>
                              <p className="text-xs text-neutral-500">Invoice for goods or services</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Purchase agreement</span>
                              <p className="text-xs text-neutral-500">Ethical finance compliant purchase agreement</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Ethical compliance form</span>
                              <p className="text-xs text-neutral-500">Signed declaration of ethical trade practices</p>
                            </div>
                          </li>
                        </>
                      )}
                      
                      {activeFinanceType === 'startup' && (
                        <>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Business registration</span>
                              <p className="text-xs text-neutral-500">Proof of business registration</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Financial projections</span>
                              <p className="text-xs text-neutral-500">12-month revenue and expense forecast</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Purchase orders</span>
                              <p className="text-xs text-neutral-500">Proof of orders requiring financing</p>
                            </div>
                          </li>
                          <li className="flex items-start text-sm">
                            <span className="material-icons text-success mr-2 mt-0.5 text-[18px]">check_circle</span>
                            <div>
                              <span className="font-medium">Business plan</span>
                              <p className="text-xs text-neutral-500">Executive summary of business plan</p>
                            </div>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Export Finance specific fields */}
                {activeFinanceType === 'export' && (
                  <>
                    <FormField
                      control={form.control}
                      name="exportCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-neutral-700">Export Destination</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kenya">Kenya</SelectItem>
                                <SelectItem value="nigeria">Nigeria</SelectItem>
                                <SelectItem value="south_africa">South Africa</SelectItem>
                                <SelectItem value="morocco">Morocco</SelectItem>
                                <SelectItem value="ghana">Ghana</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="shipmentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-neutral-700">Shipment Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="w-full px-4 py-3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {/* Non Interest Finance specific fields */}
                {activeFinanceType === 'noninterest' && (
                  <>
                    <FormField
                      control={form.control}
                      name="financingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-neutral-700">Financing Type</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select financing type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="murabaha">Cost-Plus Financing</SelectItem>
                                <SelectItem value="ijara">Lease-Based Financing</SelectItem>
                                <SelectItem value="musharaka">Joint Venture Partnership</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-xs text-neutral-500">
                            Choose your preferred ethical financing structure
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="agreementToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              I agree to the ethical financing terms and conditions
                            </FormLabel>
                            <FormDescription className="text-xs text-neutral-500">
                              By checking this box, you confirm that the transaction complies with non-interest finance principles
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {/* Startup Trade Finance specific fields */}
                {activeFinanceType === 'startup' && (
                  <>
                    <FormField
                      control={form.control}
                      name="businessAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-neutral-700">Business Age</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select business age" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0-6">0-6 months</SelectItem>
                                <SelectItem value="7-12">7-12 months</SelectItem>
                                <SelectItem value="13-18">13-18 months</SelectItem>
                                <SelectItem value="19-24">19-24 months</SelectItem>
                                <SelectItem value="25+">25+ months</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-xs text-neutral-500">
                            How long has your business been operating?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="invoiceFile"
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-700">Upload Invoice</FormLabel>
                      <FormControl>
                        <div
                          onClick={handleFileButtonClick}
                          className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-500 transition-all cursor-pointer"
                        >
                          <span className="material-icons text-3xl text-neutral-400 mb-2">cloud_upload</span>
                          <p className="text-sm text-neutral-600">Drag & drop or click to upload</p>
                          <p className="text-xs text-neutral-500 mt-1">PDF, JPG or PNG (max. 5MB)</p>
                          <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => {
                              onChange(e.target.files);
                            }}
                            {...fieldProps}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-500 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg shadow-button transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit for Approval"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Active Finance Card */}
        <Card>
          <CardContent className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-semibold">Active Finance Contracts</h3>
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contracts</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-5">
              {activeContracts.map((contract) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative group overflow-hidden border border-neutral-200 rounded-lg p-5 hover:shadow-md hover:border-primary-300 transition-all"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full" style={{ 
                    backgroundColor: contract.status === "Active" ? '#10b981' : 
                                      contract.status === "Pending" ? '#f59e0b' : '#6366f1' 
                  }}></div>
                  
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          contract.status === "Active" 
                            ? "bg-green-50 text-green-700" 
                            : contract.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-indigo-50 text-indigo-700"
                        }`}>
                          {contract.status}
                        </span>
                        {contract.financeType && (
                          <span className="text-xs font-medium text-neutral-600">
                            {contract.financeType}
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium mt-2">{contract.invoiceNumber}</h4>
                    </div>
                    <p className="text-xl font-bold text-neutral-800">
                      {formatCurrency(contract.amount, "USD")}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500">Issued Date</p>
                      <p className="font-medium">{formatDate(contract.issuedDate)}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Due Date</p>
                      <p className="font-medium">{formatDate(contract.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Status</p>
                      <p className={`font-medium ${
                        contract.fundingStatus === "Funded" 
                          ? "text-success" 
                          : contract.fundingStatus === "Processing"
                            ? "text-warning"
                            : "text-neutral-600"
                      }`}>
                        {contract.fundingStatus}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full ${
                        contract.smartContractStatus === "Active" 
                          ? "bg-success" 
                          : contract.smartContractStatus === "Under Review"
                            ? "bg-warning animate-pulse"
                            : "bg-neutral-400"
                      }`}></span>
                      <span className="text-xs ml-2">
                        {contract.smartContractStatus === "Active" 
                          ? "Smart Contract Active" 
                          : contract.smartContractStatus === "Under Review"
                            ? "Under Review"
                            : "Contract Completed"}
                      </span>
                    </div>
                    <button className="text-primary-500 hover:text-primary-700 text-sm font-medium">View Details</button>
                  </div>
                </motion.div>
              ))}
              
              {activeContracts.length === 0 && (
                <div className="text-center py-8">
                  <span className="material-icons text-4xl text-neutral-300 mb-2">description</span>
                  <p className="text-neutral-500">No active finance contracts</p>
                  <p className="text-sm text-neutral-400 mt-1">Submit an invoice to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
