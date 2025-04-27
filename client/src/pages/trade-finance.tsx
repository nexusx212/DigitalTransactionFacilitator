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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
};

// Form schema
const invoiceSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  dueDate: z.string().min(1, "Due date is required"),
  invoiceFile: z.instanceof(FileList).refine(files => files.length > 0, {
    message: "Invoice file is required",
  }),
});

export default function TradeFinance() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeContracts, setActiveContracts] = useState<FinanceContract[]>([
    {
      id: "fc-001",
      invoiceNumber: "INV-2023-0042",
      amount: 32500,
      issuedDate: new Date("2023-05-12"),
      dueDate: new Date("2023-06-12"),
      status: "Active",
      fundingStatus: "Funded",
      smartContractStatus: "Active"
    },
    {
      id: "fc-002",
      invoiceNumber: "INV-2023-0055",
      amount: 18750,
      issuedDate: new Date("2023-05-28"),
      dueDate: new Date("2023-06-28"),
      status: "Pending",
      fundingStatus: "Processing",
      smartContractStatus: "Under Review"
    }
  ]);
  
  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form setup
  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      amount: "",
      dueDate: "",
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
  
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const onSubmit = async (data: z.infer<typeof invoiceSchema>) => {
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
          smartContractStatus: "Under Review"
        };
        
        setActiveContracts(prev => [newContract, ...prev]);
        
        // Reset form
        form.reset();
        
        toast({
          title: "Invoice Submitted Successfully",
          description: "Your invoice has been approved and is now being processed",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Approval Failed",
          description: "The smart contract could not approve this invoice. Please check the amount and try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error processing your invoice",
      });
    } finally {
      setIsSubmitting(false);
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Finance Application Card */}
        <Card>
          <CardContent className="p-6 lg:p-8">
            <h3 className="text-xl font-heading font-semibold mb-4">Apply for Invoice Financing</h3>
            <p className="text-neutral-600 mb-6">Upload your invoice to get instant financing through our smart contract system.</p>
            
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
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        contract.status === "Active" 
                          ? "bg-primary-50 text-primary-700" 
                          : contract.status === "Pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-neutral-100 text-neutral-700"
                      }`}>
                        {contract.status}
                      </span>
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
