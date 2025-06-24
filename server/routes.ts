import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertInvoiceSchema, 
  insertTransactionSchema, 
  insertAiMessageSchema,
  insertUserCourseSchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";
import OpenAI from "openai";

// Initialize OpenAI (optional)
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.warn("OpenAI initialization failed, AI features will be disabled:", error);
}

// Middleware for Firebase authentication
const authenticateUser = async (req: Request, res: Response, next: Function) => {
  // For Firebase authentication, we would verify the Firebase ID token here
  // For now, we'll use a simplified approach since Firebase handles client-side auth
  // In production, you would verify the Firebase ID token from the Authorization header
  
  try {
    // Extract Firebase UID from headers (set by client)
    const firebaseUid = req.headers['x-firebase-uid'] as string;
    
    if (!firebaseUid) {
      return res.status(401).json({ message: "Unauthorized - Firebase UID required" });
    }
    
    // Find user by Firebase UID
    const users = await storage.getAllUsers();
    const user = users.find(u => u.firebaseUid === firebaseUid);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API Routes
  
  // Firebase-based user management
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user by Firebase UID
  app.get("/api/user/:firebaseUid", async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const users = await storage.getAllUsers();
      const user = users.find(u => u.firebaseUid === firebaseUid);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Trade Finance
  app.get("/api/invoices", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const invoices = await storage.getInvoicesByUserId(user.id);
      res.status(200).json(invoices);
    } catch (error) {
      console.error("Get invoices error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/invoices", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const data = insertInvoiceSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const invoice = await storage.createInvoice(data);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create invoice error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/invoices/:id", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const invoiceId = parseInt(req.params.id);
      
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // Check if invoice belongs to user
      if (invoice.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.status(200).json(invoice);
    } catch (error) {
      console.error("Get invoice error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Product Categories
  app.get("/api/product-categories", async (req, res) => {
    try {
      const categories = await storage.getAllProductCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      
      let products;
      if (category && typeof category === 'string') {
        const categoryObj = await storage.getProductCategoryBySlug(category);
        if (categoryObj) {
          products = await storage.getProductsByCategory(categoryObj.id);
        } else {
          products = [];
        }
      } else {
        products = await storage.getAllProducts();
      }
      
      res.status(200).json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/products/my", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const products = await storage.getProductsByUserId(user.id);
      res.status(200).json(products);
    } catch (error) {
      console.error("Get user products error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/products", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const productData = {
        ...req.body,
        userId: user.id
      };
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Product Categories
  app.get("/api/product-categories", async (req, res) => {
    try {
      const categories = await storage.getAllProductCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Get product categories error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }
      
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.status(200).json(course);
    } catch (error) {
      console.error("Get course error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User Courses
  app.get("/api/user-courses", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const userCourses = await storage.getUserCoursesByUserId(user.id);
      
      // Get full course details for each user course
      const coursesWithDetails = await Promise.all(
        userCourses.map(async (userCourse) => {
          const course = await storage.getCourse(userCourse.courseId);
          return {
            ...userCourse,
            course
          };
        })
      );
      
      res.status(200).json(coursesWithDetails);
    } catch (error) {
      console.error("Get user courses error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user-courses", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const { courseId } = req.body;
      
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
      }
      
      // Check if course exists
      const course = await storage.getCourse(parseInt(courseId));
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user already enrolled in course
      const existingUserCourse = await storage.getUserCourse(user.id, course.id);
      
      if (existingUserCourse) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      const data = insertUserCourseSchema.parse({
        userId: user.id,
        courseId: course.id,
        progress: 0,
        completed: false,
        certificateIssued: false,
        startDate: new Date(),
        lastAccessDate: new Date()
      });
      
      const userCourse = await storage.createUserCourse(data);
      res.status(201).json(userCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create user course error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/user-courses/:id", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const userCourseId = parseInt(req.params.id);
      
      if (isNaN(userCourseId)) {
        return res.status(400).json({ message: "Invalid user course ID" });
      }
      
      const userCourse = await storage.getUserCourse(user.id, userCourseId);
      
      if (!userCourse) {
        return res.status(404).json({ message: "User course not found" });
      }
      
      // Update progress
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Invalid progress value" });
      }
      
      const updatedUserCourse = await storage.updateUserCourse(userCourse.id, {
        progress,
        completed: progress === 100,
        certificateIssued: progress === 100,
        lastAccessDate: new Date()
      });
      
      res.status(200).json(updatedUserCourse);
    } catch (error) {
      console.error("Update user course error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Wallets
  app.get("/api/wallets", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const wallets = await storage.getWalletsByUserId(user.id);
      res.status(200).json(wallets);
    } catch (error) {
      console.error("Get wallets error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transactions
  app.get("/api/transactions", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const transactions = await storage.getTransactionsByUserId(user.id);
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/transactions", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const { amount, currency, type, description, transactionType } = req.body;
      
      if (!amount || !currency || !type || !description || !transactionType) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const data = insertTransactionSchema.parse({
        userId: user.id,
        amount,
        currency,
        type,
        description,
        transactionType,
        date: new Date(),
        status: "completed"
      });
      
      // Check if user has sufficient balance for 'sent' transactions
      if (type === 'sent') {
        const wallets = await storage.getWalletsByUserId(user.id);
        const wallet = wallets.find(w => w.currency === currency);
        
        if (!wallet || wallet.balance < amount) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        
        // Update wallet balance
        await storage.updateWallet(wallet.id, {
          balance: Number(wallet.balance) - Number(amount)
        });
      } else if (type === 'received' || type === 'exchanged') {
        const wallets = await storage.getWalletsByUserId(user.id);
        const wallet = wallets.find(w => w.currency === currency);
        
        if (wallet) {
          // Update wallet balance
          await storage.updateWallet(wallet.id, {
            balance: Number(wallet.balance) + Number(amount)
          });
        }
      }
      
      const transaction = await storage.createTransaction(data);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create transaction error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Assistant
  app.get("/api/ai-messages", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const messages = await storage.getAiMessagesByUserId(user.id);
      res.status(200).json(messages);
    } catch (error) {
      console.error("Get AI messages error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ai-messages", authenticateUser, async (req, res) => {
    try {
      const user = (req as any).user;
      const { text, language = "en" } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Message text is required" });
      }
      
      // Create user message
      const data = insertAiMessageSchema.parse({
        userId: user.id,
        sender: "user",
        text,
        timestamp: new Date(),
        language
      });
      
      await storage.createAiMessage(data);
      
      // Generate AI response (if OpenAI is available)
      if (openai) {
        try {
          const systemPrompt = `You are Ava, an AI assistant for DTFS (Digital Trade and Financial Services), a comprehensive trade finance platform. You help users with:

1. Trade Finance: Invoice factoring, export finance, supply chain finance, import finance, non-interest finance, startup trade finance
2. Marketplace: Product listings, buyer-seller connections, product categories
3. Digital Wallet: Multi-currency support, stablecoins (USDT, USDC, DAI, BUSD, FRAX), PAPSS payments
4. Trade Management: Order tracking, contracts, shipment monitoring
5. Training: Trade finance courses, customs documentation, international trade
6. Platform Navigation: How to use various features

Be helpful, professional, and concise. Provide specific guidance about DTFS features. If asked about technical issues, guide users to appropriate sections of the platform.`;

          const completion = await openai!.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: text }
            ],
            max_tokens: 500,
            temperature: 0.7
          });

          const responseText = completion.choices[0].message.content || "I apologize, but I'm having trouble generating a response right now. Please try again.";
          
          const aiResponse = insertAiMessageSchema.parse({
            userId: user.id,
            sender: "ai",
            text: responseText,
            timestamp: new Date(),
            language
          });
          
          await storage.createAiMessage(aiResponse);
        } catch (openaiError) {
          console.error("OpenAI API error:", openaiError);
          
          // Fallback response if OpenAI fails
          const fallbackResponse = insertAiMessageSchema.parse({
            userId: user.id,
            sender: "ai",
            text: "I'm currently experiencing some technical difficulties. Please try again in a moment, or contact support if the issue persists.",
            timestamp: new Date(),
            language
          });
          
          await storage.createAiMessage(fallbackResponse);
        }
      } else {
        // OpenAI not configured - provide fallback response
        const fallbackResponse = insertAiMessageSchema.parse({
          userId: user.id,
          sender: "ai",
          text: "AI assistant is currently not configured. Please contact support to enable AI features.",
          timestamp: new Date(),
          language
        });
        
        await storage.createAiMessage(fallbackResponse);
      }
      
      setTimeout(async () => {
        // This completes the async AI response generation
      }, 1000);
      
      res.status(201).json({ success: true, message: "Message received" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create AI message error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // PAPSS Payment Gateway Integration
  app.post("/api/payments/papss/initiate", authenticateUser, async (req, res) => {
    try {
      const { amount, currency, recipientBank, recipientAccount, purpose, reference } = req.body;
      
      if (!amount || !currency || !recipientBank || !recipientAccount) {
        return res.status(400).json({ message: "Missing required payment fields" });
      }
      
      // PAPSS payment initiation
      const paymentRequest = {
        transactionId: `PAPSS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat(amount),
        currency,
        senderAccount: "DTFS_MAIN_ACCOUNT",
        recipientBank,
        recipientAccount,
        purpose: purpose || "Trade Finance Payment",
        reference: reference || `DTFS_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: "initiated"
      };
      
      // In a real implementation, you would call the PAPSS API here
      // For now, we'll simulate the response
      const papssResponse = {
        success: true,
        transactionId: paymentRequest.transactionId,
        status: "pending",
        estimatedSettlement: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        fees: {
          papssNetworkFee: amount * 0.001, // 0.1% network fee
          currencyConversionFee: currency !== "USD" ? amount * 0.005 : 0
        }
      };
      
      // Store transaction in our system
      const transactionData = {
        userId: (req as any).user.id,
        type: "papss_payment",
        amount: amount.toString(),
        currency,
        description: `PAPSS payment to ${recipientBank}`,
        transactionType: "debit",
        status: "pending",
        reference: paymentRequest.transactionId
      };
      
      await storage.createTransaction(transactionData);
      
      res.json(papssResponse);
    } catch (error) {
      console.error("PAPSS payment initiation error:", error);
      res.status(500).json({ message: "Payment initiation failed" });
    }
  });

  app.get("/api/payments/papss/status/:transactionId", authenticateUser, async (req, res) => {
    try {
      const { transactionId } = req.params;
      
      // In a real implementation, you would query the PAPSS API for transaction status
      // For now, we'll simulate different statuses based on transaction age
      const transaction = await storage.getTransactionsByUserId((req as any).user.id);
      const foundTransaction = transaction.find(t => t.reference === transactionId);
      
      if (!foundTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      // Simulate status progression
      const createdTime = new Date(foundTransaction.createdAt).getTime();
      const currentTime = Date.now();
      const timeDiff = currentTime - createdTime;
      
      let status = "pending";
      if (timeDiff > 10000) { // After 10 seconds, mark as processing
        status = "processing";
      }
      if (timeDiff > 30000) { // After 30 seconds, mark as completed
        status = "completed";
      }
      
      res.json({
        transactionId,
        status,
        amount: foundTransaction.amount,
        currency: foundTransaction.currency,
        timestamp: foundTransaction.createdAt,
        settlementTime: status === "completed" ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error("PAPSS status check error:", error);
      res.status(500).json({ message: "Status check failed" });
    }
  });

  // Chat operations
  app.get("/api/chats", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const chats = await storage.getChatsByUserId(user.id);
      
      // Enrich chats with participant info and last message
      const enrichedChats = await Promise.all(chats.map(async (chat) => {
        const participants = await storage.getChatParticipantsByChatId(chat.id);
        const messages = await storage.getChatMessagesByChatId(chat.id, 1);
        const lastMessage = messages.length > 0 ? messages[0] : null;
        
        // Get participant user details
        const participantUsers = await Promise.all(
          participants.map(async (p) => {
            const participantUser = await storage.getUser(p.userId);
            return {
              id: participantUser?.id.toString() || '',
              name: participantUser?.name || 'Unknown User',
              role: participantUser?.role || 'buyer',
              isOnline: p.isOnline || false,
              lastSeen: p.lastSeenAt,
              language: participantUser?.language || 'en'
            };
          })
        );

        // Calculate unread count
        const allMessages = await storage.getChatMessagesByChatId(chat.id);
        const unreadMessages = allMessages.filter(m => m.senderId !== user.id && !m.isRead);

        return {
          id: chat.id.toString(),
          name: chat.name,
          type: chat.type,
          participants: participantUsers,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            sender: lastMessage.senderName || 'Unknown',
            timestamp: lastMessage.createdAt,
            isRead: lastMessage.isRead || false
          } : null,
          unreadCount: unreadMessages.length,
          tradeId: chat.tradeId?.toString(),
          isActive: chat.isActive
        };
      }));
      
      res.json(enrichedChats);
    } catch (error) {
      console.error("Get chats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/chats", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const chat = await storage.createChat({
        ...req.body,
        createdBy: user.id
      });
      
      // Add creator as participant
      await storage.createChatParticipant({
        chatId: chat.id,
        userId: user.id,
        role: 'admin',
        isOnline: true,
        joinedAt: new Date()
      });
      
      res.status(201).json(chat);
    } catch (error: any) {
      console.error("Create chat error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Chat messages
  app.get("/api/chats/:chatId/messages", authenticateUser, async (req: Request, res: Response) => {
    try {
      const { chatId } = req.params;
      const { limit = 50, before } = req.query;
      
      const messages = await storage.getChatMessagesByChatId(
        parseInt(chatId), 
        parseInt(limit as string), 
        before ? parseInt(before as string) : undefined
      );
      res.json(messages);
    } catch (error: any) {
      console.error("Get chat messages error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/chats/:chatId/messages", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { chatId } = req.params;
      
      const message = await storage.createChatMessage({
        chatId: parseInt(chatId),
        senderId: user.id,
        senderName: user.name,
        content: req.body.content,
        messageType: req.body.messageType || 'text',
        language: req.body.language || 'en'
      });
      
      res.status(201).json(message);
    } catch (error: any) {
      console.error("Create chat message error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/payments/papss/webhook", async (req, res) => {
    try {
      // PAPSS webhook handler for payment status updates
      const { transactionId, status, settlementAmount, fees } = req.body;
      
      // Verify webhook signature (in real implementation)
      // const signature = req.headers['x-papss-signature'];
      
      // Find and update transaction
      const allUsers = await storage.getAllUsers();
      for (const user of allUsers) {
        const transactions = await storage.getTransactionsByUserId(user.id);
        const transaction = transactions.find(t => t.reference === transactionId);
        
        if (transaction) {
          // Update transaction status
          await storage.updateTransaction(transaction.id, {
            status: status === "settled" ? "completed" : status,
            updatedAt: new Date()
          });
          break;
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("PAPSS webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // AI Assistant endpoints
  app.get("/api/ai/messages", authenticateUser, async (req, res) => {

    try {
      const messages = await storage.getAiMessagesByUserId((req as any).user.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching AI messages:", error);
      res.status(500).json({ error: "Failed to fetch AI messages" });
    }
  });

  app.post("/api/ai/messages", authenticateUser, async (req, res) => {

    try {
      const { text, language = 'en' } = req.body;
      const userId = (req as any).user.id;

      // Store user message
      const userMessage = await storage.createAiMessage({
        userId,
        sender: 'user',
        text,
        timestamp: new Date(),
        language
      });

      // Generate AI response (if OpenAI is available)
      let aiMessage;
      if (openai) {
        try {
          const systemPrompt = `You are Ava, an AI assistant for DTFS (Digital Trade Finance System). You help users with:
          - Trade finance options (factoring, export finance, supply chain finance, import finance, non-interest finance, startup trade finance)
          - Marketplace navigation and product listings
          - Training resources and courses
          - Digital wallet and payment guidance
          - P2P trading and dispute resolution
          - PAPSS payment system information
          
          Keep responses helpful, concise, and professional. Focus on trade finance and platform features.`;

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: text }
            ],
            max_tokens: 500,
            temperature: 0.7
          });

          const aiResponseText = response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";

          // Store AI response
          aiMessage = await storage.createAiMessage({
            userId,
            sender: 'ai',
            text: aiResponseText,
            timestamp: new Date(),
            language
          });
        } catch (openaiError) {
          console.error("OpenAI API error:", openaiError);
          
          // Store fallback response
          aiMessage = await storage.createAiMessage({
            userId,
            sender: 'ai',
            text: "I'm currently experiencing some technical difficulties. Please try again in a moment, or contact support if the issue persists.",
            timestamp: new Date(),
            language
          });
        }
      } else {
        // OpenAI not configured - provide fallback response
        aiMessage = await storage.createAiMessage({
          userId,
          sender: 'ai',
          text: "AI assistant is currently not configured. Please contact support to enable AI features.",
          timestamp: new Date(),
          language
        });
      }

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error processing AI message:", error);
      res.status(500).json({ error: "Failed to process AI message" });
    }
  });

  return httpServer;
}
