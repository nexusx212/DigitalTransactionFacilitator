import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function FinanceComparison() {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Finance option details for comparison
  const financeOptions = [
    {
      id: 'factoring',
      name: 'Factoring',
      description: 'Convert your accounts receivable into immediate cash flow',
      icon: 'receipt_long',
      processTime: '24-48 hours',
      maxAmount: '$5,000,000',
      interestRate: '4% - 6%',
      term: '30-90 days',
      documentationLevel: 'Low',
      bestFor: 'Businesses with unpaid invoices needing immediate cash',
      securityType: 'Invoice assignment',
      keyBenefit: 'Quick access to working capital without waiting for customer payment'
    },
    {
      id: 'export',
      name: 'Export Finance',
      description: 'Fund your international exports and secure payments',
      icon: 'local_shipping',
      processTime: '2-5 days',
      maxAmount: '$10,000,000',
      interestRate: '5% - 7%',
      term: '60-180 days',
      documentationLevel: 'Medium',
      bestFor: 'Exporters shipping goods internationally',
      securityType: 'Letter of Credit',
      keyBenefit: 'Reduced risk in international transactions with secure payment guarantee'
    },
    {
      id: 'supply',
      name: 'Supply Chain Finance',
      description: 'Optimize working capital throughout the supply chain',
      icon: 'inventory',
      processTime: '3-7 days',
      maxAmount: '$15,000,000',
      interestRate: '3.5% - 5.5%',
      term: '30-120 days',
      documentationLevel: 'Medium',
      bestFor: 'Businesses with complex supply chains',
      securityType: 'Buyer credit rating',
      keyBenefit: 'Strengthen supplier relationships while extending payment terms'
    },
    {
      id: 'import',
      name: 'Import Finance',
      description: 'Secure funding for international goods purchases',
      icon: 'shopping_cart',
      processTime: '3-7 days',
      maxAmount: '$8,000,000',
      interestRate: '5% - 8%',
      term: '60-180 days',
      documentationLevel: 'High',
      bestFor: 'Businesses importing goods from international suppliers',
      securityType: 'Goods as collateral',
      keyBenefit: 'Bridge the gap between paying suppliers and receiving goods'
    },
    {
      id: 'noninterest',
      name: 'Non Interest Finance',
      description: 'Ethical financing solutions with no interest charges',
      icon: 'handshake',
      processTime: '5-10 days',
      maxAmount: '$3,000,000',
      interestRate: '0% (profit sharing)',
      term: '30-180 days',
      documentationLevel: 'Medium',
      bestFor: 'Businesses seeking Sharia-compliant financing',
      securityType: 'Asset-backed',
      keyBenefit: 'Ethical financing aligned with religious principles'
    },
    {
      id: 'startup',
      name: 'Startup Trade Finance',
      description: 'Specialized financing for early-stage trading businesses',
      icon: 'rocket_launch',
      processTime: '7-14 days',
      maxAmount: '$1,000,000',
      interestRate: '6% - 10%',
      term: '30-90 days',
      documentationLevel: 'Low-Medium',
      bestFor: 'Early-stage companies with limited trading history',
      securityType: 'Flexible',
      keyBenefit: 'Access to trade finance despite limited history or collateral'
    }
  ];

  // Table view comparison
  const renderTable = () => (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableCaption>Comprehensive comparison of all available trade finance options</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Finance Type</TableHead>
            <TableHead>Process Time</TableHead>
            <TableHead>Max Amount</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Documentation</TableHead>
            <TableHead className="w-[200px]">Best For</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {financeOptions.map(option => (
            <TableRow key={option.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <span className="material-icons text-primary-500 mr-2">{option.icon}</span>
                  {option.name}
                </div>
              </TableCell>
              <TableCell>{option.processTime}</TableCell>
              <TableCell>{option.maxAmount}</TableCell>
              <TableCell>{option.interestRate}</TableCell>
              <TableCell>{option.term}</TableCell>
              <TableCell>{option.documentationLevel}</TableCell>
              <TableCell className="text-sm">{option.bestFor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Card view comparison
  const renderCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {financeOptions.map((option) => (
        <motion.div
          key={option.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl shadow-md border border-gray-100 overflow-hidden"
        >
          <div className="h-3 w-full bg-primary-500"></div>
          <div className="p-6">
            <div className="flex items-start mb-4">
              <div className="h-14 w-14 rounded-lg flex items-center justify-center mr-4 bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md">
                <span className="material-icons text-2xl">{option.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-neutral-800 mb-1">{option.name}</h3>
                <p className="text-sm text-neutral-600">{option.description}</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Processing Time:</span>
                <span className="font-medium text-neutral-800">{option.processTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Maximum Amount:</span>
                <span className="font-medium text-neutral-800">{option.maxAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Interest Rate:</span>
                <span className="font-medium text-neutral-800">{option.interestRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Term:</span>
                <span className="font-medium text-neutral-800">{option.term}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Documentation:</span>
                <span className="font-medium text-neutral-800">{option.documentationLevel}</span>
              </div>
            </div>
            
            <div className="mt-5 pt-5 border-t border-neutral-100">
              <h4 className="text-sm font-medium mb-2">Key Benefit</h4>
              <p className="text-sm text-neutral-600">{option.keyBenefit}</p>
            </div>
            
            <div className="mt-5">
              <Link href="/trade-finance" className="w-full">
                <Button variant="outline" className="w-full">
                  Apply for {option.name}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-800 mb-2">
            Finance Options Comparison
          </h1>
          <p className="text-neutral-600 max-w-2xl">
            Compare our range of trade finance solutions to find the option that best fits your business needs
          </p>
        </div>
        <Link href="/trade-finance" className="mt-4 md:mt-0">
          <Button className="flex items-center">
            <span className="material-icons mr-2 text-sm">arrow_back</span>
            Back to Trade Finance
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Choose Your View</h2>
              <p className="text-neutral-600 text-sm">Compare finance options in different formats</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === 'table' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center"
              >
                <span className="material-icons mr-1.5 text-sm">table_chart</span>
                Table View
              </Button>
              <Button 
                variant={viewMode === 'cards' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('cards')}
                className="flex items-center"
              >
                <span className="material-icons mr-1.5 text-sm">grid_view</span>
                Card View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="factoring">Factoring</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="supply">Supply Chain</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="noninterest">Non-Interest</TabsTrigger>
          <TabsTrigger value="startup">Startup</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {viewMode === 'table' ? renderTable() : renderCards()}
        </TabsContent>
        
        {financeOptions.map(option => (
          <TabsContent key={option.id} value={option.id}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-14 w-14 rounded-lg flex items-center justify-center mr-4 bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md">
                      <span className="material-icons text-2xl">{option.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-neutral-800 mb-1">{option.name}</h3>
                      <p className="text-neutral-600">{option.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                      <div>
                        <span className="block text-sm text-neutral-500">Processing Time</span>
                        <span className="font-medium text-lg">{option.processTime}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-neutral-500">Maximum Amount</span>
                        <span className="font-medium text-lg">{option.maxAmount}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-neutral-500">Interest Rate</span>
                        <span className="font-medium text-lg">{option.interestRate}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="block text-sm text-neutral-500">Term</span>
                        <span className="font-medium text-lg">{option.term}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-neutral-500">Documentation Level</span>
                        <span className="font-medium text-lg">{option.documentationLevel}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-neutral-500">Security Type</span>
                        <span className="font-medium text-lg">{option.securityType}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-neutral-800 mb-4">Ideal For</h3>
                  <div className="flex items-start mb-6">
                    <span className="material-icons text-primary-500 mr-3">check_circle</span>
                    <p className="text-neutral-700">{option.bestFor}</p>
                  </div>
                  
                  <h3 className="font-bold text-xl text-neutral-800 mb-4">Key Benefits</h3>
                  <div className="flex items-start mb-6">
                    <span className="material-icons text-primary-500 mr-3">stars</span>
                    <p className="text-neutral-700">{option.keyBenefit}</p>
                  </div>
                  
                  <div className="mt-8">
                    <Link href="/trade-finance" className="w-full">
                      <Button className="w-full">
                        Apply for {option.name}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Need Help Choosing?</h2>
          <p className="text-neutral-600 mb-6">
            Our finance specialists can help you determine which option is best suited for your business needs and financial situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex items-center">
              <span className="material-icons mr-2 text-sm">support_agent</span>
              Schedule Consultation
            </Button>
            <Button variant="outline" className="flex items-center">
              <span className="material-icons mr-2 text-sm">smart_toy</span>
              Ask Ava Assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}