import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Mic, 
  MicOff, 
  Globe, 
  Flag, 
  MoreVertical, 
  Phone, 
  Video,
  Paperclip,
  Smile,
  Volume2,
  VolumeX,
  Languages,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  originalContent?: string;
  translatedContent?: string;
  isTranslated?: boolean;
  timestamp: Date;
  type: 'text' | 'voice' | 'system';
  voiceUrl?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  isRead?: boolean;
  reactions?: Array<{
    emoji: string;
    userId: string;
    userName: string;
  }>;
}

interface ChatParticipant {
  id: string;
  name: string;
  role: 'exporter' | 'buyer' | 'logistics_provider' | 'financier' | 'agent' | 'admin';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  language: string;
}

interface RealTimeChatProps {
  chatId: string;
  participants: ChatParticipant[];
  onClose?: () => void;
  className?: string;
}

const roleColors = {
  exporter: 'bg-green-100 text-green-700',
  buyer: 'bg-blue-100 text-blue-700',
  logistics_provider: 'bg-orange-100 text-orange-700',
  financier: 'bg-purple-100 text-purple-700',
  agent: 'bg-teal-100 text-teal-700',
  admin: 'bg-red-100 text-red-700'
};

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zu', name: 'IsiZulu', flag: '🇿🇦' },
];

export function RealTimeChat({ chatId, participants, onClose, className }: RealTimeChatProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  
  // Translation state
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translatingMessages, setTranslatingMessages] = useState<Set<string>>(new Set());
  
  // UI state
  const [showParticipants, setShowParticipants] = useState(false);
  const [reportingMessage, setReportingMessage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: 'user2',
        senderName: 'Ahmed Hassan',
        senderRole: 'exporter',
        content: 'Hello! I have premium coffee beans available for export. Interested?',
        timestamp: new Date(Date.now() - 300000),
        type: 'text',
        isRead: true
      },
      {
        id: '2',
        senderId: 'user1',
        senderName: user?.name || 'You',
        senderRole: user?.role || 'buyer',
        content: 'Yes, very interested! Can you provide more details about the origin and certifications?',
        timestamp: new Date(Date.now() - 240000),
        type: 'text',
        isRead: true
      },
      {
        id: '3',
        senderId: 'user3',
        senderName: 'Sarah Logistics',
        senderRole: 'logistics_provider',
        content: 'I can handle the shipping for this transaction. Port-to-port delivery available.',
        timestamp: new Date(Date.now() - 120000),
        type: 'text',
        isRead: true
      }
    ];
    setMessages(mockMessages);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone Access",
        description: "Please allow microphone access to send voice messages",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !audioUrl) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id?.toString() || 'current-user',
      senderName: user?.name || 'You',
      senderRole: user?.role || 'buyer',
      content: newMessage || 'Voice message',
      timestamp: new Date(),
      type: audioUrl ? 'voice' : 'text',
      voiceUrl: audioUrl || undefined,
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setAudioUrl(null);

    // Simulate real-time updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, isRead: true } : msg
        )
      );
    }, 1000);
  };

  const translateMessage = async (messageId: string, targetLang: string) => {
    setTranslatingMessages(prev => new Set([...Array.from(prev), messageId]));
    
    // Simulate translation API call
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => {
          if (msg.id === messageId) {
            const translations: Record<string, string> = {
              'en': 'Hello! I have premium coffee beans available for export. Interested?',
              'fr': 'Bonjour! J\'ai des grains de café de qualité supérieure disponibles à l\'exportation. Intéressé?',
              'ar': 'مرحبا! لدي حبوب قهوة ممتازة متاحة للتصدير. مهتم؟',
              'ha': 'Sannu! Ina da ƙwayoyin kofi na musamman da ake fitarwa. Kuna sha\'awa?',
              'sw': 'Hujambo! Nina maharagwe ya kahawa bora yanayopatikana kwa uhamishaji. Unapenda?'
            };
            
            return {
              ...msg,
              translatedContent: translations[targetLang] || msg.content,
              isTranslated: true,
              originalContent: msg.content
            };
          }
          return msg;
        })
      );
      
      setTranslatingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }, 1500);
  };

  const reportMessage = (messageId: string) => {
    setReportingMessage(messageId);
    toast({
      title: "Message Reported",
      description: "Thank you for reporting. Our moderation team will review this message.",
      variant: "default"
    });
    setTimeout(() => setReportingMessage(null), 2000);
  };

  const playVoiceMessage = (messageId: string, voiceUrl: string) => {
    if (isPlaying === messageId) {
      setIsPlaying(null);
    } else {
      setIsPlaying(messageId);
      const audio = new Audio(voiceUrl);
      audio.onended = () => setIsPlaying(null);
      audio.play();
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.userId === user?.id?.toString() && r.emoji === emoji);
          
          if (existingReaction) {
            // Remove reaction
            return {
              ...msg,
              reactions: reactions.filter(r => !(r.userId === user?.id?.toString() && r.emoji === emoji))
            };
          } else {
            // Add reaction
            return {
              ...msg,
              reactions: [...reactions, {
                emoji,
                userId: user?.id?.toString() || 'current-user',
                userName: user?.name || 'You'
              }]
            };
          }
        }
        return msg;
      })
    );
  };

  return (
    <div className={cn("flex flex-col h-full bg-white rounded-lg shadow-lg", className)}>
      {/* Chat Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map(participant => (
              <div
                key={participant.id}
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold",
                  roleColors[participant.role]
                )}
              >
                {participant.name.charAt(0)}
              </div>
            ))}
          </div>
          <div>
            <CardTitle className="text-sm">Trade Discussion</CardTitle>
            <p className="text-xs text-gray-500">
              {participants.length} participants • {participants.filter(p => p.isOnline).length} online
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={autoTranslate ? "bg-blue-100 text-blue-600" : ""}
          >
            <Languages className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowParticipants(!showParticipants)}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Auto-translate settings */}
      <AnimatePresence>
        {autoTranslate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-blue-50 border-b"
          >
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700">Auto-translate to:</span>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-white border rounded px-2 py-1 text-xs"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                message.senderId === user?.id?.toString() ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                  roleColors[message.senderRole as keyof typeof roleColors]
                )}
              >
                {message.senderName.charAt(0)}
              </div>
              
              <div className={cn(
                "flex flex-col gap-1 max-w-xs",
                message.senderId === user?.id?.toString() ? "items-end" : "items-start"
              )}>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{message.senderName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {message.senderRole.replace('_', ' ')}
                  </Badge>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>
                
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 relative group",
                    message.senderId === user?.id?.toString()
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  {message.type === 'voice' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => message.voiceUrl && playVoiceMessage(message.id, message.voiceUrl)}
                        className="p-1 h-auto"
                      >
                        {isPlaying === message.id ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-sm">Voice message</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm">
                        {message.isTranslated && autoTranslate 
                          ? message.translatedContent 
                          : message.content
                        }
                      </p>
                      {message.isTranslated && autoTranslate && (
                        <p className="text-xs opacity-70 mt-1 italic">
                          Original: {message.originalContent}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Message actions */}
                  <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-1">
                      {!autoTranslate && message.senderId !== user?.id?.toString() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => translateMessage(message.id, targetLanguage)}
                          disabled={translatingMessages.has(message.id)}
                          className="p-1 h-6 w-6"
                        >
                          <Globe className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reportMessage(message.id)}
                        className="p-1 h-6 w-6 text-red-500 hover:text-red-600"
                      >
                        {reportingMessage === message.id ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <Flag className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-1">
                    {message.reactions.map((reaction, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => addReaction(message.id, reaction.emoji)}
                        className="p-1 h-6 text-xs"
                      >
                        {reaction.emoji}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Quick reactions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {['👍', '❤️', '😊', '👏'].map(emoji => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      onClick={() => addReaction(message.id, emoji)}
                      className="p-1 h-6 text-xs"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t">
        {audioUrl && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">Voice message ready</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioUrl(null)}
              className="text-red-500"
            >
              Remove
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "transition-colors",
              isRecording ? "bg-red-100 text-red-600 animate-pulse" : ""
            )}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isRecording}
          />
          
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() && !audioUrl}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}