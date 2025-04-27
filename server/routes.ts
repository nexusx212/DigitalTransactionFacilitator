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

// Middleware to check if user exists in auth routes (simplified for demo)
const authenticateUser = async (req: Request, res: Response, next: Function) => {
  // In a real app, we would use sessions or JWT tokens
  // For simplicity, we'll use a mock user ID for now
  const userId = 1; // First user in our MemStorage
  
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
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
  
  // Users
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
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
      
      // Simulate AI response
      setTimeout(async () => {
        let responseText = "I don't have specific information about that yet. Would you like to know about listing products, customs documentation, or how trade finance works?";
        
        // Simple pattern matching for demo purposes
        const lowerText = text.toLowerCase();
        if (lowerText.includes("list a product") || lowerText.includes("marketplace")) {
          responseText = "To list a product on our marketplace, follow these steps:\n" +
            "1. Go to the Marketplace section\n" +
            "2. Click on 'Sell Products' button\n" +
            "3. Fill out the product details form\n" +
            "4. Upload high-quality images\n" +
            "5. Set your pricing and shipping options\n" +
            "6. Submit for verification\n\n" +
            "Your listing will be reviewed and published within 24 hours. Anything else you'd like to know?";
        } else if (lowerText.includes("customs doc") || lowerText.includes("documentation")) {
          responseText = "Customs documentation typically includes:\n" +
            "• Commercial Invoice: Details of goods and transaction\n" +
            "• Packing List: Itemized packaging details\n" +
            "• Certificate of Origin: Confirms where products were manufactured\n" +
            "• Bill of Lading/Airway Bill: Transport document and receipt\n" +
            "• Customs Declaration Form: Official documentation for authorities\n\n" +
            "Our Training section has a full course on customs documentation if you'd like to learn more!";
        } else if (lowerText.includes("trade finance") || lowerText.includes("financing")) {
          responseText = "Trade finance bridges the gap between exporters and importers by providing funding and risk mitigation. In DTFS, we offer:\n" +
            "• Invoice Financing: Get immediate funds against outstanding invoices\n" +
            "• Purchase Order Financing: Secure capital to fulfill large orders\n" +
            "• Supply Chain Financing: Optimize working capital throughout the supply chain\n\n" +
            "Would you like to apply for any specific type of financing?";
        }
        
        const aiResponse = insertAiMessageSchema.parse({
          userId: user.id,
          sender: "ai",
          text: responseText,
          timestamp: new Date(),
          language
        });
        
        await storage.createAiMessage(aiResponse);
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

  return httpServer;
}
