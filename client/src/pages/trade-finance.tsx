import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
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
import { ethers } from "ethers";

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { 
    isConnected, 
    isLoading: isBlockchainLoading, 
    currentAddress,
    initialize, 
    createInvoice, 
    createLetterOfCredit,
    createSupplyChainFinancing
  } = useSmartContracts();
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: `${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added`,
        description: "Document upload successful",
        variant: "default",
      });
    }
  };
  
  // Handle clicking on the file upload area
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
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
  
  // Effect to try connecting to blockchain when component mounts
  useEffect(() => {
    if (!isConnected && !isBlockchainLoading) {
      initialize();
    }
  }, [isConnected, isBlockchainLoading, initialize]);
  
  // Display uploaded files
  const renderUploadedFilesList = () => {
    if (uploadedFiles.length === 0) return null;
    
    return (
      <div className="mt-4">
        <div className="flex items-center mb-2">
          <span className="material-icons text-success mr-2 text-sm">check_circle</span>
          <span className="text-sm font-medium">Uploaded Documents</span>
        </div>
        <ul className="space-y-1">
          {uploadedFiles.map((file, index) => (
            <li key={index} className="text-xs flex items-center text-neutral-600 bg-neutral-50 px-2 py-1 rounded">
              <span className="material-icons text-xs mr-1">
                {file.type.includes('pdf') ? 'picture_as_pdf' : 
                 file.type.includes('image') ? 'image' : 'description'}
              </span>
              {file.name} ({Math.round(file.size / 1024)} KB)
            </li>
          ))}
        </ul>
      </div>
    );
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
          dueDateTimestamp
        );
      }
      
      if (success) {
        // Add the new contract to our local state
        const newContract: FinanceContract = {
          id: financeId,
          invoiceNumber,
          amount: Number(amountValue),
          issuedDate: new Date(),
          dueDate: new Date(data.dueDate),
          status: "Pending",
          fundingStatus: "Processing",
          smartContractStatus: "Under Review",
          financeType: getFinanceTypeLabel(activeFinanceType)
        };
        
        setActiveContracts(prev => [newContract, ...prev]);
        
        // Show success message
        toast({
          title: "Finance Request Submitted",
          description: `Your ${getFinanceTypeLabel(activeFinanceType)} request has been submitted for approval.`,
          variant: "default",
        });
        
        // Reset form
        form.reset();
        setUploadedFiles([]);
      } else {
        toast({
          variant: "destructive",
          title: "Transaction Failed",
          description: "There was an error processing your finance request. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Finance submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "There was an error processing your request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getFinanceTypeLabel = (type: FinanceType): string => {
    switch(type) {
      case 'factoring': return 'Factoring';
      case 'export': return 'Export Finance';
      case 'supply': return 'Supply Chain Finance';
      case 'import': return 'Import Finance';
      case 'noninterest': return 'Non Interest Finance';
      case 'startup': return 'Startup Trade Finance';
      default: return 'Trade Finance';
    }
  };

  return (
    <div>
      {/* Enhanced Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 text-white rounded-3xl overflow-hidden mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-8 py-16 md:py-20 lg:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm font-semibold mb-6 border border-white/30">
                  <span className="material-icons text-sm">flash_on</span>
                  Fast approval in 24-48 hours
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
                  Trade Finance
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Solutions
                  </span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-lg leading-relaxed">
                  Unlock capital, manage cash flow, and fund international trade
                  with our comprehensive suite of trade finance solutions.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl shadow-lg border-0"
                    onClick={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span className="material-icons mr-2 text-xl">trending_up</span>
                    Start Application
                  </Button>
                  <Link href="/finance-comparison">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="font-bold bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm px-8 py-4 rounded-xl"
                    >
                      <span className="material-icons mr-2 text-xl">compare</span>
                      Compare Options
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">$2.5M+</div>
                  <div className="text-blue-100">Total Funded</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-3xl font-bold text-green-300 mb-2">500+</div>
                  <div className="text-blue-100">Active Clients</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-3xl font-bold text-orange-300 mb-2">48hrs</div>
                  <div className="text-blue-100">Avg Approval</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-3xl font-bold text-pink-300 mb-2">99.8%</div>
                  <div className="text-blue-100">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-36 -translate-x-36"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-yellow-300/30 rounded-full animate-bounce"></div>
      </section>
      
      {/* Finance Options */}
      <section className="mb-10" ref={sectionRef as React.RefObject<HTMLElement>}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-semibold mb-4">
            <span className="material-icons text-sm">account_balance</span>
            Finance Solutions
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Finance Option
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the finance option that best suits your business needs and get approved in 24-48 hours
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeOptions.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`
                relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer border-2
                ${!option.available ? 'opacity-70 grayscale-[20%]' : ''}
                ${activeFinanceType === option.id as FinanceType
                  ? 'shadow-2xl shadow-blue-500/30 border-blue-500 transform scale-[1.05] bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50' 
                  : 'shadow-lg hover:shadow-xl border-gray-200 hover:border-blue-300 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-blue-25 hover:to-purple-25'}
              `}
              onClick={() => option.available && setActiveFinanceType(option.id as FinanceType)}
            >
              <div className={`h-2 w-full ${
                activeFinanceType === option.id as FinanceType 
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500' 
                  : 'bg-gradient-to-r from-gray-300 to-gray-400'
              }`}></div>
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className={`
                    h-16 w-16 rounded-2xl flex items-center justify-center mr-4 shadow-lg
                    ${activeFinanceType === option.id as FinanceType 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 hover:from-blue-100 hover:to-purple-100 hover:text-blue-700 transition-all'}
                  `}>
                    <span className="material-icons text-2xl">{option.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-xl mb-2 ${
                      activeFinanceType === option.id as FinanceType 
                        ? 'text-blue-800' 
                        : 'text-gray-800'
                    }`}>
                      {option.name}
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      activeFinanceType === option.id as FinanceType 
                        ? 'text-blue-700 font-medium' 
                        : 'text-gray-600'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                </div>
                {activeFinanceType === option.id as FinanceType && (
                  <div className="mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-800">Selected Option</span>
                      <span className="material-icons text-blue-600">check_circle</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Blockchain Connection Status */}
        <div className={`bg-gradient-to-r ${isConnected ? 'from-green-50 to-emerald-50 border-green-200' : 'from-orange-50 to-red-50 border-orange-200'} border-2 rounded-2xl p-6 mb-8 mt-8 shadow-lg`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isConnected ? 'bg-green-500' : 'bg-orange-500'} text-white shadow-lg`}>
                <span className="material-icons text-xl">
                  {isConnected ? 'account_balance_wallet' : 'warning'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Blockchain Wallet Status</h3>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-orange-500 animate-bounce'}`}></div>
                  <p className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-orange-700'}`}>
                    {isConnected 
                      ? `Connected: ${currentAddress?.slice(0, 6)}...${currentAddress?.slice(-4)}` 
                      : 'Connect MetaMask to deploy smart contracts and secure transactions'}
                  </p>
                </div>
              </div>
            </div>
            <Button 
              type="button" 
              size="lg"
              disabled={isBlockchainLoading}
              onClick={() => initialize()}
              className={`font-bold px-6 py-3 rounded-xl shadow-lg border-0 ${
                isConnected 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
              }`}
            >
              {isBlockchainLoading && (
                <span className="h-5 w-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {isConnected ? (
                <>
                  <span className="material-icons text-lg mr-2">refresh</span>
                  Refresh Connection
                </>
              ) : (
                <>
                  <span className="material-icons text-lg mr-2">account_balance_wallet</span>
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Finance Application Card */}
          <motion.div
            key={activeFinanceType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-blue-200 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 w-full"></div>
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <span className="material-icons text-lg">description</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-800">
                    {activeFinanceType === 'factoring' && 'Apply for Factoring'}
                    {activeFinanceType === 'export' && 'Apply for Export Finance'}
                    {activeFinanceType === 'supply' && 'Apply for Supply Chain Finance'}
                    {activeFinanceType === 'import' && 'Apply for Import Finance'}
                    {activeFinanceType === 'noninterest' && 'Apply for Non Interest Finance'}
                    {activeFinanceType === 'startup' && 'Apply for Startup Trade Finance'}
                  </h3>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-blue-200">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {activeFinanceType === 'factoring' && 'Convert your accounts receivable into immediate cash flow by uploading your invoice below.'}
                    {activeFinanceType === 'export' && 'Secure funding for your export operations by providing your shipment and invoice details.'}
                    {activeFinanceType === 'supply' && 'Optimize working capital throughout your supply chain with our advanced financing solutions.'}
                    {activeFinanceType === 'import' && 'Get financing for international purchases and secure your import operations.'}
                    {activeFinanceType === 'noninterest' && 'Access ethical financing solutions with no interest charges for your trade operations.'}
                    {activeFinanceType === 'startup' && 'Specialized financing solutions for early-stage trading businesses.'}
                  </p>
                </div>
                
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
                          onChange={handleFileChange}
                        />
                      </div>
                      <p className="text-xs text-center text-neutral-500 mt-2">Uploading all required documents will speed up the approval process</p>
                      
                      {/* Show uploaded files */}
                      {renderUploadedFilesList()}
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
                                <Input
                                  placeholder="Enter country name"
                                  className="w-full px-4 py-3"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-neutral-500">
                                Country where goods are being exported to
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shipmentDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-neutral-700">Expected Shipment Date</FormLabel>
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
                    
                    {/* Non-Interest Finance specific fields */}
                    {activeFinanceType === 'noninterest' && (
                      <>
                        <FormField
                          control={form.control}
                          name="financingType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-neutral-700">Financing Structure</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  defaultValue="murabaha"
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select financing type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="murabaha">Murabaha (Cost-Plus)</SelectItem>
                                    <SelectItem value="ijara">Ijara (Leasing)</SelectItem>
                                    <SelectItem value="musharaka">Musharaka (Joint Venture)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormDescription className="text-xs text-neutral-500">
                                Select the ethical financing structure that best fits your needs
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="agreementToTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-primary-50 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium text-neutral-700">
                                  Ethical Finance Agreement
                                </FormLabel>
                                <FormDescription className="text-xs text-neutral-500">
                                  I confirm that this transaction complies with ethical finance principles and is free from prohibited activities.
                                </FormDescription>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    
                    {/* Startup Finance specific fields */}
                    {activeFinanceType === 'startup' && (
                      <FormField
                        control={form.control}
                        name="businessAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-neutral-700">Business Age</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select business age" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0-6">0-6 months</SelectItem>
                                  <SelectItem value="6-12">6-12 months</SelectItem>
                                  <SelectItem value="12-24">12-24 months</SelectItem>
                                  <SelectItem value="24+">Over 24 months</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl border-0 transform hover:scale-[1.02] transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin w-6 h-6 mr-3 border-3 border-white border-t-transparent rounded-full"></div>
                          Processing Application...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <span className="material-icons mr-3 text-xl">send</span>
                          Submit for Approval
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

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
              
              <div className="space-y-4">
                {activeContracts.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-neutral-200 rounded-lg bg-neutral-50">
                    <span className="material-icons text-neutral-400 text-4xl mb-3">description</span>
                    <h4 className="text-neutral-800 font-medium mb-1">No active contracts</h4>
                    <p className="text-neutral-600 text-sm">Select a finance option and submit a request to get started.</p>
                  </div>
                ) : (
                  activeContracts.map((contract) => (
                    <div 
                      key={contract.id} 
                      className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-neutral-800">
                          {contract.financeType || "Finance Contract"}
                        </h4>
                        <div className={`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${contract.status === 'Active' ? 'bg-success/10 text-success' : 
                            contract.status === 'Pending' ? 'bg-warning/10 text-warning' : 
                            'bg-neutral-100 text-neutral-600'}
                        `}>
                          {contract.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Invoice Number</p>
                          <p className="text-sm font-mono">{contract.invoiceNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Amount</p>
                          <p className="text-sm font-medium text-neutral-800">{formatCurrency(contract.amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Issued Date</p>
                          <p className="text-sm">{formatDate(contract.issuedDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Due Date</p>
                          <p className="text-sm">{formatDate(contract.dueDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                        <div className="flex items-center">
                          <div className={`
                            h-2 w-2 rounded-full mr-1.5
                            ${contract.fundingStatus === 'Funded' ? 'bg-success' : 
                              contract.fundingStatus === 'Processing' ? 'bg-warning' : 
                              'bg-neutral-300'}
                          `}></div>
                          <span className="text-xs text-neutral-600 mr-3">{contract.fundingStatus}</span>
                          
                          <div className={`
                            h-2 w-2 rounded-full mr-1.5
                            ${contract.smartContractStatus === 'Active' ? 'bg-success' : 
                              contract.smartContractStatus === 'Under Review' ? 'bg-warning' : 
                              'bg-neutral-300'}
                          `}></div>
                          <span className="text-xs text-neutral-600">Smart Contract: {contract.smartContractStatus}</span>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                          <span className="material-icons text-sm mr-1">visibility</span>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Finance Partners Section */}
      <section className="mb-8">
        <div className="bg-neutral-50 rounded-xl p-6 lg:p-8">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-heading font-semibold">Our Finance Partners</h3>
            <p className="text-neutral-600 mt-2">We've partnered with these institutions to provide you with the best financing options</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-center">
            <div className="flex items-center justify-center">
              <div className="text-lg font-heading font-bold text-neutral-700">PAPSS</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-primary-700 text-white font-heading font-bold text-xl px-4 py-2 rounded-lg">
                NAC
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-lg font-heading font-bold text-neutral-700">AfriEximBank</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-lg font-heading font-bold text-neutral-700">ZKSync Finance</div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/finance-comparison">
              <Button variant="outline" className="mt-4">
                <span className="material-icons mr-2">compare</span>
                Compare All Finance Options
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}