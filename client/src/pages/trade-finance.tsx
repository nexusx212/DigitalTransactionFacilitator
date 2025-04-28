import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { simulateSmartContractApproval } from "@/lib/utils";
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
type FinanceType = 'factoring' | 'export' | 'supply' | 'import' | 'islamic';

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

const islamicFinanceSchema = z.object({
  ...baseSchema,
  financingType: z.enum(["murabaha", "ijara", "musharaka"]),
  agreementToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the Shariah-compliant terms",
  }),
});

// Default invoice schema
const invoiceSchema = z.object(baseSchema);

export default function TradeFinance() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFinanceType, setActiveFinanceType] = useState<FinanceType>('factoring');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      id: 'islamic',
      name: 'Islamic Finance',
      description: 'Shariah-compliant financing solutions',
      icon: 'handshake',
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
      case 'islamic':
        return islamicFinanceSchema;
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
      ...(activeFinanceType === 'islamic' ? { 
        financingType: "murabaha",
        agreementToTerms: false  
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
      ...(activeFinanceType === 'islamic' ? { 
        financingType: "murabaha",
        agreementToTerms: false  
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
  
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Parse amount to number for simulation
      const amountValue = parseFloat(data.amount.replace(/,/g, ""));
      
      // Simulate smart contract approval
      const isApproved = await simulateSmartContractApproval(amountValue);
      
      if (isApproved) {
        // Add new contract to the list
        const newContract: FinanceContract = {
          id: `fc-${Date.now().toString(36)}`,
          invoiceNumber: `INV-2023-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: amountValue,
          issuedDate: new Date(),
          dueDate: new Date(data.dueDate),
          status: "Pending",
          fundingStatus: "Processing",
          smartContractStatus: "Under Review",
          financeType: getFinanceTypeLabel(activeFinanceType)
        };
        
        setActiveContracts(prev => [newContract, ...prev]);
        
        // Reset form
        form.reset();
        
        toast({
          title: "Finance Request Submitted Successfully",
          description: `Your ${getFinanceTypeLabel(activeFinanceType)} request has been approved and is now being processed`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Approval Failed",
          description: "The smart contract could not approve this finance request. Please check the amount and try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error processing your finance request",
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
      case 'islamic': 
        return 'Islamic Finance';
      default: 
        return 'Invoice Finance';
    }
  };

  return (
    <section id="trade-finance" className="mb-16 fade-in" ref={sectionRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-1">Trade Finance</h2>
          <p className="text-neutral-600">Quick access to financing through smart-contract approvals</p>
        </div>
        <a href="#" className="mt-3 md:mt-0 text-primary-500 hover:text-primary-700 font-medium flex items-center">
          View All Finance Options <span className="material-icons ml-1">arrow_forward</span>
        </a>
      </div>
      
      {/* Finance Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {financeOptions.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all duration-300
              ${activeFinanceType === option.id as FinanceType
                ? 'border-primary-500 bg-primary-50/50 shadow-md' 
                : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'}
              ${!option.available ? 'opacity-80' : ''}
            `}
            onClick={() => option.available && setActiveFinanceType(option.id as FinanceType)}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center mb-3
                ${activeFinanceType === option.id as FinanceType ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700'}
              `}>
                <span className="material-icons">{option.icon}</span>
              </div>
              <h3 className="font-medium text-neutral-800 mb-1">{option.name}</h3>
              <p className="text-xs text-neutral-600">{option.description}</p>
              
              {option.comingSoon && (
                <span className="absolute top-2 right-2 bg-warning/10 text-warning text-xs px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
          </motion.div>
        ))}
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
              {activeFinanceType === 'islamic' && 'Apply for Islamic Finance'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {activeFinanceType === 'factoring' && 'Convert your accounts receivable into immediate cash flow by uploading your invoice below.'}
              {activeFinanceType === 'export' && 'Secure funding for your export operations by providing your shipment and invoice details.'}
              {activeFinanceType === 'supply' && 'Optimize working capital throughout your supply chain with our advanced financing solutions.'}
              {activeFinanceType === 'import' && 'Get financing for international purchases and secure your import operations.'}
              {activeFinanceType === 'islamic' && 'Access Shariah-compliant financing solutions for your trade operations.'}
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
                
                {/* Islamic Finance specific fields */}
                {activeFinanceType === 'islamic' && (
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
                                <SelectItem value="murabaha">Murabaha (Cost-Plus Financing)</SelectItem>
                                <SelectItem value="ijara">Ijara (Leasing)</SelectItem>
                                <SelectItem value="musharaka">Musharaka (Joint Venture)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-xs text-neutral-500">
                            Choose the Shariah-compliant financing structure
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
                              I agree to the Shariah-compliant terms and conditions
                            </FormLabel>
                            <FormDescription className="text-xs text-neutral-500">
                              By checking this box, you confirm that the transaction complies with Islamic finance principles
                            </FormDescription>
                          </div>
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
            <h3 className="text-xl font-heading font-semibold mb-4">Active Finance Contracts</h3>
            <div className="space-y-5">
              {activeContracts.map((contract) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          contract.status === "Active" 
                            ? "bg-primary-50 text-primary-700" 
                            : contract.status === "Pending"
                              ? "bg-warning/10 text-warning"
                              : "bg-neutral-100 text-neutral-700"
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
