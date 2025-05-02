import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

// Mock data types
type TradeContact = {
  id: string;
  name: string;
  company: string;
  avatar: string;
  status: "online" | "offline" | "away";
  country: string;
  lastActive: Date;
};

type TradeRequest = {
  id: string;
  type: "incoming" | "outgoing";
  name: string;
  company: string;
  avatar: string;
  productName?: string;
  message: string;
  date: Date;
  status: "pending" | "accepted" | "declined";
};

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
};

type ChatSession = {
  id: string;
  contact: TradeContact;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage?: ChatMessage;
};

export default function TradeManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data for initial states
  const [contacts, setContacts] = useState<TradeContact[]>([
    {
      id: "contact-1",
      name: "John Doe",
      company: "Global Exports Ltd.",
      avatar: "",
      status: "online",
      country: "United States",
      lastActive: new Date()
    },
    {
      id: "contact-2",
      name: "Linda Chen",
      company: "Asian Markets Inc.",
      avatar: "",
      status: "offline",
      country: "Singapore",
      lastActive: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: "contact-3",
      name: "Mohammed Al-Fayed",
      company: "Gulf Trade Partners",
      avatar: "",
      status: "away",
      country: "United Arab Emirates",
      lastActive: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ]);
  
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([
    {
      id: "request-1",
      type: "incoming",
      name: "James Wilson",
      company: "EuroTrade GmbH",
      avatar: "",
      productName: "Organic Cocoa Beans",
      message: "Interested in purchasing your latest batch of organic cocoa beans. Can we discuss pricing and shipping terms?",
      date: new Date(Date.now() - 172800000), // 2 days ago
      status: "pending"
    },
    {
      id: "request-2",
      type: "outgoing",
      name: "Fatima Nkosi",
      company: "African Agri Solutions",
      avatar: "",
      productName: "Solar Irrigation Systems",
      message: "Following up on our discussion about solar irrigation systems. We'd like to place an initial order for 10 units.",
      date: new Date(Date.now() - 604800000), // 1 week ago
      status: "accepted"
    },
    {
      id: "request-3",
      type: "incoming",
      name: "Carlos Rodriguez",
      company: "South American Exports",
      avatar: "",
      productName: "Coffee Beans",
      message: "We have premium coffee beans available. Would you be interested in a sample shipment?",
      date: new Date(Date.now() - 345600000), // 4 days ago
      status: "declined"
    }
  ]);
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "chat-1",
      contact: contacts[0],
      messages: [
        {
          id: "msg-1",
          senderId: "contact-1",
          senderName: "John Doe",
          content: "Hi there, I saw your listing for cotton fabrics. Do you ship to North America?",
          timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
          isRead: true
        },
        {
          id: "msg-2",
          senderId: "user",
          senderName: user?.username || "You",
          content: "Yes, we do ship to North America. We have partnerships with several logistics companies that specialize in textile shipping.",
          timestamp: new Date(Date.now() - 3600000 * 1.5), // 1.5 hours ago
          isRead: true
        },
        {
          id: "msg-3",
          senderId: "contact-1",
          senderName: "John Doe",
          content: "Great! What would be the lead time for an order of about 5,000 yards?",
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          isRead: false
        }
      ],
      unreadCount: 1
    },
    {
      id: "chat-2",
      contact: contacts[2],
      messages: [
        {
          id: "msg-4",
          senderId: "contact-3",
          senderName: "Mohammed Al-Fayed",
          content: "Hello, I'm interested in your agricultural machinery. Do you have any special models for desert conditions?",
          timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
          isRead: true
        },
        {
          id: "msg-5",
          senderId: "user",
          senderName: user?.username || "You",
          content: "Hello Mohammed, yes we do. Our D-Series tractors are specially designed for arid conditions with enhanced cooling systems and sand filters.",
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          isRead: true
        }
      ],
      unreadCount: 0
    }
  ]);

  // Find active chat session
  const activeChatSession = chatSessions.find(
    session => session.contact.id === activeContactId
  );

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContactId) return;

    const updatedSessions = chatSessions.map(session => {
      if (session.contact.id === activeContactId) {
        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: "user",
          senderName: user?.username || "You",
          content: newMessage,
          timestamp: new Date(),
          isRead: true
        };
        
        return {
          ...session,
          messages: [...session.messages, newMsg],
          lastMessage: newMsg
        };
      }
      return session;
    });
    
    setChatSessions(updatedSessions);
    setNewMessage("");
    
    // Simulate receiving a response after 2 seconds
    setTimeout(() => {
      const replies = [
        "Thank you for the information. Let me discuss this with my team.",
        "That sounds good. When can we schedule a call to discuss further?",
        "I appreciate your prompt response. This is exactly what we need.",
        "Perfect! I'll get back to you with our purchase order soon."
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const updatedSessionsWithReply = chatSessions.map(session => {
        if (session.contact.id === activeContactId) {
          const replyMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: activeContactId,
            senderName: session.contact.name,
            content: randomReply,
            timestamp: new Date(),
            isRead: true
          };
          
          return {
            ...session,
            messages: [...session.messages, replyMsg],
            lastMessage: replyMsg
          };
        }
        return session;
      });
      
      setChatSessions(updatedSessionsWithReply);
    }, 2000);
  };

  // Handle accepting/declining trade requests
  const handleTradeRequestAction = (requestId: string, action: "accept" | "decline") => {
    const updatedRequests = tradeRequests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: action === "accept" ? "accepted" : "declined"
        };
      }
      return request;
    });
    
    setTradeRequests(updatedRequests);
    
    toast({
      title: `Request ${action === "accept" ? "Accepted" : "Declined"}`,
      description: `You have ${action === "accept" ? "accepted" : "declined"} the trade request.`,
      variant: action === "accept" ? "default" : "destructive",
    });
  };

  // Scroll to bottom of messages when active chat changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChatSession, chatSessions]);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter requests based on filter and search
  const filteredRequests = tradeRequests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      request.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "incoming") return request.type === "incoming" && matchesSearch;
    if (filter === "outgoing") return request.type === "outgoing" && matchesSearch;
    if (filter === "pending") return request.status === "pending" && matchesSearch;
    
    return matchesSearch;
  });
  
  // Status indicators for contacts
  const getStatusIndicator = (status: "online" | "offline" | "away") => {
    switch (status) {
      case "online":
        return "bg-success";
      case "away":
        return "bg-warning";
      case "offline":
        return "bg-neutral-400";
    }
  };

  // Get a color for the request status badge
  const getRequestStatusColor = (status: "pending" | "accepted" | "declined") => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border border-warning/20";
      case "accepted":
        return "bg-success/10 text-success border border-success/20";
      case "declined":
        return "bg-destructive/10 text-destructive border border-destructive/20";
    }
  };

  return (
    <section className="mb-16 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-1">Trade Management</h2>
          <p className="text-neutral-600">Connect, chat, and manage your trade partnerships</p>
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
                            className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[80%] ${message.senderId === "user" 
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
                            </div>
                          </motion.div>
                        ))}
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
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button variant="primary" onClick={handleSendMessage} disabled={!newMessage.trim()}>
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
                          <h3 className="font-medium">{contact.name}</h3>
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
                                  : `Last active ${new Date(contact.lastActive).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <span className="material-icons">more_vert</span>
                      </Button>
                    </div>
                    
                    <div className="flex justify-between mt-6">
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
                      <Button variant="outline" className="flex items-center gap-1">
                        <span className="material-icons text-sm">business</span>
                        View Profile
                      </Button>
                      <Button variant="outline" className="flex items-center gap-1">
                        <span className="material-icons text-sm">shopping_cart</span>
                        Products
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
                    : "You don't have any trade connections yet"}
                </p>
                <Button className="flex items-center gap-2 mx-auto">
                  <span className="material-icons">person_add</span>
                  Add New Contact
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Trade Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:max-w-md">
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
            <div className="flex gap-2 w-full sm:w-auto">
              <Select 
                value={filter} 
                onValueChange={setFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Requests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button className="flex items-center gap-2">
                <span className="material-icons">add</span>
                New Request
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredRequests.map(request => (
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
                          <p className="text-sm text-neutral-700 mt-2 bg-neutral-50 p-3 rounded-md">
                            {request.message}
                          </p>
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
            
            {filteredRequests.length === 0 && (
              <div className="p-10 text-center border rounded-lg bg-neutral-50">
                <span className="material-icons text-5xl text-neutral-300 mb-3">inbox</span>
                <h3 className="font-medium text-lg mb-2">No requests found</h3>
                <p className="text-neutral-500 mb-4">
                  {searchQuery 
                    ? `No results found for "${searchQuery}"`
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
    </section>
  );
}