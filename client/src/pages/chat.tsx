import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, getInitials, formatDate } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Shield, ShieldAlert, DollarSign, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

// Types for our chat interface
type ChatMessage = {
  id: number;
  userId: number;
  chatId: number;
  content: string;
  messageType: string;
  metadata?: any;
  createdAt: Date;
  isEdited: boolean;
  replyToMessageId?: number | null;
};

type ChatParticipant = {
  id: number;
  userId: number;
  chatId: number;
  role: string;
  joinedAt: Date;
  lastReadMessageId?: number | null;
  user?: {
    id: number;
    name: string;
    photoUrl?: string | null;
  }
};

type Chat = {
  id: number;
  name: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
};

type Escrow = {
  id: number;
  chatId: number;
  importerId: number;
  exporterId: number;
  amount: string;
  currency: string;
  status: string;
  tradeDescription: string;
  productId?: number | null;
  createdAt: Date;
  updatedAt: Date;
  releaseConditions?: string | null;
  releaseDate?: Date | null;
  disputeReason?: string | null;
  resolutionNotes?: string | null;
  transactionId?: number | null;
};

type Dispute = {
  id: number;
  escrowId: number;
  chatId: number;
  initiatorId: number;
  respondentId: number;
  status: string;
  reason: string;
  details: string;
  evidenceUrls?: string[] | null;
  moderatorId?: number | null;
  moderatorNotes?: string | null;
  resolution?: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date | null;
};

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const chatId = id ? parseInt(id) : undefined;
  const [message, setMessage] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [escrowAmount, setEscrowAmount] = useState('');
  const [escrowCurrency, setEscrowCurrency] = useState('USD');
  const [escrowDescription, setEscrowDescription] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDetails, setDisputeDetails] = useState('');
  const [resolveAction, setResolveAction] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isEscrowDialogOpen, setIsEscrowDialogOpen] = useState(false);
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Current user info - would normally come from auth context
  // For demo purposes, we're using a fixed user ID
  const currentUserId = 1; // Represents Sarah Johnson for demo

  // Queries to fetch data
  const {
    data: chat,
    isLoading: isLoadingChat,
    error: chatError,
  } = useQuery({
    queryKey: ['/api/chats', chatId],
    queryFn: () => apiRequest('GET', `/api/chats/${chatId}`).then(res => res.json()),
    enabled: !!chatId,
  });

  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ['/api/chats', chatId, 'messages'],
    queryFn: () => apiRequest('GET', `/api/chats/${chatId}/messages`).then(res => res.json()),
    enabled: !!chatId,
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  });

  const {
    data: participants,
    isLoading: isLoadingParticipants,
    error: participantsError,
  } = useQuery({
    queryKey: ['/api/chats', chatId, 'participants'],
    queryFn: () => apiRequest('GET', `/api/chats/${chatId}/participants`).then(res => res.json()),
    enabled: !!chatId,
  });

  const {
    data: escrows,
    isLoading: isLoadingEscrows,
    error: escrowsError,
  } = useQuery({
    queryKey: ['/api/chats', chatId, 'escrows'],
    queryFn: () => apiRequest('GET', `/api/chats/${chatId}/escrows`).then(res => res.json()),
    enabled: !!chatId,
  });

  const {
    data: disputes,
    isLoading: isLoadingDisputes,
    error: disputesError,
  } = useQuery({
    queryKey: ['/api/escrows', escrows?.[0]?.id, 'disputes'],
    queryFn: () => apiRequest('GET', `/api/escrows/${escrows?.[0]?.id}/disputes`).then(res => res.json()),
    enabled: !!escrows?.[0]?.id,
  });

  // Mutations for interactions
  const sendMessageMutation = useMutation({
    mutationFn: (newMessage: { chatId: number; content: string; messageType: string }) => 
      apiRequest('POST', '/api/chat-messages', newMessage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chats', chatId, 'messages'] });
      setMessage('');
    },
    onError: (error) => {
      toast({
        title: 'Error sending message',
        description: 'Unable to send your message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const createEscrowMutation = useMutation({
    mutationFn: (escrowData: any) => apiRequest('POST', '/api/escrows', escrowData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chats', chatId, 'escrows'] });
      setIsEscrowDialogOpen(false);
      setEscrowAmount('');
      setEscrowDescription('');
      toast({
        title: 'Escrow Created',
        description: 'Your escrow has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating escrow',
        description: 'Unable to create escrow. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateEscrowMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PATCH', `/api/escrows/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chats', chatId, 'escrows'] });
      toast({
        title: 'Escrow Updated',
        description: 'Escrow status has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating escrow',
        description: 'Unable to update escrow. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const createDisputeMutation = useMutation({
    mutationFn: (disputeData: any) => apiRequest('POST', '/api/disputes', disputeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/escrows', escrows?.[0]?.id, 'disputes'] });
      setIsDisputeDialogOpen(false);
      setDisputeReason('');
      setDisputeDetails('');
      toast({
        title: 'Dispute Filed',
        description: 'Your dispute has been filed successfully.',
      });
      
      // Update escrow status to disputed
      if (escrows?.[0]?.id) {
        updateEscrowMutation.mutate({
          id: escrows[0].id,
          data: { status: 'disputed' }
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error filing dispute',
        description: 'Unable to file dispute. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const resolveDisputeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PATCH', `/api/disputes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/escrows', escrows?.[0]?.id, 'disputes'] });
      setIsResolveDialogOpen(false);
      setResolveAction('');
      setResolutionNotes('');
      toast({
        title: 'Dispute Resolved',
        description: 'The dispute has been resolved successfully.',
      });
      
      // Update escrow status based on resolution
      if (escrows?.[0]?.id) {
        const newStatus = resolveAction === 'release' ? 'released' : 'refunded';
        updateEscrowMutation.mutate({
          id: escrows[0].id,
          data: { 
            status: newStatus,
            resolutionNotes: resolutionNotes
          }
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error resolving dispute',
        description: 'Unable to resolve dispute. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messageContainerRef.current && messages) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId) return;

    sendMessageMutation.mutate({
      chatId,
      content: message,
      messageType: 'text',
    });
  };

  // Handle creating a new escrow
  const handleCreateEscrow = () => {
    if (!escrowAmount || !escrowDescription || !chatId) return;

    // Find the exporter's user ID
    const exporterId = participants?.find(p => p.role === 'exporter')?.userId;
    if (!exporterId) {
      toast({
        title: 'Error creating escrow',
        description: 'No exporter found in this chat.',
        variant: 'destructive',
      });
      return;
    }

    createEscrowMutation.mutate({
      chatId,
      importerId: currentUserId,
      exporterId,
      amount: escrowAmount,
      currency: escrowCurrency,
      status: 'pending',
      tradeDescription: escrowDescription,
    });
  };

  // Handle filing a dispute
  const handleCreateDispute = () => {
    if (!disputeReason || !disputeDetails || !escrows?.[0]?.id) return;

    // Find the exporter's user ID
    const exporterId = participants?.find(p => p.role === 'exporter')?.userId;
    if (!exporterId) {
      toast({
        title: 'Error filing dispute',
        description: 'No exporter found in this chat.',
        variant: 'destructive',
      });
      return;
    }

    createDisputeMutation.mutate({
      escrowId: escrows[0].id,
      chatId,
      initiatorId: currentUserId,
      respondentId: exporterId,
      status: 'open',
      reason: disputeReason,
      details: disputeDetails,
    });
  };

  // Handle resolving a dispute (for demo purposes, everyone can resolve disputes)
  const handleResolveDispute = () => {
    if (!resolveAction || !disputes?.[0]?.id) return;

    resolveDisputeMutation.mutate({
      id: disputes[0].id,
      data: {
        status: `resolved_${resolveAction}`,
        resolution: resolutionNotes || `Funds ${resolveAction === 'release' ? 'released to exporter' : 'refunded to importer'}`,
        resolvedAt: new Date(),
      }
    });
  };

  // Handle funding an escrow (demo - just updates the status)
  const handleFundEscrow = (escrowId: number) => {
    updateEscrowMutation.mutate({
      id: escrowId,
      data: { status: 'funded' }
    });
  };

  // Handle releasing escrow funds (demo - just updates the status)
  const handleReleaseEscrow = (escrowId: number) => {
    updateEscrowMutation.mutate({
      id: escrowId,
      data: { status: 'released' }
    });
  };

  // Helper to determine if user can perform certain actions
  const userIsImporter = participants?.some(p => p.userId === currentUserId && p.role === 'importer');
  const userIsExporter = participants?.some(p => p.userId === currentUserId && p.role === 'exporter');
  const activeEscrow = escrows?.[0];
  const activeDispute = disputes?.[0];

  if (isLoadingChat || isLoadingMessages || isLoadingParticipants) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading chat...</span>
      </div>
    );
  }

  if (chatError || !chat) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Chat</h2>
        <p className="text-muted-foreground mb-4">Unable to load chat data. Please try again later.</p>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{chat.name}</h1>
          <p className="text-muted-foreground">
            {chat.type === 'trade_negotiation' ? 'Trade Negotiation' : 'Chat'} • 
            Created {formatDate(chat.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main chat area - takes up 2/3 of the space on desktop */}
        <div className="md:col-span-2 h-[calc(100vh-200px)] flex flex-col rounded-lg border bg-card">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Messages</h3>
              <p className="text-sm text-muted-foreground">
                {participants?.length || 0} participants
              </p>
            </div>
            <div>
              <Badge variant={
                chat.status === 'active' ? 'default' : 
                chat.status === 'closed' ? 'secondary' : 
                'outline'
              }>
                {chat.status === 'active' ? 'Active' : 
                 chat.status === 'closed' ? 'Closed' : 
                 'Archived'}
              </Badge>
            </div>
          </div>

          {/* Messages container with scroll */}
          <ScrollArea className="flex-grow p-4" ref={messageContainerRef}>
            {messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg: ChatMessage) => {
                  const participant = participants?.find(p => p.userId === msg.userId);
                  const isCurrentUser = msg.userId === currentUserId;
                  const messageDate = new Date(msg.createdAt);
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant?.user?.photoUrl || undefined} />
                          <AvatarFallback>{getInitials(participant?.user?.name || 'User')}</AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg p-3 ${
                          isCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <div className="text-xs mb-1">
                            <span className="font-semibold">{participant?.user?.name || 'User'}</span>
                            <span className="mx-2">•</span>
                            <span>{messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="break-words">{msg.content}</div>
                          {msg.isEdited && <span className="text-xs opacity-70 mt-1 block">(edited)</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            )}
          </ScrollArea>

          {/* Message input area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow"
              />
              <Button 
                type="submit" 
                disabled={!message.trim() || sendMessageMutation.isPending}
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar for trade information & escrow/dispute functionality */}
        <div className="space-y-4">
          {/* Participants card */}
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>People in this conversation</CardDescription>
            </CardHeader>
            <CardContent>
              {participants && participants.length > 0 ? (
                <div className="space-y-3">
                  {participants.map((participant: ChatParticipant) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.user?.photoUrl || undefined} />
                        <AvatarFallback>{getInitials(participant.user?.name || 'User')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.user?.name || 'Unknown User'}</p>
                        <Badge variant="outline" className="capitalize">
                          {participant.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No participants found</p>
              )}
            </CardContent>
          </Card>

          {/* Escrow & Dispute Management */}
          <Card>
            <CardHeader>
              <CardTitle>Trade Protection</CardTitle>
              <CardDescription>Escrow & dispute resolution</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="escrow">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="escrow">Escrow</TabsTrigger>
                  <TabsTrigger value="disputes">Disputes</TabsTrigger>
                </TabsList>
                
                {/* Escrow Tab */}
                <TabsContent value="escrow" className="space-y-4">
                  {isLoadingEscrows ? (
                    <div className="py-8 flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : activeEscrow ? (
                    <div className="space-y-3 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{formatCurrency(parseFloat(activeEscrow.amount), activeEscrow.currency)}</h4>
                          <p className="text-sm">{activeEscrow.tradeDescription}</p>
                        </div>
                        <Badge className={
                          activeEscrow.status === 'pending' ? 'bg-amber-500' : 
                          activeEscrow.status === 'funded' ? 'bg-blue-500' :
                          activeEscrow.status === 'released' ? 'bg-green-500' :
                          activeEscrow.status === 'refunded' ? 'bg-gray-500' :
                          activeEscrow.status === 'disputed' ? 'bg-red-500' :
                          'bg-primary'
                        }>
                          {activeEscrow.status.charAt(0).toUpperCase() + activeEscrow.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Created:</span>
                          <span className="text-sm">{formatDate(activeEscrow.createdAt)}</span>
                        </div>
                        {activeEscrow.releaseDate && (
                          <div className="flex justify-between">
                            <span className="text-sm">Release Date:</span>
                            <span className="text-sm">{formatDate(activeEscrow.releaseDate)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-2">
                        {activeEscrow.status === 'pending' && userIsImporter && (
                          <Button 
                            className="w-full" 
                            onClick={() => handleFundEscrow(activeEscrow.id)}
                            disabled={updateEscrowMutation.isPending}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Fund Escrow
                          </Button>
                        )}
                        
                        {activeEscrow.status === 'funded' && userIsImporter && (
                          <div className="space-y-2">
                            <Button 
                              className="w-full" 
                              onClick={() => handleReleaseEscrow(activeEscrow.id)}
                              disabled={updateEscrowMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Release Funds
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">
                                  <ShieldAlert className="h-4 w-4 mr-2" />
                                  File Dispute
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>File a Dispute</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to file a dispute for this transaction? This action
                                    will freeze the escrow funds until the dispute is resolved.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => setIsDisputeDialogOpen(true)}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                        
                        {activeEscrow.status === 'disputed' && (
                          <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <div className="flex items-center text-red-700 mb-1">
                              <ShieldAlert className="h-4 w-4 mr-2" />
                              <span className="font-medium">Dispute in Progress</span>
                            </div>
                            <p className="text-sm text-red-600">
                              This transaction is under dispute. The funds are frozen until the dispute is resolved.
                            </p>
                          </div>
                        )}
                        
                        {(activeEscrow.status === 'released' || activeEscrow.status === 'refunded') && (
                          <div className={`bg-${activeEscrow.status === 'released' ? 'green' : 'gray'}-50 border border-${activeEscrow.status === 'released' ? 'green' : 'gray'}-200 rounded-md p-3`}>
                            <div className={`flex items-center text-${activeEscrow.status === 'released' ? 'green' : 'gray'}-700 mb-1`}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span className="font-medium">
                                {activeEscrow.status === 'released' ? 'Funds Released' : 'Funds Refunded'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {activeEscrow.status === 'released' 
                                ? 'The funds have been released to the exporter.' 
                                : 'The funds have been refunded to the importer.'
                              }
                            </p>
                            {activeEscrow.resolutionNotes && (
                              <p className="text-sm mt-2 italic">
                                "{activeEscrow.resolutionNotes}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 space-y-4">
                      <p className="text-muted-foreground">No active escrow for this trade.</p>
                      
                      {userIsImporter && (
                        <Button onClick={() => setIsEscrowDialogOpen(true)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Create Escrow
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                {/* Disputes Tab */}
                <TabsContent value="disputes" className="space-y-4">
                  {isLoadingDisputes ? (
                    <div className="py-8 flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : activeDispute ? (
                    <div className="space-y-3 py-2">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-lg">Dispute #{activeDispute.id}</h4>
                          <Badge className={
                            activeDispute.status === 'open' ? 'bg-red-500' : 
                            activeDispute.status === 'under_review' ? 'bg-amber-500' :
                            activeDispute.status.includes('resolved') ? 'bg-green-500' :
                            'bg-primary'
                          }>
                            {activeDispute.status.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mt-1">{activeDispute.reason}</p>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <p>{activeDispute.details}</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Filed on:</span>
                          <span className="text-sm">{formatDate(activeDispute.createdAt)}</span>
                        </div>
                        {activeDispute.resolvedAt && (
                          <div className="flex justify-between">
                            <span className="text-sm">Resolved on:</span>
                            <span className="text-sm">{formatDate(activeDispute.resolvedAt)}</span>
                          </div>
                        )}
                      </div>
                      
                      {activeDispute.resolution && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
                          <h5 className="font-medium text-green-700 mb-1">Resolution</h5>
                          <p className="text-sm">{activeDispute.resolution}</p>
                        </div>
                      )}
                      
                      {activeDispute.status === 'open' && (
                        <div className="pt-2">
                          <Button 
                            onClick={() => setIsResolveDialogOpen(true)}
                            className="w-full"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Resolve Dispute
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            In a real app, this would be handled by a moderator.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-muted-foreground">No disputes for this trade.</p>
                      
                      {activeEscrow && activeEscrow.status === 'funded' && userIsImporter && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsDisputeDialogOpen(true)}
                          >
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            File a Dispute
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Trade details card */}
          {chat.type === 'trade_negotiation' && chat.metadata && (
            <Card>
              <CardHeader>
                <CardTitle>Trade Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Product:</dt>
                    <dd className="text-sm font-medium">
                      {chat.metadata.productName || `Product #${chat.metadata.productId}`}
                    </dd>
                  </div>
                  
                  {chat.metadata.tradeAmount && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Amount:</dt>
                      <dd className="text-sm font-medium">
                        {chat.metadata.tradeAmount} {chat.metadata.unit || 'units'}
                      </dd>
                    </div>
                  )}
                  
                  {chat.metadata.currency && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Currency:</dt>
                      <dd className="text-sm font-medium">
                        {chat.metadata.currency}
                      </dd>
                    </div>
                  )}
                  
                  {chat.metadata.proposedDeliveryDate && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Delivery Date:</dt>
                      <dd className="text-sm font-medium">
                        {formatDate(new Date(chat.metadata.proposedDeliveryDate))}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Escrow Dialog */}
      <Dialog open={isEscrowDialogOpen} onOpenChange={setIsEscrowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Escrow</DialogTitle>
            <DialogDescription>
              Create an escrow to secure your trade. Funds will be held until you release them.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={escrowAmount}
                  onChange={(e) => setEscrowAmount(e.target.value)}
                  className="flex-grow"
                />
                <Select value={escrowCurrency} onValueChange={setEscrowCurrency}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this payment is for..."
                value={escrowDescription}
                onChange={(e) => setEscrowDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEscrowDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateEscrow}
              disabled={!escrowAmount || !escrowDescription || createEscrowMutation.isPending}
            >
              {createEscrowMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Create Escrow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Dispute Dialog */}
      <Dialog open={isDisputeDialogOpen} onOpenChange={setIsDisputeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File a Dispute</DialogTitle>
            <DialogDescription>
              Submit a dispute if there's an issue with your trade that requires resolution.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Dispute</Label>
              <Select value={disputeReason} onValueChange={setDisputeReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non_delivery">Product Not Delivered</SelectItem>
                  <SelectItem value="quality_issues">Quality Issues</SelectItem>
                  <SelectItem value="incomplete_delivery">Incomplete Delivery</SelectItem>
                  <SelectItem value="specification_mismatch">Product Does Not Match Specifications</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                placeholder="Provide detailed information about the issue..."
                value={disputeDetails}
                onChange={(e) => setDisputeDetails(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDisputeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateDispute}
              disabled={!disputeReason || !disputeDetails || createDisputeMutation.isPending}
              variant="destructive"
            >
              {createDisputeMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              File Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dispute Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Determine how to resolve this dispute. This would normally be handled by a platform moderator.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="action">Resolution Action</Label>
              <Select value={resolveAction} onValueChange={setResolveAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="release">Release Funds to Exporter</SelectItem>
                  <SelectItem value="refund">Refund Importer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Resolution Notes</Label>
              <Textarea
                id="notes"
                placeholder="Explain the reason for this resolution..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="bg-amber-50 p-3 rounded-md">
              <p className="text-sm text-amber-800">
                <AlertTriangle className="h-4 w-4 inline-block mr-1" />
                For demonstration purposes only. In a real application, this would be handled by a platform moderator.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleResolveDispute}
              disabled={!resolveAction || resolveDisputeMutation.isPending}
            >
              {resolveDisputeMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Resolve Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}