import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  Sparkles, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  CreditCard,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UpgradePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [selectedDuration, setSelectedDuration] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [padcBalance, setPadcBalance] = useState(500); // Simulated PADC balance
  
  // Plan data
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Essential features for small businesses and individual traders',
      price: {
        monthly: 50,
        annual: 500,
      },
      features: [
        { name: 'Up to 10 product listings', included: true },
        { name: 'Basic marketplace analytics', included: true },
        { name: 'Trade finance requests (3/month)', included: true },
        { name: 'Standard transaction rates', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced verification badge', included: false },
        { name: 'Priority dispute resolution', included: false },
        { name: 'Custom contracts', included: false },
        { name: 'Dedicated account manager', included: false },
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Comprehensive solution for growing businesses with international trade needs',
      price: {
        monthly: 150,
        annual: 1500,
      },
      features: [
        { name: 'Unlimited product listings', included: true },
        { name: 'Advanced marketplace analytics', included: true },
        { name: 'Trade finance requests (10/month)', included: true },
        { name: 'Reduced transaction rates', included: true },
        { name: 'Priority email & chat support', included: true },
        { name: 'Advanced verification badge', included: true },
        { name: 'Priority dispute resolution', included: true },
        { name: 'Custom contracts', included: true },
        { name: 'Dedicated account manager', included: false },
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Full-featured solution for large businesses with extensive trading operations',
      price: {
        monthly: 300,
        annual: 3000,
      },
      features: [
        { name: 'Unlimited product listings', included: true },
        { name: 'Advanced marketplace analytics with exports', included: true },
        { name: 'Unlimited trade finance requests', included: true },
        { name: 'Lowest transaction rates', included: true },
        { name: '24/7 phone, email & chat support', included: true },
        { name: 'Premium verification badge', included: true },
        { name: 'Express dispute resolution', included: true },
        { name: 'Custom contracts with legal review', included: true },
        { name: 'Dedicated account manager', included: true },
      ]
    }
  ];
  
  // Get current plan based on selection
  const currentPlan = plans.find(plan => plan.id === selectedPlan);
  
  // Calculate price based on selected duration
  const price = currentPlan?.price[selectedDuration as keyof typeof currentPlan.price] || 0;
  
  // Calculate annual savings percentage
  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12;
    return Math.round(((monthlyCost - annual) / monthlyCost) * 100);
  };
  
  // Handle the upgrade process
  const handleUpgrade = () => {
    // Check if user has enough PADC balance
    if (padcBalance < price) {
      toast({
        title: 'Insufficient PADC Balance',
        description: `You need ${price} PADC to upgrade. Please add more funds to your wallet.`,
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Deduct PADC from balance
      setPadcBalance(prev => prev - price);
      
      setIsLoading(false);
      
      toast({
        title: 'Upgrade Successful!',
        description: `You have successfully upgraded to the ${currentPlan?.name} plan.`,
        variant: 'default',
      });
    }, 2000);
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upgrade Your Plan</h1>
        <p className="text-muted-foreground">
          Access premium features to enhance your trading experience
        </p>
      </div>
      
      {/* Current Balance */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current PADC Balance</p>
                <p className="text-3xl font-bold">{padcBalance} <span className="text-base font-normal text-muted-foreground">PADC</span></p>
              </div>
            </div>
            <Button variant="outline" className="ml-auto">
              Add PADC
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Plan Selection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Select Your Plan</h2>
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium whitespace-nowrap">Billing Cycle:</p>
            <Tabs 
              defaultValue="monthly" 
              value={selectedDuration} 
              onValueChange={setSelectedDuration}
              className="w-[300px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">
                  Annual
                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                    Save {calculateSavings(plans[1].price.monthly, plans[1].price.annual)}%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden ${
                  isSelected 
                    ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                    : 'hover:border-primary/50 transition-all'
                }`}
              >
                {plan.id === 'professional' && (
                  <div className="absolute top-0 left-0 w-full bg-primary text-primary-foreground text-center py-1 text-xs font-medium">
                    MOST POPULAR
                  </div>
                )}
                
                <CardHeader className={plan.id === 'professional' ? 'pt-8' : 'pt-6'}>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">
                      {price} <span className="text-base font-normal text-muted-foreground">PADC</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDuration === 'monthly' ? 'per month' : 'per year'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        {feature.included ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {isSelected ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Summary and Payment */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Review your plan selection and complete your upgrade</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{currentPlan?.name} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {selectedDuration === 'monthly' ? 'Monthly subscription' : 'Annual subscription'}
                </p>
              </div>
              <p className="font-medium">{price} PADC</p>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between font-bold">
              <p>Total</p>
              <p>{price} PADC</p>
            </div>
          </div>
          
          <div className="rounded-md border p-4 bg-muted/50">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">PADC Token Payment Only</p>
                <p className="text-sm text-muted-foreground">
                  Premium features can only be purchased using PADC tokens. Other payment methods are not accepted for premium plans.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-muted-foreground text-sm flex items-center">
            <Lock className="h-4 w-4 mr-1" />
            Secure payment with PADC
          </div>
          <Button 
            onClick={handleUpgrade} 
            disabled={isLoading || padcBalance < price}
            className="min-w-[150px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Upgrade Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>Compare features across all plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  {plans.map(plan => (
                    <th 
                      key={plan.id} 
                      className={`text-center py-3 px-4 ${selectedPlan === plan.id ? 'text-primary' : ''}`}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "Product listings",
                  "Marketplace analytics",
                  "Trade finance requests",
                  "Transaction rates",
                  "Support",
                  "Verification badge",
                  "Dispute resolution",
                  "Contracts",
                  "Account manager"
                ].map((feature, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-3 px-4">{feature}</td>
                    {plans.map(plan => {
                      const planFeature = plan.features[index];
                      return (
                        <td 
                          key={`${plan.id}-${index}`} 
                          className={`text-center py-3 px-4 ${
                            selectedPlan === plan.id ? 'text-primary' : ''
                          }`}
                        >
                          {planFeature.included ? (
                            feature === "Product listings" ? (
                              plan.id === "basic" ? "Up to 10" : "Unlimited"
                            ) : 
                            feature === "Marketplace analytics" ? (
                              plan.id === "basic" ? "Basic" : plan.id === "professional" ? "Advanced" : "Advanced with exports"
                            ) :
                            feature === "Trade finance requests" ? (
                              plan.id === "basic" ? "3/month" : plan.id === "professional" ? "10/month" : "Unlimited"
                            ) :
                            feature === "Transaction rates" ? (
                              plan.id === "basic" ? "Standard" : plan.id === "professional" ? "Reduced" : "Lowest"
                            ) :
                            feature === "Support" ? (
                              plan.id === "basic" ? "Email" : plan.id === "professional" ? "Priority email & chat" : "24/7 phone, email & chat"
                            ) :
                            feature === "Verification badge" ? (
                              plan.id === "basic" ? "—" : plan.id === "professional" ? "Advanced" : "Premium"
                            ) :
                            feature === "Dispute resolution" ? (
                              plan.id === "basic" ? "—" : plan.id === "professional" ? "Priority" : "Express"
                            ) :
                            feature === "Contracts" ? (
                              plan.id === "basic" ? "—" : plan.id === "professional" ? "Custom" : "Custom with legal review"
                            ) :
                            <CheckCircle2 className="h-4 w-4 mx-auto text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 mx-auto text-muted-foreground" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">What is PADC coin?</h3>
            <p className="text-muted-foreground">
              PADC (Pan-African Digital Currency) is our platform's native token used for premium features and reduced transaction fees. You can acquire PADC by converting funds in your wallet to PADC or by receiving it from other users on the platform.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">How do I cancel or change my plan?</h3>
            <p className="text-muted-foreground">
              You can change or cancel your plan at any time from your account settings. If you downgrade or cancel, you'll continue to have access to your current plan until the end of your billing period.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Is there a refund policy?</h3>
            <p className="text-muted-foreground">
              We offer a 7-day money-back guarantee for all plans. If you're not satisfied with your premium features, contact our support team within 7 days of your purchase for a full refund.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}