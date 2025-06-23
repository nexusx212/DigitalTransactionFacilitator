import React, { useState, useRef, useEffect } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  role: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
}

interface Chat {
  id: string;
  name: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  type: 'direct' | 'group' | 'trade';
  tradeId?: string;
}

export default function Chat() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for chats
  const [chats] = useState<Chat[]>([
    {
      id: "chat-1",
      name: "Ghana Cocoa Exports Ltd",
      participants: [
        { id: "user-1", name: "Kwame Asante", avatar: "", isOnline: true, role: "Exporter" },
        { id: "user-2", name: "Sarah Johnson", avatar: "", isOnline: false, lastSeen: "2 hours ago", role: "Buyer" }
      ],
      lastMessage: {
        id: "msg-1",
        senderId: "user-1",
        content: "The shipment is ready for inspection. When can we schedule?",
        timestamp: "2024-01-20T14:30:00Z",
        type: "text"
      },
      unreadCount: 2,
      type: "trade",
      tradeId: "TRD-2024-001"
    },
    {
      id: "chat-2", 
      name: "Ethiopian Coffee Cooperative",
      participants: [
        { id: "user-3", name: "Meron Tadesse", avatar: "", isOnline: true, role: "Supplier" },
        { id: "user-4", name: "Alex Chen", avatar: "", isOnline: true, role: "Logistics" }
      ],
      lastMessage: {
        id: "msg-2",
        senderId: "user-3", 
        content: "Payment has been confirmed. Preparing for shipment.",
        timestamp: "2024-01-20T12:15:00Z",
        type: "text"
      },
      unreadCount: 0,
      type: "trade",
      tradeId: "TRD-2024-002"
    },
    {
      id: "chat-3",
      name: "Finance Team",
      participants: [
        { id: "user-5", name: "Dr. Amara Okafor", avatar: "", isOnline: false, lastSeen: "1 hour ago", role: "Finance Manager" },
        { id: "user-6", name: "James Wright", avatar: "", isOnline: true, role: "Credit Analyst" }
      ],
      lastMessage: {
        id: "msg-3",
        senderId: "user-5",
        content: "Trade finance application approved for $50K",
        timestamp: "2024-01-20T10:45:00Z", 
        type: "text"
      },
      unreadCount: 1,
      type: "group"
    }
  ]);

  // Mock messages for selected chat
  const [messages] = useState<Record<string, ChatMessage[]>>({
    "chat-1": [
      {
        id: "msg-1-1",
        senderId: "user-1",
        content: "Hello! I'm reaching out regarding the cocoa beans order TRD-2024-001.",
        timestamp: "2024-01-20T09:00:00Z",
        type: "text"
      },
      {
        id: "msg-1-2", 
        senderId: "demo-user-1",
        content: "Hi Kwame! Yes, I've been expecting your message. How's the preparation going?",
        timestamp: "2024-01-20T09:15:00Z",
        type: "text"
      },
      {
        id: "msg-1-3",
        senderId: "user-1",
        content: "Everything is on track. The beans have been processed and packaged. Quality certificates are ready.",
        timestamp: "2024-01-20T10:30:00Z",
        type: "text"
      },
      {
        id: "msg-1-4",
        senderId: "user-1", 
        content: "quality-certificate.pdf",
        timestamp: "2024-01-20T10:31:00Z",
        type: "file",
        fileUrl: "#",
        fileName: "quality-certificate.pdf"
      },
      {
        id: "msg-1-5",
        senderId: "demo-user-1",
        content: "Perfect! I'll review the certificate. When can we schedule the pre-shipment inspection?",
        timestamp: "2024-01-20T11:00:00Z",
        type: "text"
      },
      {
        id: "msg-1-6",
        senderId: "user-1",
        content: "The shipment is ready for inspection. When can we schedule?",
        timestamp: "2024-01-20T14:30:00Z",
        type: "text"
      }
    ]
  });

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 flex">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-3 rounded-lg cursor-pointer mb-2 transition-all duration-200 ${
                  selectedChat === chat.id 
                    ? "bg-blue-100 border-2 border-blue-300" 
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.participants[0]?.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {chat.participants[0]?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.participants[0]?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-blue-600 text-white ml-2">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    {chat.type === 'trade' && chat.tradeId && (
                      <Badge variant="outline" className="text-xs mt-1 mb-1">
                        {chat.tradeId}
                      </Badge>
                    )}
                    
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage?.content || "No messages yet"}
                    </p>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                      </span>
                      <div className="flex gap-1">
                        {chat.participants.slice(0, 3).map((participant, idx) => (
                          <div key={idx} className="text-xs text-gray-500">
                            {participant.role}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChatData.participants[0]?.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {selectedChatData.participants[0]?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-gray-800">{selectedChatData.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedChatData.participants[0]?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      {selectedChatData.participants[0]?.isOnline ? 'Online' : selectedChatData.participants[0]?.lastSeen}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedChatData.type === 'trade' && selectedChatData.tradeId && (
                    <Badge variant="outline">Trade: {selectedChatData.tradeId}</Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <span className="material-icons text-[16px] mr-1">videocam</span>
                    Video Call
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              <div className="space-y-4">
                {chatMessages.map((message, idx) => {
                  const isOwnMessage = message.senderId === user?.firebaseUid;
                  const showDate = idx === 0 || formatDate(message.timestamp) !== formatDate(chatMessages[idx - 1].timestamp);
                  
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center py-2">
                          <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          <div className={`p-3 rounded-lg ${
                            isOwnMessage 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}>
                            {message.type === 'file' && (
                              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded mb-2">
                                <span className="material-icons text-gray-600">description</span>
                                <span className="text-sm">{message.fileName}</span>
                              </div>
                            )}
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <span className="material-icons text-[16px]">attach_file</span>
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <span className="material-icons text-[16px]">send</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-gray-400 text-[48px]">chat</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}