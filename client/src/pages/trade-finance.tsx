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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 to-primary-800 text-white rounded-2xl overflow-hidden mb-8">
        <div className="relative z-10 px-6 py-12 md:py-16 lg:py-20 max-w-screen-xl mx-auto">
          <div className="max-w-xl">
            <div className="inline-block text-xs px-2 py-1 rounded-full bg-white/20 font-medium mb-3">
              <span className="flex items-center">
                <span className="material-icons text-xs mr-1">schedule</span>
                Fast approval in 24-48 hours
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Trade Finance Solutions for <br className="hidden sm:block" />
              Global Business Growth
            </h1>
            <p className="text-white/80 mb-6 max-w-lg">
              Unlock capital, manage cash flow, and fund international trade
              with our comprehensive suite of trade finance solutions.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="secondary" size="lg" className="font-medium">
                <span className="material-icons mr-2 text-lg">arrow_downward</span>
                View Finance Options
              </Button>
              <Link href="/finance-comparison">
                <Button variant="outline" className="font-medium bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <span className="material-icons mr-2 text-lg">compare</span>
                  Comparison Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Finance Options */}
      <section className="mb-10" ref={sectionRef as React.RefObject<HTMLElement>}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-2">Finance Options</h2>
            <p className="text-neutral-600 max-w-2xl">
              Select the finance option that best suits your business needs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  ? 'shadow-xl shadow-primary-500/20 ring-2 ring-primary-500 transform scale-[1.03] bg-gradient-to-r from-primary-50 to-white' 
                  : 'shadow-md hover:shadow-lg border border-gray-100 hover:border-primary-200 hover:-translate-y-1 hover:bg-neutral-50'}
              `}
              onClick={() => option.available && setActiveFinanceType(option.id as FinanceType)}
            >
              <div className={`h-3 w-full ${activeFinanceType === option.id as FinanceType ? 'bg-gradient-to-r from-primary-600 to-primary-400' : 'bg-gray-200'}`}></div>
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className={`
                    h-14 w-14 rounded-lg flex items-center justify-center mr-4
                    ${activeFinanceType === option.id as FinanceType 
                      ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-lg' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-700 transition-colors'}
                  `}>
                    <span className="material-icons text-2xl">{option.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-neutral-800 mb-1">{option.name}</h3>
                    <p className={`text-sm ${activeFinanceType === option.id as FinanceType ? 'text-neutral-800 font-medium' : 'text-neutral-600'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Blockchain Connection Status */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 mt-8">
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
              {isConnected ? (
                <>
                  <span className="material-icons text-sm mr-1.5">refresh</span>
                  Refresh Connection
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1.5">account_balance_wallet</span>
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
            <Card className="border-primary-200 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary-600 to-primary-400 w-full"></div>
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
                      className="w-full mt-4"
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