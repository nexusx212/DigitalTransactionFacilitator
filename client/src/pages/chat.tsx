import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  PaperclipIcon, 
  Smile, 
  User, 
  MessageSquare,
  Shield,
  Star,
  Clock,
  CheckCheck,
  Check,
  Plus,
  Users,
  Settings,
  Archive,
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ChatUser {
  id: number;
  name: string;
  username: string;
  photoUrl?: string;
  isOnline: boolean;
  lastSeen?: Date;
  isVerified: boolean;
  rating: number;
  tradeCount: number;
}

interface ChatMessage {
  id: number;
  senderId: number;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isDelivered: boolean;
  messageType: 'text' | 'image' | 'file' | 'trade-proposal';
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];
}

interface Chat {
  id: number;
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  chatType: 'direct' | 'group';
  tradeId?: number;
  tradeName?: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Sample chat data - in real app this would come from API
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Sample users for demonstration
  const sampleUsers: ChatUser[] = [
    {
      id: 2,
      name: "Amara Okafor",
      username: "amara_exports",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      isVerified: true,
      rating: 4.8,
      tradeCount: 23
    },
    {
      id: 3,
      name: "Ibrahim Diallo",
      username: "ibrahim_textiles",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isVerified: true,
      rating: 4.9,
      tradeCount: 45
    },
    {
      id: 4,
      name: "Grace Mwangi",
      username: "grace_agro",
      isOnline: true,
      isVerified: false,
      rating: 4.5,
      tradeCount: 12
    }
  ];

  useEffect(() => {
    // Initialize sample chats
    const sampleChats: Chat[] = [
      {
        id: 1,
        participants: [sampleUsers[0]],
        lastMessage: {
          id: 1,
          senderId: 2,
          content: "Hi! I'm interested in your coffee beans. Can we discuss the pricing for a bulk order?",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          isRead: false,
          isDelivered: true,
          messageType: 'text'
        },
        unreadCount: 2,
        isPinned: false,
        isArchived: false,
        chatType: 'direct',
        tradeId: 101,
        tradeName: "Premium Coffee Beans Export"
      },
      {
        id: 2,
        participants: [sampleUsers[1]],
        lastMessage: {
          id: 2,
          senderId: 3,
          content: "The textile samples look great! When can we schedule the shipment?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true,
          isDelivered: true,
          messageType: 'text'
        },
        unreadCount: 0,
        isPinned: true,
        isArchived: false,
        chatType: 'direct',
        tradeId: 102,
        tradeName: "Handwoven Textiles Trade"
      },
      {
        id: 3,
        participants: [sampleUsers[2]],
        lastMessage: {
          id: 3,
          senderId: 4,
          content: "Thank you for the quick response. I'll prepare the documents.",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isRead: true,
          isDelivered: true,
          messageType: 'text'
        },
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        chatType: 'direct'
      }
    ];
    setChats(sampleChats);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Load messages for selected chat
      const sampleMessages: ChatMessage[] = [
        {
          id: 1,
          senderId: selectedChat.participants[0].id,
          content: "Hello! I saw your product listing and I'm very interested.",
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          isRead: true,
          isDelivered: true,
          messageType: 'text'
        },
        {
          id: 2,
          senderId: user?.id || 1,
          content: "Hi there! Thanks for reaching out. Which product were you interested in?",
          timestamp: new Date(Date.now() - 55 * 60 * 1000),
          isRead: true,
          isDelivered: true,
          messageType: 'text'
        },
        {
          id: 3,
          senderId: selectedChat.participants[0].id,
          content: selectedChat.lastMessage?.content || "I'm interested in discussing a bulk order.",
          timestamp: selectedChat.lastMessage?.timestamp || new Date(),
          isRead: false,
          isDelivered: true,
          messageType: 'text'
        }
      ];
      setMessages(sampleMessages);
    }
  }, [selectedChat, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat || !user) return;

    setIsSending(true);
    
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      senderId: user.id,
      content: message.trim(),
      timestamp: new Date(),
      isRead: false,
      isDelivered: false,
      messageType: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate message sending
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, isDelivered: true } 
            : msg
        )
      );
      setIsSending(false);
    }, 1000);

    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatMessageTime = (timestamp: Date) => {
    return format(timestamp, 'HH:mm');
  };

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return format(lastSeen, 'MMM d');
  };

  const filteredChats = chats.filter(chat =>
    chat.participants.some(participant =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be authenticated to access chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-background">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.length > 0 ? filteredChats.map((chat) => {
              const participant = chat.participants[0];
              return (
                <div
                  key={chat.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={participant.photoUrl} alt={participant.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(participant.name)}
                      </AvatarFallback>
                    </Avatar>
                    {participant.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-medium text-sm truncate">{participant.name}</h3>
                        {participant.isVerified && (
                          <Shield className="h-3 w-3 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      {chat.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatLastSeen(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge variant="default" className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    {chat.tradeName && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          Trade: {chat.tradeName}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedChat.participants[0].photoUrl} alt={selectedChat.participants[0].name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(selectedChat.participants[0].name)}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChat.participants[0].isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-semibold">{selectedChat.participants[0].name}</h2>
                      {selectedChat.participants[0].isVerified && (
                        <Shield className="h-4 w-4 text-blue-500" />
                      )}
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-muted-foreground">{selectedChat.participants[0].rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.participants[0].isOnline ? (
                        <>
                          <span className="text-green-600">Online</span>
                          {isTyping && " • typing..."}
                        </>
                      ) : (
                        `Last seen ${formatLastSeen(selectedChat.participants[0].lastSeen || new Date())}`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isOwnMessage = msg.senderId === user.id;
                  const sender = isOwnMessage ? user : selectedChat.participants[0];
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex space-x-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isOwnMessage && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={sender.photoUrl} alt={sender.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                              {getInitials(sender.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <div className={`flex items-center justify-end space-x-1 mt-1 ${
                            isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            <span className="text-xs">{formatMessageTime(msg.timestamp)}</span>
                            {isOwnMessage && (
                              <div className="flex">
                                {msg.isDelivered ? (
                                  msg.isRead ? (
                                    <CheckCheck className="h-3 w-3" />
                                  ) : (
                                    <CheckCheck className="h-3 w-3" />
                                  )
                                ) : (
                                  <Clock className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex space-x-2 max-w-[70%]">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={selectedChat.participants[0].photoUrl} alt={selectedChat.participants[0].name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {getInitials(selectedChat.participants[0].name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="px-4 py-2 rounded-2xl bg-muted">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost">
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10"
                  />
                  <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isSending}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-muted-foreground">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}