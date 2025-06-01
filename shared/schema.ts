import { pgTable, text, serial, integer, boolean, jsonb, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  photoUrl: text("photo_url"),
  walletAddress: text("wallet_address"),
  role: text("role", { enum: ["exporter", "buyer", "logistics_provider", "financier", "agent"] }).notNull().default("buyer"), // individual, business
  language: text("language").notNull().default("en"), // en, ha, yo, fr, sw
  country: text("country"),
  phoneNumber: text("phone_number"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  kycStatus: text("kyc_status").default("pending"), // pending, verified, rejected
  kybStatus: text("kyb_status").default("pending"), // pending, verified, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  photoUrl: true,
  walletAddress: true,
  role: true,
  language: true,
  country: true,
  phoneNumber: true,
});

// KYC Profiles
export const kycProfiles = pgTable("kyc_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  govIdType: text("gov_id_type"), // passport, nin, drivers_license
  govIdNumber: text("gov_id_number"),
  selfieUrl: text("selfie_url"),
  idDocumentUrl: text("id_document_url"),
  proofOfAddressUrl: text("proof_of_address_url"),
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
});

export const insertKycProfileSchema = createInsertSchema(kycProfiles).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

// KYB Profiles
export const kybProfiles = pgTable("kyb_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessName: text("business_name").notNull(),
  registrationNumber: text("registration_number"),
  taxId: text("tax_id"),
  businessAddress: text("business_address"),
  businessType: text("business_type"), // llc, corporation, partnership
  incorporationCountry: text("incorporation_country"),
  businessCertificateUrl: text("business_certificate_url"),
  utilityBillUrl: text("utility_bill_url"),
  directorList: jsonb("director_list"), // Array of director information
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
});

export const insertKybProfileSchema = createInsertSchema(kybProfiles).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

// Business Entities
export const businessEntities = pgTable("business_entities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  trustScore: integer("trust_score").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  tradeVolume: decimal("trade_volume", { precision: 15, scale: 2 }).default("0.00"),
  products: jsonb("products"), // Array of product categories
  region: text("region"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBusinessEntitySchema = createInsertSchema(businessEntities).omit({
  id: true,
  createdAt: true,
});

// Two Factor Authentication
export const twoFactorAuth = pgTable("two_factor_auth", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  method: text("method").notNull(), // sms, email
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTwoFactorAuthSchema = createInsertSchema(twoFactorAuth).omit({
  id: true,
  createdAt: true,
});

// Trade Finance
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  invoiceNumber: text("invoice_number").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  issuedDate: timestamp("issued_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull(), // Active, Pending, Completed
  fundingStatus: text("funding_status").notNull(), // Funded, Processing, Awaiting Payment
  smartContractStatus: text("smart_contract_status").notNull(), // Active, Under Review, Completed
  invoiceUrl: text("invoice_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

// Marketplace
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertProductCategorySchema = createInsertSchema(productCategories).omit({
  id: true,
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull().references(() => productCategories.id),
  imageUrl: text("image_url"),
  location: text("location").notNull(),
  minimumOrder: text("minimum_order").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

// Training
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  level: text("level").notNull(), // Beginner, Intermediate, Advanced
  duration: text("duration").notNull(),
  hasCertificate: boolean("has_certificate").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const userCourses = pgTable("user_courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  certificateIssued: boolean("certificate_issued").default(false).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  lastAccessDate: timestamp("last_access_date").defaultNow().notNull(),
});

export const insertUserCourseSchema = createInsertSchema(userCourses).omit({
  id: true,
});

// Wallet
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // PADC, DTFS
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0").notNull(),
  currency: text("currency").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // sent, received, exchanged, papss_payment
  description: text("description").notNull(),
  transactionType: text("transaction_type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  status: text("status").notNull(), // completed, pending, failed
  reference: text("reference"), // for external references like PAPSS transaction IDs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

// AI Assistant Messages
export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sender: text("sender").notNull(), // user, ai
  text: text("text").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  language: text("language").default("en").notNull(),
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).omit({
  id: true,
});

// Chat and Trade Negotiation
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "direct", "group", "trade_negotiation"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: text("status").default("active").notNull(), // "active", "archived", "closed"
  metadata: jsonb("metadata"), // Additional chat properties, like trade details
});

export const insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const chatParticipants = pgTable("chat_participants", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull().references(() => chats.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").default("member").notNull(), // "member", "admin", "importer", "exporter", "moderator"
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastReadMessageId: integer("last_read_message_id"),
});

export const insertChatParticipantSchema = createInsertSchema(chatParticipants).omit({
  id: true,
  joinedAt: true,
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull().references(() => chats.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  messageType: text("message_type").default("text").notNull(), // "text", "file", "trade_offer", "dispute", "escrow", "system"
  metadata: jsonb("metadata"), // For trade offers, disputes, escrow actions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isEdited: boolean("is_edited").default(false).notNull(),
  replyToMessageId: integer("reply_to_message_id"),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Trade Escrow
export const escrows = pgTable("escrows", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull().references(() => chats.id),
  importerId: integer("importer_id").notNull().references(() => users.id),
  exporterId: integer("exporter_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  status: text("status").default("pending").notNull(), // "pending", "funded", "released", "refunded", "disputed"
  tradeDescription: text("trade_description").notNull(),
  productId: integer("product_id").references(() => products.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  releaseConditions: text("release_conditions"),
  releaseDate: timestamp("release_date"),
  disputeReason: text("dispute_reason"),
  resolutionNotes: text("resolution_notes"),
  transactionId: integer("transaction_id").references(() => transactions.id),
});

export const insertEscrowSchema = createInsertSchema(escrows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Dispute Resolution
export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  escrowId: integer("escrow_id").notNull().references(() => escrows.id),
  chatId: integer("chat_id").notNull().references(() => chats.id),
  initiatorId: integer("initiator_id").notNull().references(() => users.id),
  respondentId: integer("respondent_id").notNull().references(() => users.id),
  status: text("status").default("open").notNull(), // "open", "under_review", "resolved_release", "resolved_refund", "cancelled"
  reason: text("reason").notNull(),
  details: text("details").notNull(),
  evidenceUrls: jsonb("evidence_urls"), // Array of evidence file URLs
  moderatorId: integer("moderator_id").references(() => users.id),
  moderatorNotes: text("moderator_notes"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertDisputeSchema = createInsertSchema(disputes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
});

// Types for storage interfaces
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type UserCourse = typeof userCourses.$inferSelect;
export type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type AiMessage = typeof aiMessages.$inferSelect;
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;

export type Chat = typeof chats.$inferSelect;
export type InsertChat = z.infer<typeof insertChatSchema>;

export type ChatParticipant = typeof chatParticipants.$inferSelect;
export type InsertChatParticipant = z.infer<typeof insertChatParticipantSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Escrow = typeof escrows.$inferSelect;
export type InsertEscrow = z.infer<typeof insertEscrowSchema>;

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = z.infer<typeof insertDisputeSchema>;

export type KycProfile = typeof kycProfiles.$inferSelect;
export type InsertKycProfile = z.infer<typeof insertKycProfileSchema>;

export type KybProfile = typeof kybProfiles.$inferSelect;
export type InsertKybProfile = z.infer<typeof insertKybProfileSchema>;

export type BusinessEntity = typeof businessEntities.$inferSelect;
export type InsertBusinessEntity = z.infer<typeof insertBusinessEntitySchema>;

export type TwoFactorAuth = typeof twoFactorAuth.$inferSelect;
export type InsertTwoFactorAuth = z.infer<typeof insertTwoFactorAuthSchema>;
