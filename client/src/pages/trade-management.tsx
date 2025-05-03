import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatTranslator } from '@/components/chat-translator';
import { AdBanner } from '@/components/ad-banner';
import { PartnersSection } from '@/components/partners-section';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TradeManagement() {
  const [activeTab, setActiveTab] = useState("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTranslation, setActiveTranslation] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [requestFilter, setRequestFilter] = useState("all");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [newContactModalOpen, setNewContactModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Define chat message interface
  interface ChatMessage {
    id: string;
    content: string;
    senderId: string;
    timestamp: string;
    isRead: boolean;
  }
  
  // Define chat session interface
  interface ChatSession {
    id: string;
    contact: TradeContact;
    messages: ChatMessage[];
    unreadCount: number;
  }

  // Chat data
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "chat-1",
      contact: {
        id: 1,
        name: "John Doe",
        company: "Global Imports Ltd",
        country: "USA",
        avatar: "",
        status: "online",
        tradeRole: "importer"
      },
      messages: [
        { id: "m1", content: "Hello, I'm interested in your cotton exports. Do you have availability for next month?", senderId: "contact-1", timestamp: new Date(2023, 4, 15, 10, 30).toISOString(), isRead: true },
        { id: "m2", content: "Hi John! Yes, we have cotton available for export next month. What quantity are you looking for?", senderId: "user", timestamp: new Date(2023, 4, 15, 10, 35).toISOString(), isRead: true },
        { id: "m3", content: "We need about 500 tons. What's your pricing model and delivery timeframe?", senderId: "contact-1", timestamp: new Date(2023, 4, 15, 10, 40).toISOString(), isRead: true },
      ],
      unreadCount: 0
    },
    {
      id: "chat-2",
      contact: {
        id: 2,
        name: "Maria Garcia",
        company: "European Distributors SA",
        country: "Spain",
        avatar: "",
        status: "away",
        tradeRole: "importer"
      },
      messages: [
        { id: "m4", content: "Buenos días, ¿tienen disponibilidad de productos agrícolas orgánicos?", senderId: "contact-2", timestamp: new Date(2023, 4, 16, 9, 10).toISOString(), isRead: true },
        { id: "m5", content: "Good morning Maria! Yes, we have organic agricultural products available. What specifically are you looking for?", senderId: "user", timestamp: new Date(2023, 4, 16, 9, 15).toISOString(), isRead: true },
        { id: "m6", content: "Estamos interesados en café orgánico, cacao y azúcar. ¿Qué volúmenes pueden suministrar?", senderId: "contact-2", timestamp: new Date(2023, 4, 16, 9, 20).toISOString(), isRead: false },
      ],
      unreadCount: 1
    },
    {
      id: "chat-3",
      contact: {
        id: 3,
        name: "Akio Tanaka",
        company: "Tokyo Traders Inc.",
        country: "Japan",
        avatar: "",
        status: "offline",
        tradeRole: "importer"
      },
      messages: [
        { id: "m7", content: "こんにちは、ナイジェリアのシアバターについて詳細情報をいただけますか？", senderId: "contact-3", timestamp: new Date(2023, 4, 14, 15, 5).toISOString(), isRead: true },
        { id: "m8", content: "Hello Akio! I'd be happy to provide details about our Nigerian shea butter. What aspects are you most interested in?", senderId: "user", timestamp: new Date(2023, 4, 14, 15, 10).toISOString(), isRead: true },
        { id: "m9", content: "価格と品質証明書について知りたいです。また、最小注文数量はありますか？", senderId: "contact-3", timestamp: new Date(2023, 4, 14, 15, 15).toISOString(), isRead: true },
        { id: "m10", content: "We can provide all quality certificates and our pricing is competitive. Minimum order is 200kg. Would you like me to send our catalog?", senderId: "user", timestamp: new Date(2023, 4, 14, 15, 20).toISOString(), isRead: true },
      ],
      unreadCount: 0
    }
  ]);

  const [tradeContacts, setTradeContacts] = useState([
    {
      id: 1,
      name: "John Doe",
      company: "Global Imports Ltd",
      country: "USA",
      avatar: "",
      status: "online",
      tradeRole: "importer",
      lastActivity: new Date(2023, 5, 10).toISOString(),
      products: ["Cotton", "Cocoa"],
      isFavorite: false
    },
    {
      id: 2,
      name: "Maria Garcia",
      company: "European Distributors SA",
      country: "Spain",
      avatar: "",
      status: "away",
      tradeRole: "importer",
      lastActivity: new Date(2023, 5, 9).toISOString(),
      products: ["Organic Coffee", "Shea Butter"],
      isFavorite: true
    },
    {
      id: 3,
      name: "Akio Tanaka",
      company: "Tokyo Traders Inc.",
      country: "Japan",
      avatar: "",
      status: "offline",
      tradeRole: "importer",
      lastActivity: new Date(2023, 5, 5).toISOString(),
      products: ["Textiles", "Shea Butter"],
      isFavorite: false
    },
    {
      id: 4,
      name: "Chen Wei",
      company: "Shanghai Exports Co.",
      country: "China",
      avatar: "",
      status: "online",
      tradeRole: "exporter",
      lastActivity: new Date(2023, 5, 12).toISOString(),
      products: ["Electronics", "Solar Panels"],
      isFavorite: false
    },
    {
      id: 5,
      name: "Olabisi Adenuga",
      company: "Lagos Commodities Ltd",
      country: "Nigeria",
      avatar: "",
      status: "online",
      tradeRole: "exporter",
      lastActivity: new Date(2023, 5, 11).toISOString(),
      products: ["Cashew Nuts", "Cocoa"],
      isFavorite: true
    },
    {
      id: 6,
      name: "Fatima Al-Farsi",
      company: "Gulf Trade Partners",
      country: "UAE",
      avatar: "",
      status: "away",
      tradeRole: "importer",
      lastActivity: new Date(2023, 5, 8).toISOString(),
      products: ["Textiles", "Agricultural Products"],
      isFavorite: false
    }
  ]);

  // Define trade request interface
  interface TradeRequest {
    id: string;
    name: string;
    company: string;
    avatar: string;
    country: string;
    productName?: string;
    type: "incoming" | "outgoing";
    status: "pending" | "accepted" | "declined";
    date: string;
    message: string;
  }
  
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([
    {
      id: "req-1",
      name: "Sarah Johnson",
      company: "Canadian Imports Inc.",
      avatar: "",
      country: "Canada",
      type: "incoming",
      status: "pending",
      date: new Date(2023, 4, 16).toISOString(),
      message: "Hello, we are interested in sourcing organic cocoa beans from your suppliers. Could you provide information on your available quantities, pricing, and certification?"
    },
    {
      id: "req-2",
      name: "Mohamed Al-Farsi",
      company: "Middle East Trade LLC",
      avatar: "",
      country: "Saudi Arabia",
      type: "outgoing",
      status: "accepted",
      date: new Date(2023, 4, 15).toISOString(),
      message: "I'd like to discuss a potential partnership for importing premium Nigerian textiles to Saudi Arabia. Please let me know your availability for a meeting."
    },
    {
      id: "req-3",
      name: "Rajiv Patel",
      company: "Indian Spice Traders",
      avatar: "",
      country: "India",
      type: "incoming",
      status: "pending",
      date: new Date(2023, 4, 14).toISOString(),
      message: "We are looking for high-quality African spices, particularly from East Africa. Can you connect us with reliable suppliers?"
    },
    {
      id: "req-4",
      name: "Elena Vasquez",
      company: "South American Distributors",
      avatar: "",
      country: "Brazil",
      type: "outgoing",
      status: "declined",
      date: new Date(2023, 4, 13).toISOString(),
      message: "Request for partnership in distributing African coffee beans in South American markets."
    },
    {
      id: "req-5",
      name: "Liu Wei",
      company: "Asian Market Solutions",
      avatar: "",
      country: "China",
      productName: "Premium Cashew Nuts",
      type: "incoming",
      status: "pending",
      date: new Date(2023, 4, 12).toISOString(),
      message: "Interested in establishing a regular supply of premium cashew nuts. Looking for 10 tons per month with organic certification."
    }
  ]);

  // Define contact interface
  interface TradeContact {
    id: number;
    name: string;
    company: string;
    country: string;
    avatar: string;
    status: string;
    tradeRole: string;
    isFavorite?: boolean;
    lastActivity?: string;
    products?: string[];
  }
  
  // Apply filters to contacts
  const applyContactFilters = (contacts: TradeContact[]): TradeContact[] => {
    let filtered = contacts;
    
    // Apply search filter
    filtered = filtered.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Apply role/status filters
    if (activeFilter === "online") {
      filtered = filtered.filter(contact => contact.status === "online");
    } else if (activeFilter === "importers") {
      filtered = filtered.filter(contact => contact.tradeRole === "importer");
    } else if (activeFilter === "exporters") {
      filtered = filtered.filter(contact => contact.tradeRole === "exporter");
    } else if (activeFilter === "frequent") {
      filtered = filtered.filter(contact => contact.isFavorite);
    } else if (activeFilter === "recents") {
      // Sort by last activity and take the top 10
      filtered = [...filtered].sort((a, b) => {
        if (!a.lastActivity || !b.lastActivity) return 0;
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      }).slice(0, 10);
    }
    
    return filtered;
  };

  // Filter chat sessions based on search query
  const filteredChatSessions = chatSessions.filter(session =>
    session.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter contacts with applied filters
  const filteredContacts = applyContactFilters(tradeContacts);

  // Get active chat session
  const activeChatSession = activeContactId ? 
    chatSessions.find(session => session.contact.id === activeContactId) : null;
  
  // Apply filters to requests
  const applyRequestFilters = (requests: TradeRequest[]): TradeRequest[] => {
    // First apply search filter
    let filtered = requests.filter(request =>
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Apply request type and status filters
    if (requestFilter === "incoming") {
      filtered = filtered.filter(request => request.type === "incoming");
    } else if (requestFilter === "outgoing") {
      filtered = filtered.filter(request => request.type === "outgoing");
    } else if (requestFilter === "pending") {
      filtered = filtered.filter(request => request.status === "pending");
    } else if (requestFilter === "accepted") {
      filtered = filtered.filter(request => request.status === "accepted");
    } else if (requestFilter === "declined") {
      filtered = filtered.filter(request => request.status === "declined");
    }
    
    // Sort by date (newest first)
    filtered = [...filtered].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return filtered;
  };
  
  // We'll keep this for backward compatibility
  const filteredRequests = tradeRequests.filter(request =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContactId) return;

    // Stop any typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    setIsTyping(false);

    const updatedSessions = chatSessions.map(session => {
      if (session.contact.id === activeContactId) {
        return {
          ...session,
          messages: [
            ...session.messages,
            {
              id: `m-${Date.now()}`,
              content: newMessage,
              senderId: "user",
              timestamp: new Date().toISOString(),
              isRead: false
            }
          ]
        };
      }
      return session;
    });

    setChatSessions(updatedSessions);
    setNewMessage("");
    
    // Simulate a response after a few seconds (for demo purposes)
    setTimeout(() => {
      simulateResponse(activeContactId);
    }, 3000);
  };
  
  // Simulate typing indicator
  const handleMessageTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout to clear typing indicator
    const newTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
    
    setTypingTimeout(newTimeout);
  };
  
  // Simulate a response from the contact
  const simulateResponse = (contactId: number) => {
    // First show typing indicator
    setIsTyping(true);
    
    // Then after a delay, add a message
    setTimeout(() => {
      setIsTyping(false);
      
      const contact = tradeContacts.find(contact => contact.id === contactId);
      if (!contact) return;
      
      const responseMessages = [
        "I understand. Let me check our inventory and get back to you with more details.",
        "That sounds interesting! Can you provide more information about your requirements?",
        "Thank you for sharing that. I'll discuss with my team and follow up soon.",
        "Excellent! When would be a good time to schedule a call to discuss this further?"
      ];
      
      const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)];
      
      const updatedSessions = chatSessions.map(session => {
        if (session.contact.id === contactId) {
          return {
            ...session,
            messages: [
              ...session.messages,
              {
                id: `m-${Date.now()}`,
                content: randomResponse,
                senderId: `contact-${contactId}`,
                timestamp: new Date().toISOString(),
                isRead: true
              }
            ],
            unreadCount: activeContactId === contactId ? 0 : (session.unreadCount + 1)
          };
        }
        return session;
      });
      
      setChatSessions(updatedSessions);
    }, 2000);
  };

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChatSession?.messages]);

  // Mark messages as read when changing active contact
  useEffect(() => {
    if (activeContactId) {
      const updatedSessions = chatSessions.map(session => {
        if (session.contact.id === activeContactId) {
          const updatedMessages = session.messages.map(msg => ({
            ...msg,
            isRead: true
          }));
          
          return {
            ...session,
            messages: updatedMessages,
            unreadCount: 0
          };
        }
        return session;
      });
      
      setChatSessions(updatedSessions);
    }
  }, [activeContactId]);

  // Handle trade request action (accept/decline)
  const handleTradeRequestAction = (requestId: string, action: 'accept' | 'decline') => {
    const updatedRequests = tradeRequests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: action === 'accept' ? 'accepted' as const : 'declined' as const
        };
      }
      return request;
    });
    
    setTradeRequests(updatedRequests as TradeRequest[]);
  };

  // Get status indicator color
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-amber-500";
      default:
        return "bg-neutral-300";
    }
  };

  // Get request status color
  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "declined":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-destructive/10 text-destructive border border-destructive/20";
    }
  };

  return (
    <section className="mb-16 fade-in">
      <AdBanner type="horizontal" position="top" className="mb-6" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-1">Trade Management</h2>
          <p className="text-neutral-600">Connect, chat, and manage your trade partnerships</p>
        </div>
        
        <div className="flex mt-4 md:mt-0 gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span className="material-icons text-sm">add_circle</span>
                Create New
                <span className="material-icons text-sm">expand_more</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <span className="material-icons text-sm text-primary">chat</span>
                <span>Start Trade Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <span className="material-icons text-sm text-primary">person_add</span>
                <span>Add Trade Contact</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <span className="material-icons text-sm text-primary">description</span>
                <span>Send Trade Request</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <span className="material-icons text-sm text-primary">payments</span>
                <span>Initialize Escrow</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="material-icons">more_vert</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <span className="material-icons text-sm">settings</span>
                <span>Trade Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <span className="material-icons text-sm">cloud_download</span>
                <span>Export Contacts</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <span className="material-icons text-sm">content_copy</span>
                <span>Import Contacts</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <span className="material-icons text-sm">help_outline</span>
                <span>Help & Guidelines</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <span className="material-icons text-sm">chat</span>
            Trade Chat
            {chatSessions.reduce((count, session) => count + session.unreadCount, 0) > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0">
                {chatSessions.reduce((count, session) => count + session.unreadCount, 0)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <span className="material-icons text-sm">people</span>
            Connections
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <span className="material-icons text-sm">person_add</span>
            Requests
            {tradeRequests.filter(r => r.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0">
                {tradeRequests.filter(r => r.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Trade Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6 h-[600px]">
            {/* Chat Contacts List */}
            <Card className="md:col-span-1">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="relative mt-2">
                  <Input 
                    placeholder="Search contacts..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                    search
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-auto" style={{ maxHeight: "500px" }}>
                <div className="divide-y">
                  {chatSessions.map(session => (
                    <div 
                      key={session.id}
                      onClick={() => setActiveContactId(session.contact.id)}
                      className={`p-3 cursor-pointer hover:bg-neutral-50 transition-colors ${
                        activeContactId === session.contact.id ? "bg-primary-50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={session.contact.avatar} alt={session.contact.name} />
                            <AvatarFallback>{session.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span 
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${getStatusIndicator(session.contact.status)}`} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-sm truncate">{session.contact.name}</h3>
                            <span className="text-xs text-neutral-500">
                              {session.messages.length > 0 
                                ? new Date(session.messages[session.messages.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : ""}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 truncate">
                            {session.messages.length > 0 
                              ? session.messages[session.messages.length - 1].content
                              : "No messages yet"}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-neutral-400">{session.contact.company}</span>
                            {session.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0">
                                {session.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {chatSessions.length === 0 && (
                    <div className="p-6 text-center">
                      <span className="material-icons text-4xl text-neutral-300 mb-2">chat</span>
                      <p className="text-neutral-500">No conversations yet</p>
                      <p className="text-sm text-neutral-400 mt-1">Connect with trade partners to start chatting</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Chat Messages */}
            <Card className="md:col-span-2">
              {activeChatSession ? (
                <>
                  <CardHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={activeChatSession.contact.avatar} alt={activeChatSession.contact.name} />
                            <AvatarFallback>{activeChatSession.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span 
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${getStatusIndicator(activeChatSession.contact.status)}`} 
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{activeChatSession.contact.name}</h3>
                          <p className="text-xs text-neutral-500">{activeChatSession.contact.company} • {activeChatSession.contact.country}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <span className="material-icons">phone</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <span className="material-icons">videocam</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <span className="material-icons">more_vert</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col h-[464px]">
                    <div className="flex-1 overflow-auto p-4">
                      <div className="space-y-4">
                        {activeChatSession.messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex flex-col ${message.senderId === "user" ? "items-end" : "items-start"}`}
                          >
                            <div className={`max-w-[80%] relative group ${message.senderId === "user" 
                              ? "bg-primary-500 text-white rounded-2xl rounded-tr-sm" 
                              : "bg-neutral-100 text-neutral-800 rounded-2xl rounded-tl-sm"
                            } p-3`}>
                              <p className="text-sm">{message.content}</p>
                              <div className={`text-xs mt-1 flex justify-end ${message.senderId === "user" ? "text-primary-100" : "text-neutral-500"}`}>
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {message.senderId === "user" && message.isRead && (
                                  <span className="material-icons text-xs ml-1">done_all</span>
                                )}
                              </div>
                              
                              {/* Translation button - only show for messages from others */}
                              {message.senderId !== "user" && (
                                <button 
                                  onClick={() => setActiveTranslation(activeTranslation === message.id ? null : message.id)}
                                  className={`absolute -top-3 -right-3 bg-white shadow-md text-primary rounded-full h-6 w-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
                                    activeTranslation === message.id ? "opacity-100 text-primary" : "text-neutral-400 hover:text-primary"
                                  }`}
                                >
                                  <span className="material-icons text-xs">translate</span>
                                </button>
                              )}
                            </div>
                            
                            {/* Show translator if this message is being translated */}
                            {activeTranslation === message.id && (
                              <div className="mt-2 mb-3 max-w-[90%]">
                                <ChatTranslator 
                                  originalMessage={message.content}
                                  onClose={() => setActiveTranslation(null)}
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                        
                        {/* Typing indicator */}
                        {isTyping && activeContactId && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start"
                          >
                            <div className="max-w-[80%] bg-neutral-100 text-neutral-800 rounded-2xl rounded-tl-sm p-3">
                              <div className="flex space-x-1 items-center">
                                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    <div className="p-3 border-t">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <span className="material-icons">attach_file</span>
                        </Button>
                        <Input 
                          placeholder="Type a message..." 
                          value={newMessage}
                          onChange={handleMessageTyping}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button variant="default" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                          <span className="material-icons">send</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-full p-6 text-center">
                  <div>
                    <span className="material-icons text-6xl text-neutral-300 mb-4">chat_bubble_outline</span>
                    <h3 className="font-medium text-lg text-neutral-700 mb-2">Select a conversation</h3>
                    <p className="text-neutral-500 max-w-sm">
                      Choose a contact from the left panel to start chatting or continue an existing conversation.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
        
        {/* Trade Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <Input 
                placeholder="Search connections..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                search
              </span>
            </div>
            <Button className="flex items-center gap-2 ml-4">
              <span className="material-icons">person_add</span>
              Add New Contact
            </Button>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Contact Filters */}
              <Card className="col-span-full">
                <CardContent className="p-4 flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button 
                    variant={activeFilter === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter("all")}
                    className="rounded-full"
                  >
                    All Contacts
                  </Button>
                  <Button 
                    variant={activeFilter === "online" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter("online")}
                    className="rounded-full"
                  >
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </Button>
                  <Button 
                    variant={activeFilter === "frequent" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter("frequent")}
                    className="rounded-full"
                  >
                    <span className="material-icons text-sm mr-1">star</span>
                    Frequent
                  </Button>
                  <Button 
                    variant={activeFilter === "importers" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter("importers")}
                    className="rounded-full"
                  >
                    <span className="material-icons text-sm mr-1">shopping_cart</span>
                    Importers
                  </Button>
                  <Button 
                    variant={activeFilter === "exporters" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter("exporters")}
                    className="rounded-full"
                  >
                    <span className="material-icons text-sm mr-1">local_shipping</span>
                    Exporters
                  </Button>
                  <Button 
                    variant={activeFilter === "recents" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter("recents")}
                    className="rounded-full"
                  >
                    <span className="material-icons text-sm mr-1">history</span>
                    Recent
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map(contact => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                              <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span 
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusIndicator(contact.status)}`} 
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-1">
                              <h3 className="font-medium">{contact.name}</h3>
                              {contact.isFavorite && (
                                <span className="material-icons text-amber-400 text-sm">star</span>
                              )}
                            </div>
                            <p className="text-sm text-neutral-500">{contact.company}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs flex items-center text-neutral-500">
                                <span className="material-icons text-xs mr-1">public</span>
                                {contact.country}
                              </span>
                              <span className="mx-2 text-neutral-300">•</span>
                              <span className="text-xs text-neutral-500">
                                {contact.status === "online" 
                                  ? "Online now" 
                                  : contact.status === "away"
                                    ? "Away"
                                    : "Offline"
                                }
                              </span>
                            </div>
                            {contact.tradeRole && (
                              <Badge className="mt-2" variant="outline">
                                {contact.tradeRole === "importer" ? "Importer" : "Exporter"}
                              </Badge>
                            )}
                            {contact.products && contact.products.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {contact.products.map((product, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {product}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="material-icons">more_vert</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => {
                                const updatedContacts = tradeContacts.map(c => {
                                  if (c.id === contact.id) {
                                    return { ...c, isFavorite: !c.isFavorite };
                                  }
                                  return c;
                                });
                                setTradeContacts(updatedContacts);
                              }}
                            >
                              <span className="material-icons text-sm">
                                {contact.isFavorite ? "star" : "star_outline"}
                              </span>
                              <span>{contact.isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                              <span className="material-icons text-sm">inventory</span>
                              <span>View Products</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                              <span className="material-icons text-sm">person_remove</span>
                              <span>Remove Contact</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-6">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => {
                            // Find if there's already a chat session with this contact
                            const existingSession = chatSessions.find(
                              session => session.contact.id === contact.id
                            );
                            
                            if (!existingSession) {
                              // Create a new chat session
                              setChatSessions([
                                ...chatSessions,
                                {
                                  id: `chat-${Date.now()}`,
                                  contact,
                                  messages: [],
                                  unreadCount: 0
                                }
                              ]);
                            }
                            
                            // Activate the chat tab and select this contact
                            setActiveTab("chat");
                            setActiveContactId(contact.id);
                          }}
                        >
                          <span className="material-icons text-sm">chat</span>
                          Message
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <span className="material-icons text-sm">description</span>
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {filteredContacts.length === 0 && (
                <div className="col-span-full p-10 text-center border rounded-lg bg-neutral-50">
                  <span className="material-icons text-5xl text-neutral-300 mb-3">people</span>
                  <h3 className="font-medium text-lg mb-2">No contacts found</h3>
                  <p className="text-neutral-500 mb-4">
                    {searchQuery 
                      ? `No results found for "${searchQuery}"`
                      : "You don't have any trade contacts yet"}
                  </p>
                  <Button className="flex items-center gap-2 mx-auto">
                    <span className="material-icons">person_add</span>
                    Add New Contact
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Trade Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="relative w-full max-w-md">
              <Input 
                placeholder="Search requests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                search
              </span>
            </div>
            <div className="flex gap-3">
              <Button className="flex items-center gap-2">
                <span className="material-icons">add</span>
                Create Request
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <span className="material-icons text-sm">filter_list</span>
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setRequestFilter("all")}
                  >
                    <span className="material-icons text-sm">all_inbox</span>
                    <span>All Requests</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setRequestFilter("incoming")}
                  >
                    <span className="material-icons text-sm">inbox</span>
                    <span>Incoming Requests</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setRequestFilter("outgoing")}
                  >
                    <span className="material-icons text-sm">outbox</span>
                    <span>Outgoing Requests</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setRequestFilter("pending")}
                  >
                    <span className="material-icons text-sm">pending</span>
                    <span>Pending</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setRequestFilter("accepted")}
                  >
                    <span className="material-icons text-sm">check_circle</span>
                    <span>Accepted</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setRequestFilter("declined")}
                  >
                    <span className="material-icons text-sm">cancel</span>
                    <span>Declined</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Active filter indicator */}
            {requestFilter !== "all" && (
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <span>Filtered by: </span>
                <Badge variant="outline" className="capitalize font-normal">
                  {requestFilter}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={() => setRequestFilter("all")}
                >
                  Clear filter
                </Button>
              </div>
            )}
            
            {applyRequestFilters(tradeRequests).map(request => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.avatar} alt={request.name} />
                          <AvatarFallback>{request.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={request.type === "incoming" ? "secondary" : "outline"} className="font-normal px-2 py-0 h-5">
                              {request.type === "incoming" ? "Incoming" : "Outgoing"}
                            </Badge>
                            <Badge className={`font-normal px-2 py-0 h-5 ${getRequestStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          <h3 className="font-medium">{request.name}</h3>
                          <p className="text-sm text-neutral-500">{request.company}</p>
                          {request.productName && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Product:</span> {request.productName}
                            </p>
                          )}
                          <div className="text-sm text-neutral-700 mt-2 bg-neutral-50 p-3 rounded-md relative group">
                            <p>{request.message}</p>
                            {request.type === "incoming" && (
                              <button 
                                onClick={() => setActiveTranslation(activeTranslation === request.id ? null : request.id)}
                                className="absolute top-2 right-2 bg-white shadow-sm text-primary rounded-full h-6 w-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-50"
                              >
                                <span className="material-icons text-xs">translate</span>
                              </button>
                            )}
                            
                            {activeTranslation === request.id && (
                              <div className="mt-3 pt-3 border-t border-neutral-200">
                                <ChatTranslator 
                                  originalMessage={request.message}
                                  onClose={() => setActiveTranslation(null)}
                                />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-2">
                            {new Date(request.date).toLocaleDateString()} • {new Date(request.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      {request.type === "incoming" && request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                            onClick={() => handleTradeRequestAction(request.id, "decline")}
                          >
                            <span className="material-icons text-sm">close</span>
                            Decline
                          </Button>
                          <Button 
                            variant="default" 
                            className="flex items-center gap-1"
                            onClick={() => handleTradeRequestAction(request.id, "accept")}
                          >
                            <span className="material-icons text-sm">check</span>
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {applyRequestFilters(tradeRequests).length === 0 && (
              <div className="p-10 text-center border rounded-lg bg-neutral-50">
                <span className="material-icons text-5xl text-neutral-300 mb-3">inbox</span>
                <h3 className="font-medium text-lg mb-2">No requests found</h3>
                <p className="text-neutral-500 mb-4">
                  {searchQuery 
                    ? `No results found for "${searchQuery}"`
                    : requestFilter !== "all"
                      ? `No ${requestFilter} requests found`
                      : "You don't have any trade requests at the moment"}
                </p>
                <Button className="flex items-center gap-2 mx-auto">
                  <span className="material-icons">add</span>
                  Create New Request
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Partner section */}
      <div className="mt-10">
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary-50 border-b border-primary-100 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="material-icons text-primary">handshake</span>
              Official Trade Partners
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <PartnersSection compact={true} />
          </CardContent>
        </Card>
      </div>
      
      {/* Ad banner at bottom */}
      <div className="mt-8">
        <AdBanner type="horizontal" position="bottom" />
      </div>
    </section>
  );
}