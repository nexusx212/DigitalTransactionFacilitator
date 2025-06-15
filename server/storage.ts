import {
  User,
  InsertUser,
  Invoice,
  InsertInvoice,
  ProductCategory,
  InsertProductCategory,
  Product,
  InsertProduct,
  Course,
  InsertCourse,
  UserCourse,
  InsertUserCourse,
  Wallet,
  InsertWallet,
  Transaction,
  InsertTransaction,
  AiMessage,
  InsertAiMessage,
  Chat,
  InsertChat,
  ChatParticipant,
  InsertChatParticipant,
  ChatMessage,
  InsertChatMessage,
  Escrow,
  InsertEscrow,
  Dispute,
  InsertDispute
} from "@shared/schema";

import { db } from "./db";
import { eq, desc, or, and } from "drizzle-orm";
import { 
  users, invoices, productCategories, products, courses, userCourses, 
  wallets, transactions, aiMessages, chats, chatParticipants, chatMessages, 
  escrows, disputes 
} from "@shared/schema";

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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async getInvoicesByUserId(userId: number): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.userId, userId));
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db
      .insert(invoices)
      .values(invoice)
      .returning();
    return newInvoice;
  }

  async updateInvoice(id: number, data: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const [invoice] = await db
      .update(invoices)
      .set(data)
      .where(eq(invoices.id, id))
      .returning();
    return invoice || undefined;
  }

  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    const [category] = await db.select().from(productCategories).where(eq(productCategories.id, id));
    return category || undefined;
  }

  async getProductCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
    const [category] = await db.select().from(productCategories).where(eq(productCategories.slug, slug));
    return category || undefined;
  }

  async getAllProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(productCategories);
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const [newCategory] = await db
      .insert(productCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getProductsByUserId(userId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.userId, userId));
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return newCourse;
  }

  async getUserCourse(userId: number, courseId: number): Promise<UserCourse | undefined> {
    const [userCourse] = await db.select().from(userCourses)
      .where(and(eq(userCourses.userId, userId), eq(userCourses.courseId, courseId)));
    return userCourse || undefined;
  }

  async getUserCoursesByUserId(userId: number): Promise<UserCourse[]> {
    return await db.select().from(userCourses).where(eq(userCourses.userId, userId));
  }

  async createUserCourse(userCourse: InsertUserCourse): Promise<UserCourse> {
    const [newUserCourse] = await db
      .insert(userCourses)
      .values(userCourse)
      .returning();
    return newUserCourse;
  }

  async updateUserCourse(id: number, data: Partial<InsertUserCourse>): Promise<UserCourse | undefined> {
    const [userCourse] = await db
      .update(userCourses)
      .set(data)
      .where(eq(userCourses.id, id))
      .returning();
    return userCourse || undefined;
  }

  async getWallet(id: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    return wallet || undefined;
  }

  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return await db.select().from(wallets).where(eq(wallets.userId, userId));
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db
      .insert(wallets)
      .values(wallet)
      .returning();
    return newWallet;
  }

  async updateWallet(id: number, data: Partial<InsertWallet>): Promise<Wallet | undefined> {
    const [wallet] = await db
      .update(wallets)
      .set(data)
      .where(eq(wallets.id, id))
      .returning();
    return wallet || undefined;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateTransaction(id: number, data: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set(data)
      .where(eq(transactions.id, id))
      .returning();
    return transaction || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAiMessage(id: number): Promise<AiMessage | undefined> {
    const [message] = await db.select().from(aiMessages).where(eq(aiMessages.id, id));
    return message || undefined;
  }

  async getAiMessagesByUserId(userId: number): Promise<AiMessage[]> {
    return await db.select().from(aiMessages).where(eq(aiMessages.userId, userId));
  }

  async createAiMessage(message: InsertAiMessage): Promise<AiMessage> {
    const [newMessage] = await db
      .insert(aiMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getChat(id: number): Promise<Chat | undefined> {
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    return chat || undefined;
  }

  async getChatsByUserId(userId: number): Promise<Chat[]> {
    const results = await db.select({
      id: chats.id,
      name: chats.name,
      type: chats.type,
      createdAt: chats.createdAt,
      updatedAt: chats.updatedAt,
      status: chats.status,
      metadata: chats.metadata
    })
      .from(chats)
      .innerJoin(chatParticipants, eq(chats.id, chatParticipants.chatId))
      .where(eq(chatParticipants.userId, userId));
    return results;
  }

  async createChat(chat: InsertChat): Promise<Chat> {
    const [newChat] = await db
      .insert(chats)
      .values(chat)
      .returning();
    return newChat;
  }

  async updateChat(id: number, data: Partial<InsertChat>): Promise<Chat | undefined> {
    const [chat] = await db
      .update(chats)
      .set(data)
      .where(eq(chats.id, id))
      .returning();
    return chat || undefined;
  }

  async getChatParticipant(userId: number, chatId: number): Promise<ChatParticipant | undefined> {
    const [participant] = await db.select().from(chatParticipants)
      .where(and(eq(chatParticipants.userId, userId), eq(chatParticipants.chatId, chatId)));
    return participant || undefined;
  }

  async getChatParticipantsByChatId(chatId: number): Promise<ChatParticipant[]> {
    return await db.select().from(chatParticipants).where(eq(chatParticipants.chatId, chatId));
  }

  async createChatParticipant(participant: InsertChatParticipant): Promise<ChatParticipant> {
    const [newParticipant] = await db
      .insert(chatParticipants)
      .values(participant)
      .returning();
    return newParticipant;
  }

  async updateChatParticipant(id: number, data: Partial<InsertChatParticipant>): Promise<ChatParticipant | undefined> {
    const [participant] = await db
      .update(chatParticipants)
      .set(data)
      .where(eq(chatParticipants.id, id))
      .returning();
    return participant || undefined;
  }

  async getChatMessage(id: number): Promise<ChatMessage | undefined> {
    const [message] = await db.select().from(chatMessages).where(eq(chatMessages.id, id));
    return message || undefined;
  }

  async getChatMessagesByChatId(chatId: number, limit?: number, before?: number): Promise<ChatMessage[]> {
    let query = db.select().from(chatMessages)
      .where(eq(chatMessages.chatId, chatId))
      .orderBy(desc(chatMessages.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async updateChatMessage(id: number, data: Partial<InsertChatMessage>): Promise<ChatMessage | undefined> {
    const [message] = await db
      .update(chatMessages)
      .set(data)
      .where(eq(chatMessages.id, id))
      .returning();
    return message || undefined;
  }

  async getEscrow(id: number): Promise<Escrow | undefined> {
    const [escrow] = await db.select().from(escrows).where(eq(escrows.id, id));
    return escrow || undefined;
  }

  async getEscrowsByChatId(chatId: number): Promise<Escrow[]> {
    return await db.select().from(escrows).where(eq(escrows.chatId, chatId));
  }

  async getEscrowsByUserId(userId: number): Promise<Escrow[]> {
    return await db.select().from(escrows)
      .where(or(eq(escrows.importerId, userId), eq(escrows.exporterId, userId)));
  }

  async createEscrow(escrow: InsertEscrow): Promise<Escrow> {
    const [newEscrow] = await db
      .insert(escrows)
      .values(escrow)
      .returning();
    return newEscrow;
  }

  async updateEscrow(id: number, data: Partial<InsertEscrow>): Promise<Escrow | undefined> {
    const [escrow] = await db
      .update(escrows)
      .set(data)
      .where(eq(escrows.id, id))
      .returning();
    return escrow || undefined;
  }

  async getDispute(id: number): Promise<Dispute | undefined> {
    const [dispute] = await db.select().from(disputes).where(eq(disputes.id, id));
    return dispute || undefined;
  }

  async getDisputesByEscrowId(escrowId: number): Promise<Dispute[]> {
    return await db.select().from(disputes).where(eq(disputes.escrowId, escrowId));
  }

  async getDisputesByUserId(userId: number): Promise<Dispute[]> {
    return await db.select().from(disputes)
      .where(or(eq(disputes.initiatorId, userId), eq(disputes.respondentId, userId)));
  }

  async createDispute(dispute: InsertDispute): Promise<Dispute> {
    const [newDispute] = await db
      .insert(disputes)
      .values(dispute)
      .returning();
    return newDispute;
  }

  async updateDispute(id: number, data: Partial<InsertDispute>): Promise<Dispute | undefined> {
    const [dispute] = await db
      .update(disputes)
      .set(data)
      .where(eq(disputes.id, id))
      .returning();
    return dispute || undefined;
  }
}

export const storage = new DatabaseStorage();