import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RealTimeChat } from "@/components/real-time-chat";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { 
  MessageSquare, 
  Users, 
  Search, 
  Plus,
  Building2,
  Truck,
  CreditCard,
  Globe,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'trade';
  participants: Array<{
    id: string;
    name: string;
    role: 'exporter' | 'buyer' | 'logistics_provider' | 'financier' | 'agent' | 'admin';
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
    language: string;
  }>;
  lastMessage?: {
    content: string;
    sender: string;
    timestamp: Date;
    isRead: boolean;
  };
  unreadCount: number;
  tradeId?: string;
  isActive: boolean;
}

const roleIcons = {
  exporter: Building2,
  buyer: Users,
  logistics_provider: Truck,
  financier: CreditCard,
  agent: Globe,
  admin: Shield
};

const roleColors = {
  exporter: 'text-green-600',
  buyer: 'text-blue-600',
  logistics_provider: 'text-orange-600',
  financier: 'text-purple-600',
  agent: 'text-teal-600',
  admin: 'text-red-600'
};

export default function ChatPage() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Fetch real chat data from API
  const { data: chatRooms = [], isLoading: chatsLoading, error: chatsError } = useQuery({
    queryKey: ["/api/chats"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  const filteredChats = chatRooms.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedChatData = chatRooms.find(chat => chat.id === selectedChat);

  const getParticipantSummary = (participants: ChatRoom['participants']) => {
    const roles = participants.map(p => p.role);
    const uniqueRoles = [...Array.from(new Set(roles))];
    return uniqueRoles.map(role => role.replace('_', ' ')).join(', ');
  };

  const formatLastSeen = (lastSeen?: Date) => {
    if (!lastSeen) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Chat List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowNewChatModal(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="space-y-1">
                  {filteredChats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "p-4 cursor-pointer border-b transition-colors",
                        selectedChat === chat.id 
                          ? "bg-blue-50 border-l-4 border-l-blue-500" 
                          : "hover:bg-gray-50"
                      )}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 mb-2">
                            {chat.participants.slice(0, 3).map((participant) => {
                              const Icon = roleIcons[participant.role];
                              return (
                                <div key={participant.id} className="flex items-center gap-1">
                                  <Icon className={cn("h-3 w-3", roleColors[participant.role])} />
                                  <span className="text-xs text-gray-500">
                                    {participant.name.split(' ')[0]}
                                  </span>
                                </div>
                              );
                            })}
                            {chat.participants.length > 3 && (
                              <span className="text-xs text-gray-500">+{chat.participants.length - 3}</span>
                            )}
                          </div>
                          
                          {chat.lastMessage && (
                            <p className="text-xs text-gray-600 truncate">
                              <span className="font-medium">{chat.lastMessage.sender}:</span>{' '}
                              {chat.lastMessage.content}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          {chat.lastMessage && (
                            <span className="text-xs text-gray-400">
                              {chat.lastMessage.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              chat.participants.some(p => p.isOnline) ? "bg-green-400" : "bg-gray-300"
                            )} />
                            <Badge variant="outline" className="text-xs">
                              {chat.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {selectedChatData ? (
              <RealTimeChat
                chatId={selectedChatData.id}
                participants={selectedChatData.participants}
                className="h-full"
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Choose a chat from the sidebar to start messaging
                  </p>
                  <Button
                    onClick={() => setShowNewChatModal(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Conversation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Active Chats</p>
                  <p className="text-2xl font-bold text-blue-600">{chatRooms.filter(c => c.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Online Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {chatRooms.reduce((acc, chat) => 
                      acc + chat.participants.filter(p => p.isOnline).length, 0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Trade Chats</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {chatRooms.filter(c => c.type === 'trade').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Unread</p>
                  <p className="text-2xl font-bold text-red-600">
                    {chatRooms.reduce((acc, chat) => acc + chat.unreadCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}