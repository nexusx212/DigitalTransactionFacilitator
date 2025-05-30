import {
  users, type User, type InsertUser,
  invoices, type Invoice, type InsertInvoice,
  productCategories, type ProductCategory, type InsertProductCategory,
  products, type Product, type InsertProduct,
  courses, type Course, type InsertCourse,
  userCourses, type UserCourse, type InsertUserCourse,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  aiMessages, type AiMessage, type InsertAiMessage,
  chats, type Chat, type InsertChat,
  chatParticipants, type ChatParticipant, type InsertChatParticipant,
  chatMessages, type ChatMessage, type InsertChatMessage,
  escrows, type Escrow, type InsertEscrow,
  disputes, type Dispute, type InsertDispute
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Invoice operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoicesByUserId(userId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, data: Partial<InsertInvoice>): Promise<Invoice | undefined>;

  // Product Category operations
  getProductCategory(id: number): Promise<ProductCategory | undefined>;
  getProductCategoryBySlug(slug: string): Promise<ProductCategory | undefined>;
  getAllProductCategories(): Promise<ProductCategory[]>;
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;

  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsByUserId(userId: number): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined>;

  // Course operations
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // UserCourse operations
  getUserCourse(userId: number, courseId: number): Promise<UserCourse | undefined>;
  getUserCoursesByUserId(userId: number): Promise<UserCourse[]>;
  createUserCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  updateUserCourse(id: number, data: Partial<InsertUserCourse>): Promise<UserCourse | undefined>;

  // Wallet operations
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletsByUserId(userId: number): Promise<Wallet[]>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(id: number, data: Partial<InsertWallet>): Promise<Wallet | undefined>;

  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, data: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  getAllUsers(): Promise<User[]>;

  // AI Message operations
  getAiMessage(id: number): Promise<AiMessage | undefined>;
  getAiMessagesByUserId(userId: number): Promise<AiMessage[]>;
  createAiMessage(message: InsertAiMessage): Promise<AiMessage>;
  
  // Chat operations
  getChat(id: number): Promise<Chat | undefined>;
  getChatsByUserId(userId: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  updateChat(id: number, data: Partial<InsertChat>): Promise<Chat | undefined>;
  
  // Chat Participant operations
  getChatParticipant(userId: number, chatId: number): Promise<ChatParticipant | undefined>;
  getChatParticipantsByChatId(chatId: number): Promise<ChatParticipant[]>;
  createChatParticipant(participant: InsertChatParticipant): Promise<ChatParticipant>;
  updateChatParticipant(id: number, data: Partial<InsertChatParticipant>): Promise<ChatParticipant | undefined>;
  
  // Chat Message operations
  getChatMessage(id: number): Promise<ChatMessage | undefined>;
  getChatMessagesByChatId(chatId: number, limit?: number, before?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateChatMessage(id: number, data: Partial<InsertChatMessage>): Promise<ChatMessage | undefined>;
  
  // Escrow operations
  getEscrow(id: number): Promise<Escrow | undefined>;
  getEscrowsByChatId(chatId: number): Promise<Escrow[]>;
  getEscrowsByUserId(userId: number): Promise<Escrow[]>;
  createEscrow(escrow: InsertEscrow): Promise<Escrow>;
  updateEscrow(id: number, data: Partial<InsertEscrow>): Promise<Escrow | undefined>;
  
  // Dispute operations
  getDispute(id: number): Promise<Dispute | undefined>;
  getDisputesByEscrowId(escrowId: number): Promise<Dispute[]>;
  getDisputesByUserId(userId: number): Promise<Dispute[]>;
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  updateDispute(id: number, data: Partial<InsertDispute>): Promise<Dispute | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private invoices: Map<number, Invoice>;
  private productCategories: Map<number, ProductCategory>;
  private products: Map<number, Product>;
  private courses: Map<number, Course>;
  private userCourses: Map<number, UserCourse>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private aiMessages: Map<number, AiMessage>;
  private chats: Map<number, Chat>;
  private chatParticipants: Map<number, ChatParticipant>;
  private chatMessages: Map<number, ChatMessage>;
  private escrows: Map<number, Escrow>;
  private disputes: Map<number, Dispute>;

  private userIdCounter: number;
  private invoiceIdCounter: number;
  private productCategoryIdCounter: number;
  private productIdCounter: number;
  private courseIdCounter: number;
  private userCourseIdCounter: number;
  private walletIdCounter: number;
  private transactionIdCounter: number;
  private aiMessageIdCounter: number;
  private chatIdCounter: number;
  private chatParticipantIdCounter: number;
  private chatMessageIdCounter: number;
  private escrowIdCounter: number;
  private disputeIdCounter: number;

  constructor() {
    this.users = new Map();
    this.invoices = new Map();
    this.productCategories = new Map();
    this.products = new Map();
    this.courses = new Map();
    this.userCourses = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.aiMessages = new Map();
    this.chats = new Map();
    this.chatParticipants = new Map();
    this.chatMessages = new Map();
    this.escrows = new Map();
    this.disputes = new Map();

    this.userIdCounter = 1;
    this.invoiceIdCounter = 1;
    this.productCategoryIdCounter = 1;
    this.productIdCounter = 1;
    this.courseIdCounter = 1;
    this.userCourseIdCounter = 1;
    this.walletIdCounter = 1;
    this.transactionIdCounter = 1;
    this.aiMessageIdCounter = 1;
    this.chatIdCounter = 1;
    this.chatParticipantIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.escrowIdCounter = 1;
    this.disputeIdCounter = 1;

    // Initialize with some defaults for demo purposes
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Initialize default categories and courses only
    // No default users - all users come from real authentication

    // Create product categories
    const categories = [
      { name: "Agriculture", slug: "agriculture" },
      { name: "Textiles", slug: "textiles" },
      { name: "Manufacturing", slug: "manufacturing" },
      { name: "Services", slug: "services" },
      { name: "Technology", slug: "technology" }
    ];
    
    categories.forEach(cat => this.createProductCategory({ name: cat.name, slug: cat.slug }));

    // Create courses
    const coursesData = [
      {
        title: "Export Documentation Mastery",
        description: "Learn how to prepare and process all required export documents efficiently.",
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        level: "Beginner",
        duration: "4 hours",
        hasCertificate: true
      },
      {
        title: "Customs Regulations & Compliance",
        description: "Navigate customs requirements across different African markets.",
        imageUrl: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        level: "Intermediate",
        duration: "6 hours",
        hasCertificate: true
      },
      {
        title: "Trade Finance Fundamentals",
        description: "Master the financial instruments that support international trade.",
        imageUrl: "https://images.unsplash.com/photo-1601933470096-0e34634ffcde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        level: "Advanced",
        duration: "8 hours",
        hasCertificate: true
      },
      {
        title: "AfCFTA for Businesses",
        description: "Understanding and leveraging the African Continental Free Trade Area.",
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        level: "Intermediate",
        duration: "5 hours",
        hasCertificate: true
      }
    ];
    
    coursesData.forEach(course => this.createCourse(course));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  // Invoice operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoicesByUserId(userId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(
      (invoice) => invoice.userId === userId
    );
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceIdCounter++;
    const newInvoice: Invoice = { ...invoice, id, createdAt: new Date() };
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: number, data: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    const updatedInvoice: Invoice = { ...invoice, ...data };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  // Product Category operations
  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    return this.productCategories.get(id);
  }

  async getProductCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
    return Array.from(this.productCategories.values()).find(
      (category) => category.slug === slug
    );
  }

  async getAllProductCategories(): Promise<ProductCategory[]> {
    return Array.from(this.productCategories.values());
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const id = this.productCategoryIdCounter++;
    const newCategory: ProductCategory = { ...category, id };
    this.productCategories.set(id, newCategory);
    return newCategory;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getProductsByUserId(userId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.userId === userId
    );
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = { ...product, id, createdAt: new Date() };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = { ...product, ...data };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Course operations
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const newCourse: Course = { ...course, id, createdAt: new Date() };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  // UserCourse operations
  async getUserCourse(userId: number, courseId: number): Promise<UserCourse | undefined> {
    return Array.from(this.userCourses.values()).find(
      (uc) => uc.userId === userId && uc.courseId === courseId
    );
  }

  async getUserCoursesByUserId(userId: number): Promise<UserCourse[]> {
    return Array.from(this.userCourses.values()).filter(
      (uc) => uc.userId === userId
    );
  }

  async createUserCourse(userCourse: InsertUserCourse): Promise<UserCourse> {
    const id = this.userCourseIdCounter++;
    const newUserCourse: UserCourse = { ...userCourse, id };
    this.userCourses.set(id, newUserCourse);
    return newUserCourse;
  }

  async updateUserCourse(id: number, data: Partial<InsertUserCourse>): Promise<UserCourse | undefined> {
    const userCourse = this.userCourses.get(id);
    if (!userCourse) return undefined;
    
    const updatedUserCourse: UserCourse = { ...userCourse, ...data };
    this.userCourses.set(id, updatedUserCourse);
    return updatedUserCourse;
  }

  // Wallet operations
  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }

  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(
      (wallet) => wallet.userId === userId
    );
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const id = this.walletIdCounter++;
    const newWallet: Wallet = { ...wallet, id, createdAt: new Date() };
    this.wallets.set(id, newWallet);
    return newWallet;
  }

  async updateWallet(id: number, data: Partial<InsertWallet>): Promise<Wallet | undefined> {
    const wallet = this.wallets.get(id);
    if (!wallet) return undefined;
    
    const updatedWallet: Wallet = { ...wallet, ...data };
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const newTransaction: Transaction = { ...transaction, id, createdAt: new Date() };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async updateTransaction(id: number, data: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction: Transaction = { ...transaction, ...data };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // AI Message operations
  async getAiMessage(id: number): Promise<AiMessage | undefined> {
    return this.aiMessages.get(id);
  }

  async getAiMessagesByUserId(userId: number): Promise<AiMessage[]> {
    return Array.from(this.aiMessages.values())
      .filter((msg) => msg.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // Sort by timestamp ascending
  }

  async createAiMessage(message: InsertAiMessage): Promise<AiMessage> {
    const id = this.aiMessageIdCounter++;
    const newMessage: AiMessage = { ...message, id };
    this.aiMessages.set(id, newMessage);
    return newMessage;
  }

  // Chat operations
  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async getChatsByUserId(userId: number): Promise<Chat[]> {
    // Get all chats where the user is a participant
    const participantChats = Array.from(this.chatParticipants.values())
      .filter((participant) => participant.userId === userId)
      .map((participant) => participant.chatId);
    
    // Return chats based on participant info
    return Array.from(this.chats.values())
      .filter((chat) => participantChats.includes(chat.id))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); // Sort by updatedAt descending
  }

  async createChat(chat: InsertChat): Promise<Chat> {
    const id = this.chatIdCounter++;
    const now = new Date();
    const newChat: Chat = { 
      ...chat, 
      id, 
      createdAt: now, 
      updatedAt: now
    };
    this.chats.set(id, newChat);
    return newChat;
  }

  async updateChat(id: number, data: Partial<InsertChat>): Promise<Chat | undefined> {
    const chat = this.chats.get(id);
    if (!chat) return undefined;
    
    const updatedChat: Chat = { 
      ...chat, 
      ...data, 
      updatedAt: new Date() 
    };
    this.chats.set(id, updatedChat);
    return updatedChat;
  }
  
  // Chat Participant operations
  async getChatParticipant(userId: number, chatId: number): Promise<ChatParticipant | undefined> {
    return Array.from(this.chatParticipants.values()).find(
      (participant) => participant.userId === userId && participant.chatId === chatId
    );
  }

  async getChatParticipantsByChatId(chatId: number): Promise<ChatParticipant[]> {
    return Array.from(this.chatParticipants.values()).filter(
      (participant) => participant.chatId === chatId
    );
  }

  async createChatParticipant(participant: InsertChatParticipant): Promise<ChatParticipant> {
    const id = this.chatParticipantIdCounter++;
    const newParticipant: ChatParticipant = { 
      ...participant, 
      id, 
      joinedAt: new Date() 
    };
    this.chatParticipants.set(id, newParticipant);
    return newParticipant;
  }

  async updateChatParticipant(id: number, data: Partial<InsertChatParticipant>): Promise<ChatParticipant | undefined> {
    const participant = this.chatParticipants.get(id);
    if (!participant) return undefined;
    
    const updatedParticipant: ChatParticipant = { ...participant, ...data };
    this.chatParticipants.set(id, updatedParticipant);
    return updatedParticipant;
  }
  
  // Chat Message operations
  async getChatMessage(id: number): Promise<ChatMessage | undefined> {
    return this.chatMessages.get(id);
  }

  async getChatMessagesByChatId(chatId: number, limit?: number, before?: number): Promise<ChatMessage[]> {
    let messages = Array.from(this.chatMessages.values())
      .filter((message) => message.chatId === chatId);
      
    // Filter for pagination if 'before' ID is provided
    if (before !== undefined) {
      const beforeMessage = this.chatMessages.get(before);
      if (beforeMessage) {
        messages = messages.filter(
          (message) => message.createdAt.getTime() < beforeMessage.createdAt.getTime()
        );
      }
    }
    
    // Sort messages by timestamp ascending
    messages = messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    // Apply limit if provided
    if (limit !== undefined && limit > 0) {
      messages = messages.slice(0, limit);
    }
    
    return messages;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const now = new Date();
    const newMessage: ChatMessage = { 
      ...message, 
      id, 
      createdAt: now,
      isEdited: false
    };
    this.chatMessages.set(id, newMessage);
    
    // Update the chat's updatedAt timestamp
    const chat = this.chats.get(message.chatId);
    if (chat) {
      this.updateChat(chat.id, { ...chat, updatedAt: now });
    }
    
    return newMessage;
  }

  async updateChatMessage(id: number, data: Partial<InsertChatMessage>): Promise<ChatMessage | undefined> {
    const message = this.chatMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage: ChatMessage = { 
      ...message, 
      ...data, 
      isEdited: true 
    };
    this.chatMessages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  // Escrow operations
  async getEscrow(id: number): Promise<Escrow | undefined> {
    return this.escrows.get(id);
  }

  async getEscrowsByChatId(chatId: number): Promise<Escrow[]> {
    return Array.from(this.escrows.values())
      .filter((escrow) => escrow.chatId === chatId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by createdAt descending
  }

  async getEscrowsByUserId(userId: number): Promise<Escrow[]> {
    return Array.from(this.escrows.values())
      .filter((escrow) => escrow.importerId === userId || escrow.exporterId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by createdAt descending
  }

  async createEscrow(escrow: InsertEscrow): Promise<Escrow> {
    const id = this.escrowIdCounter++;
    const now = new Date();
    const newEscrow: Escrow = { 
      ...escrow, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.escrows.set(id, newEscrow);
    return newEscrow;
  }

  async updateEscrow(id: number, data: Partial<InsertEscrow>): Promise<Escrow | undefined> {
    const escrow = this.escrows.get(id);
    if (!escrow) return undefined;
    
    const updatedEscrow: Escrow = { 
      ...escrow, 
      ...data, 
      updatedAt: new Date() 
    };
    this.escrows.set(id, updatedEscrow);
    return updatedEscrow;
  }
  
  // Dispute operations
  async getDispute(id: number): Promise<Dispute | undefined> {
    return this.disputes.get(id);
  }

  async getDisputesByEscrowId(escrowId: number): Promise<Dispute[]> {
    return Array.from(this.disputes.values())
      .filter((dispute) => dispute.escrowId === escrowId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by createdAt descending
  }

  async getDisputesByUserId(userId: number): Promise<Dispute[]> {
    return Array.from(this.disputes.values())
      .filter((dispute) => dispute.initiatorId === userId || dispute.respondentId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by createdAt descending
  }

  async createDispute(dispute: InsertDispute): Promise<Dispute> {
    const id = this.disputeIdCounter++;
    const now = new Date();
    const newDispute: Dispute = { 
      ...dispute, 
      id, 
      createdAt: now, 
      updatedAt: now,
      resolvedAt: null
    };
    this.disputes.set(id, newDispute);
    return newDispute;
  }

  async updateDispute(id: number, data: Partial<InsertDispute>): Promise<Dispute | undefined> {
    const dispute = this.disputes.get(id);
    if (!dispute) return undefined;
    
    const updatedDispute: Dispute = { 
      ...dispute, 
      ...data, 
      updatedAt: new Date() 
    };
    
    // If status is changing to a resolved state, update the resolvedAt timestamp
    if (data.status && ['resolved_release', 'resolved_refund'].includes(data.status) && !dispute.resolvedAt) {
      updatedDispute.resolvedAt = new Date();
    }
    
    this.disputes.set(id, updatedDispute);
    return updatedDispute;
  }
}

export const storage = new MemStorage();
