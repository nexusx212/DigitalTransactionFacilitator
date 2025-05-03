import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  MessageSquare, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Send, 
  User, 
  ArrowRight, 
  Video,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HelpSupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  
  // FAQs data structure
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          id: 'gs1',
          question: 'How do I create a trade finance request?',
          answer: 'To create a trade finance request, navigate to the Trade Finance section from the main menu, then click on "New Request". Fill out the required information about your trade, upload the necessary documents, and submit your request for processing.'
        },
        {
          id: 'gs2',
          question: 'What documents do I need for export financing?',
          answer: 'For export financing, you typically need to provide: Commercial invoice, Bill of lading or airway bill, Export licenses, Insurance certificate, and Certificate of origin. Additional documents may be required depending on the goods and destination country.'
        },
        {
          id: 'gs3',
          question: 'How can I verify my business account?',
          answer: 'To verify your business account, go to your Profile page and navigate to the Documents tab. Upload your business registration certificate, tax identification documents, and proof of address. Our team will review and verify your documents within 1-3 business days.'
        }
      ]
    },
    {
      category: 'Marketplace',
      questions: [
        {
          id: 'mp1',
          question: 'How do I list products on the marketplace?',
          answer: 'To list products, go to the Marketplace section and click "Add New Product". Fill in the product details including name, description, price, minimum order quantity, and upload high-quality images. Set your shipping options and publish your listing.'
        },
        {
          id: 'mp2',
          question: 'What is the marketplace verification process?',
          answer: 'All marketplace sellers undergo a verification process that includes business document verification, product quality assessment, and compliance checks. This typically takes 3-5 business days after submitting the required documentation.'
        },
        {
          id: 'mp3',
          question: 'How does the escrow service work?',
          answer: 'Our escrow service protects both buyers and sellers. When a purchase is made, the payment is held in escrow until the goods are delivered and confirmed received. If there are any disputes, our resolution team will help mediate and resolve the issue before funds are released.'
        }
      ]
    },
    {
      category: 'Payments & Wallet',
      questions: [
        {
          id: 'pw1',
          question: 'How do I add funds to my wallet?',
          answer: 'To add funds to your wallet, go to the Wallet section and click "Deposit". You can add funds via bank transfer, mobile money, or cryptocurrency. Follow the on-screen instructions to complete your deposit.'
        },
        {
          id: 'pw2',
          question: 'What is PADC coin and how do I get it?',
          answer: 'PADC (Pan-African Digital Currency) is our platform\'s native token used for premium features and reduced transaction fees. You can acquire PADC by converting funds in your wallet to PADC or by receiving it from other users on the platform.'
        },
        {
          id: 'pw3',
          question: 'How long do withdrawals take to process?',
          answer: 'Withdrawal processing times vary by method: Bank transfers typically take 1-3 business days, Mobile money is processed within 24 hours, and Cryptocurrency withdrawals are usually completed within 1-2 hours after approval.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          id: 'ts1',
          question: 'How do I reset my password?',
          answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the link to create a new password.'
        },
        {
          id: 'ts2',
          question: 'Can I use the platform offline?',
          answer: 'Yes, DTFS is a Progressive Web App (PWA) with offline capabilities. You can install it on your device and access certain features without an internet connection. Your data will sync once you're back online.'
        },
        {
          id: 'ts3',
          question: 'How do I translate the platform to my language?',
          answer: 'DTFS supports multiple languages. Click on the language selector in the bottom right corner of the screen or go to Settings > General > Language to choose your preferred language.'
        }
      ]
    }
  ];
  
  // Recent support tickets
  const supportTickets = [
    { 
      id: 'TCK-2498', 
      subject: 'Payment not showing in wallet', 
      status: 'open', 
      lastUpdated: '2024-05-01', 
      priority: 'high'
    },
    { 
      id: 'TCK-2342', 
      subject: 'Document verification issue', 
      status: 'closed', 
      lastUpdated: '2024-04-28', 
      priority: 'medium'
    },
    { 
      id: 'TCK-2187', 
      subject: 'Product listing questions', 
      status: 'resolved', 
      lastUpdated: '2024-04-15', 
      priority: 'low'
    }
  ];
  
  // Knowledge base articles
  const knowledgeArticles = [
    {
      id: 'kb1',
      title: 'Guide to Trade Finance Options',
      category: 'Trade Finance',
      readTime: '5 min read',
      excerpt: 'Explore different trade finance options available including factoring, export finance, and supply chain finance...'
    },
    {
      id: 'kb2',
      title: 'Secure Payments with Escrow',
      category: 'Payments',
      readTime: '3 min read',
      excerpt: 'Learn how to use our escrow service to securely process payments between buyers and sellers...'
    },
    {
      id: 'kb3',
      title: 'Platform Navigation Guide',
      category: 'Getting Started',
      readTime: '4 min read',
      excerpt: 'A comprehensive guide to navigating the DTFS platform and making the most of its features...'
    },
    {
      id: 'kb4',
      title: 'Document Requirements by Country',
      category: 'Documentation',
      readTime: '7 min read',
      excerpt: 'Country-specific document requirements for international trade and export/import processes...'
    },
    {
      id: 'kb5',
      title: 'PADC Coin: Benefits and Usage',
      category: 'Payments',
      readTime: '6 min read',
      excerpt: 'Everything you need to know about PADC coin, our platform token, and how to use it for premium features...'
    }
  ];
  
  // Video tutorials
  const videoTutorials = [
    {
      id: 'v1',
      title: 'Getting Started with DTFS',
      duration: '5:20',
      thumbnail: 'https://placehold.co/300x169'
    },
    {
      id: 'v2',
      title: 'Creating Your First Trade Finance Request',
      duration: '8:45',
      thumbnail: 'https://placehold.co/300x169'
    },
    {
      id: 'v3',
      title: 'How to Use the Marketplace',
      duration: '6:12',
      thumbnail: 'https://placehold.co/300x169'
    },
    {
      id: 'v4',
      title: 'Managing Your Digital Wallet',
      duration: '4:30',
      thumbnail: 'https://placehold.co/300x169'
    }
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = searchQuery 
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;
  
  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.subject || !contactForm.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before submitting.',
        variant: 'destructive',
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setContactForm({ subject: '', message: '' });
      
      toast({
        title: 'Support Request Sent',
        description: 'We\'ve received your message and will respond within 24 hours.',
        variant: 'default',
      });
    }, 1500);
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getVariant = () => {
      switch (status) {
        case 'open': return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'closed': return 'bg-red-100 text-red-800 border-red-200';
        case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariant()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Browse FAQs, find documentation, or contact our support team
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search for help, documentation, or FAQs..."
            className="pl-10 py-6 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex flex-col items-center py-2 px-1 space-y-1">
            <HelpCircle className="h-5 w-5" />
            <span>FAQs</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex flex-col items-center py-2 px-1 space-y-1">
            <MessageSquare className="h-5 w-5" />
            <span>Contact Us</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex flex-col items-center py-2 px-1 space-y-1">
            <BookOpen className="h-5 w-5" />
            <span>Knowledge Base</span>
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex flex-col items-center py-2 px-1 space-y-1">
            <Video className="h-5 w-5" />
            <span>Tutorials</span>
          </TabsTrigger>
        </TabsList>
        
        {/* FAQs Tab */}
        <TabsContent value="faq" className="space-y-6">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground pb-2">{faq.answer}</p>
                          <div className="flex justify-end">
                            <Button variant="link" size="sm" className="text-xs">
                              Was this helpful?
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No matching FAQs found</h3>
              <p className="text-muted-foreground mb-6">
                Try a different search or browse all our help categories
              </p>
              <Button onClick={() => setSearchQuery('')} variant="outline">
                Clear Search
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Contact Us Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/3">
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Need help with something specific? Send us a message and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What do you need help with?"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Please describe your issue in detail..."
                        className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </div>
              <div className="md:w-1/3 bg-muted">
                <div className="p-6 h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Direct Contact</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Call Support</p>
                          <p className="text-sm text-muted-foreground">+256 (0) 789 123 456</p>
                          <p className="text-sm text-muted-foreground">Mon-Fri, 8am-6pm EAT</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Email Support</p>
                          <p className="text-sm text-muted-foreground">support@dtfs.example</p>
                          <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <h4 className="text-sm font-medium">Your Recent Tickets</h4>
                    {supportTickets.length > 0 ? (
                      <div className="space-y-2">
                        {supportTickets.map((ticket) => (
                          <div key={ticket.id} className="flex items-center justify-between p-3 rounded-md bg-background hover:bg-accent transition-colors">
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="text-xs font-mono">{ticket.id}</p>
                                <StatusBadge status={ticket.status} />
                              </div>
                              <p className="text-sm font-medium mt-1">{ticket.subject}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No recent support tickets</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {knowledgeArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{article.excerpt}</p>
                </CardContent>
                <CardFooter className="border-t pt-4 pb-2">
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Read Article
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline">
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>
        
        {/* Video Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoTutorials.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full w-12 h-12 bg-primary/90 flex items-center justify-center text-white hover:bg-primary cursor-pointer transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium">{video.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline">
              View All Tutorials
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}