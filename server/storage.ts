import {
  users, type User, type InsertUser,
  invoices, type Invoice, type InsertInvoice,
  productCategories, type ProductCategory, type InsertProductCategory,
  products, type Product, type InsertProduct,
  courses, type Course, type InsertCourse,
  userCourses, type UserCourse, type InsertUserCourse,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  aiMessages, type AiMessage, type InsertAiMessage
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
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

  // AI Message operations
  getAiMessage(id: number): Promise<AiMessage | undefined>;
  getAiMessagesByUserId(userId: number): Promise<AiMessage[]>;
  createAiMessage(message: InsertAiMessage): Promise<AiMessage>;
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

  private userIdCounter: number;
  private invoiceIdCounter: number;
  private productCategoryIdCounter: number;
  private productIdCounter: number;
  private courseIdCounter: number;
  private userCourseIdCounter: number;
  private walletIdCounter: number;
  private transactionIdCounter: number;
  private aiMessageIdCounter: number;

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

    this.userIdCounter = 1;
    this.invoiceIdCounter = 1;
    this.productCategoryIdCounter = 1;
    this.productIdCounter = 1;
    this.courseIdCounter = 1;
    this.userCourseIdCounter = 1;
    this.walletIdCounter = 1;
    this.transactionIdCounter = 1;
    this.aiMessageIdCounter = 1;

    // Initialize with some defaults for demo purposes
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Create default user
    const defaultUser: InsertUser = {
      username: "sarahjohnson",
      password: "password123", // This would be hashed in production
      name: "Sarah Johnson",
      email: "sarah@company.com",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    };
    const user = this.createUser(defaultUser);

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

    // Create wallets for the user
    this.createWallet({
      userId: user.id,
      type: "PADC",
      balance: 12450,
      currency: "PADC"
    });

    this.createWallet({
      userId: user.id,
      type: "DTFS",
      balance: 580,
      currency: "DTFS"
    });

    // Create some sample transactions
    const transactions = [
      {
        userId: user.id,
        type: "sent",
        description: "Sent to GreenHarvest Ltd",
        transactionType: "PADC Transfer",
        amount: 1250,
        currency: "PADC",
        date: new Date("2023-06-02"),
        status: "completed"
      },
      {
        userId: user.id,
        type: "received",
        description: "Received from AfroCotton Inc",
        transactionType: "PADC Transfer",
        amount: 3500,
        currency: "PADC",
        date: new Date("2023-05-29"),
        status: "completed"
      },
      {
        userId: user.id,
        type: "exchanged",
        description: "Currency Exchange",
        transactionType: "USD to PADC",
        amount: 5000,
        currency: "PADC",
        date: new Date("2023-05-25"),
        status: "completed"
      }
    ];

    transactions.forEach(tx => this.createTransaction(tx));

    // Create sample invoices
    const invoices = [
      {
        userId: user.id,
        invoiceNumber: "INV-2023-0042",
        amount: 32500,
        issuedDate: new Date("2023-05-12"),
        dueDate: new Date("2023-06-12"),
        status: "Active",
        fundingStatus: "Funded",
        smartContractStatus: "Active",
        invoiceUrl: ""
      },
      {
        userId: user.id,
        invoiceNumber: "INV-2023-0055",
        amount: 18750,
        issuedDate: new Date("2023-05-28"),
        dueDate: new Date("2023-06-28"),
        status: "Pending",
        fundingStatus: "Processing",
        smartContractStatus: "Under Review",
        invoiceUrl: ""
      }
    ];

    invoices.forEach(invoice => this.createInvoice(invoice));

    // Create sample products
    const productsData = [
      {
        userId: user.id,
        name: "Premium Coffee Beans",
        price: 12.50,
        currency: "USD",
        description: "High-quality Arabica coffee beans from Ethiopia, organic certified.",
        categoryId: 1, // Agriculture
        imageUrl: "https://images.unsplash.com/photo-1607662589561-29eb2e808b8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        location: "Ethiopia",
        minimumOrder: "100kg",
        isVerified: true
      },
      {
        userId: user.id,
        name: "Handwoven Textiles",
        price: 8.75,
        currency: "USD",
        description: "Traditional hand-woven cotton textiles, perfect for fashion and home decor.",
        categoryId: 2, // Textiles
        imageUrl: "https://images.unsplash.com/photo-1629912617426-af99c2c10812?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        location: "Ghana",
        minimumOrder: "50m²",
        isVerified: true
      },
      {
        userId: user.id,
        name: "Organic Shea Butter",
        price: 22.00,
        currency: "USD",
        description: "Raw, unrefined shea butter for cosmetics and skincare products.",
        categoryId: 3, // Manufacturing
        imageUrl: "https://images.unsplash.com/photo-1606041011872-596597976b25?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        location: "Nigeria",
        minimumOrder: "25kg",
        isVerified: true
      }
    ];

    productsData.forEach(product => this.createProduct(product));

    // Create initial AI assistant message
    this.createAiMessage({
      userId: user.id,
      sender: "ai",
      text: "Hello! I'm Ava, your AI assistant. How can I help you with trade finance or marketplace questions today?",
      timestamp: new Date(),
      language: "en"
    });

    // Create user course progress
    this.createUserCourse({
      userId: user.id,
      courseId: 1,
      progress: 65,
      completed: false,
      certificateIssued: false,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      lastAccessDate: new Date()
    });

    this.createUserCourse({
      userId: user.id,
      courseId: 2,
      progress: 25,
      completed: false,
      certificateIssued: false,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      lastAccessDate: new Date()
    });
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
}

export const storage = new MemStorage();
