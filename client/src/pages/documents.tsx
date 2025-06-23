import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: DocumentField[];
  estimatedTime: string;
  popularity: number;
}

interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'currency';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface GeneratedDocument {
  id: string;
  templateId: string;
  templateName: string;
  createdAt: string;
  status: 'draft' | 'completed' | 'sent';
  data: Record<string, string>;
}

export default function DocumentWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Document templates
  const templates: DocumentTemplate[] = [
    {
      id: "invoice",
      name: "Commercial Invoice",
      description: "Create professional invoices for international trade transactions",
      category: "Trade Finance",
      estimatedTime: "5 minutes",
      popularity: 95,
      fields: [
        { id: "invoiceNumber", label: "Invoice Number", type: "text", required: true, placeholder: "INV-2024-001" },
        { id: "date", label: "Invoice Date", type: "date", required: true },
        { id: "buyerName", label: "Buyer Name", type: "text", required: true, placeholder: "Company Name" },
        { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, placeholder: "Full address with country" },
        { id: "sellerName", label: "Seller Name", type: "text", required: true, placeholder: "Your company name" },
        { id: "sellerAddress", label: "Seller Address", type: "textarea", required: true, placeholder: "Your company address" },
        { id: "productDescription", label: "Product Description", type: "textarea", required: true, placeholder: "Detailed description of goods" },
        { id: "quantity", label: "Quantity", type: "number", required: true, placeholder: "1000" },
        { id: "unitPrice", label: "Unit Price", type: "currency", required: true, placeholder: "0.00" },
        { id: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "CAD", "AUD"] },
        { id: "paymentTerms", label: "Payment Terms", type: "select", required: true, options: ["30 Days", "60 Days", "90 Days", "Upon Delivery", "Advance Payment"] }
      ]
    },
    {
      id: "letterOfCredit",
      name: "Letter of Credit Application",
      description: "Apply for letter of credit for secure international payments",
      category: "Trade Finance",
      estimatedTime: "10 minutes",
      popularity: 88,
      fields: [
        { id: "applicantName", label: "Applicant Name", type: "text", required: true, placeholder: "Your company name" },
        { id: "beneficiaryName", label: "Beneficiary Name", type: "text", required: true, placeholder: "Supplier company name" },
        { id: "creditAmount", label: "Credit Amount", type: "currency", required: true, placeholder: "0.00" },
        { id: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "CAD", "AUD"] },
        { id: "expiryDate", label: "Expiry Date", type: "date", required: true },
        { id: "shipmentDescription", label: "Shipment Description", type: "textarea", required: true, placeholder: "Description of goods to be shipped" },
        { id: "shipmentFrom", label: "Shipment From", type: "text", required: true, placeholder: "Port of loading" },
        { id: "shipmentTo", label: "Shipment To", type: "text", required: true, placeholder: "Port of discharge" },
        { id: "latestShipmentDate", label: "Latest Shipment Date", type: "date", required: true }
      ]
    },
    {
      id: "billOfLading",
      name: "Bill of Lading",
      description: "Generate bill of lading for cargo shipments",
      category: "Shipping",
      estimatedTime: "8 minutes",
      popularity: 82,
      fields: [
        { id: "blNumber", label: "B/L Number", type: "text", required: true, placeholder: "BL-2024-001" },
        { id: "vesselName", label: "Vessel Name", type: "text", required: true, placeholder: "MV Cargo Ship" },
        { id: "voyageNumber", label: "Voyage Number", type: "text", required: true, placeholder: "V001" },
        { id: "portOfLoading", label: "Port of Loading", type: "text", required: true, placeholder: "Lagos, Nigeria" },
        { id: "portOfDischarge", label: "Port of Discharge", type: "text", required: true, placeholder: "Hamburg, Germany" },
        { id: "shipper", label: "Shipper", type: "textarea", required: true, placeholder: "Shipper name and address" },
        { id: "consignee", label: "Consignee", type: "textarea", required: true, placeholder: "Consignee name and address" },
        { id: "cargoDescription", label: "Cargo Description", type: "textarea", required: true, placeholder: "Description of cargo" },
        { id: "containerNumbers", label: "Container Numbers", type: "textarea", required: true, placeholder: "List of container numbers" },
        { id: "freightTerms", label: "Freight Terms", type: "select", required: true, options: ["Prepaid", "Collect", "Prepaid & Collect"] }
      ]
    },
    {
      id: "exportLicense",
      name: "Export License Application",
      description: "Apply for export license for regulated goods",
      category: "Legal",
      estimatedTime: "15 minutes",
      popularity: 65,
      fields: [
        { id: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Your company name" },
        { id: "licenseNumber", label: "Previous License Number", type: "text", required: false, placeholder: "If renewing" },
        { id: "productCategory", label: "Product Category", type: "select", required: true, options: ["Agricultural Products", "Electronics", "Textiles", "Chemicals", "Machinery", "Other"] },
        { id: "productDetails", label: "Product Details", type: "textarea", required: true, placeholder: "Detailed description of products to export" },
        { id: "destinationCountry", label: "Destination Country", type: "text", required: true, placeholder: "Country of export" },
        { id: "exportValue", label: "Export Value", type: "currency", required: true, placeholder: "0.00" },
        { id: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "CAD", "AUD"] },
        { id: "exportPurpose", label: "Export Purpose", type: "select", required: true, options: ["Commercial Sale", "Temporary Export", "Gift", "Personal Use", "Other"] }
      ]
    },
    {
      id: "contractAgreement",
      name: "Trade Contract Agreement",
      description: "Create comprehensive trade agreements between parties",
      category: "Legal",
      estimatedTime: "20 minutes",
      popularity: 78,
      fields: [
        { id: "contractNumber", label: "Contract Number", type: "text", required: true, placeholder: "CT-2024-001" },
        { id: "party1Name", label: "First Party (Buyer)", type: "text", required: true, placeholder: "Buyer company name" },
        { id: "party1Address", label: "First Party Address", type: "textarea", required: true, placeholder: "Buyer address" },
        { id: "party2Name", label: "Second Party (Seller)", type: "text", required: true, placeholder: "Seller company name" },
        { id: "party2Address", label: "Second Party Address", type: "textarea", required: true, placeholder: "Seller address" },
        { id: "contractValue", label: "Contract Value", type: "currency", required: true, placeholder: "0.00" },
        { id: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "CAD", "AUD"] },
        { id: "deliveryTerms", label: "Delivery Terms", type: "select", required: true, options: ["FOB", "CIF", "EXW", "DDP", "FCA"] },
        { id: "paymentMethod", label: "Payment Method", type: "select", required: true, options: ["Letter of Credit", "Bank Transfer", "Documentary Collection", "Open Account"] },
        { id: "deliveryDate", label: "Delivery Date", type: "date", required: true },
        { id: "specialTerms", label: "Special Terms", type: "textarea", required: false, placeholder: "Any additional terms and conditions" }
      ]
    }
  ];

  // Generated documents (mock data)
  const [generatedDocuments] = useState<GeneratedDocument[]>([
    {
      id: "doc-1",
      templateId: "invoice",
      templateName: "Commercial Invoice",
      createdAt: "2024-01-20T10:30:00Z",
      status: "completed",
      data: {
        invoiceNumber: "INV-2024-001",
        buyerName: "European Chocolate Co.",
        productDescription: "Premium Cocoa Beans - 5000kg"
      }
    },
    {
      id: "doc-2",
      templateId: "letterOfCredit",
      templateName: "Letter of Credit Application",
      createdAt: "2024-01-19T14:15:00Z",
      status: "sent",
      data: {
        applicantName: "Demo User Company",
        beneficiaryName: "Ethiopian Coffee Cooperative",
        creditAmount: "25000"
      }
    }
  ]);

  const categories = ["all", "Trade Finance", "Shipping", "Legal"];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const calculateProgress = () => {
    if (!selectedTemplate) return 0;
    const requiredFields = selectedTemplate.fields.filter(f => f.required);
    const completedFields = requiredFields.filter(f => formData[f.id] && formData[f.id].trim() !== '');
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const canProceedToNext = () => {
    if (currentStep === 0) return selectedTemplate !== null;
    if (currentStep === 1) return calculateProgress() === 100;
    return true;
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGenerate = () => {
    console.log("Generating document with data:", formData);
    // In a real app, this would generate the document
    setCurrentStep(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const stepTitles = ["Choose Template", "Fill Information", "Review & Generate"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-semibold mb-4">
            <span className="material-icons text-sm">description</span>
            Document Wizard
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Generate Trade Documents
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create professional trade documents quickly with our intelligent wizard
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= currentStep 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? "text-blue-600" : "text-gray-500"
                }`}>
                  {title}
                </span>
                {index < stepTitles.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    index < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Tabs value={currentStep === 0 ? "templates" : currentStep === 1 ? "form" : "review"} className="space-y-6">
          <TabsContent value="templates" className="space-y-6">
            {/* Step 1: Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Document Template</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">{template.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span className="material-icons text-[12px]">schedule</span>
                          {template.estimatedTime}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{template.category}</Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span className="material-icons text-[12px]">trending_up</span>
                          {template.popularity}% popular
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="form" className="space-y-6">
            {/* Step 2: Form Filling */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedTemplate.name}</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        Progress: {calculateProgress()}%
                      </div>
                      <Progress value={calculateProgress()} className="w-32" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.id}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="min-h-[80px]"
                          />
                        ) : field.type === 'select' ? (
                          <Select
                            value={formData[field.id] || ''}
                            onValueChange={(value) => handleFieldChange(field.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option..." />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={field.id}
                            type={field.type === 'currency' ? 'number' : field.type}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            step={field.type === 'currency' ? '0.01' : undefined}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            {/* Step 3: Review & Generate */}
            <Card>
              <CardHeader>
                <CardTitle>Document Generated Successfully</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-green-600 text-[48px]">check_circle</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {selectedTemplate?.name} Generated
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your document has been created and is ready for download or sharing.
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <Button>
                      <span className="material-icons text-[16px] mr-1">download</span>
                      Download PDF
                    </Button>
                    <Button variant="outline">
                      <span className="material-icons text-[16px] mr-1">share</span>
                      Share Document
                    </Button>
                    <Button variant="outline">
                      <span className="material-icons text-[16px] mr-1">edit</span>
                      Edit Document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        {currentStep < 2 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              onClick={currentStep === 1 ? handleGenerate : handleNext}
              disabled={!canProceedToNext()}
            >
              {currentStep === 1 ? "Generate Document" : "Next"}
            </Button>
          </div>
        )}

        {/* Recent Documents */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="material-icons text-blue-600 text-[20px]">description</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{doc.templateName}</h4>
                      <p className="text-sm text-gray-600">Created {formatDate(doc.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                      doc.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {doc.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <span className="material-icons text-[16px]">more_vert</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}