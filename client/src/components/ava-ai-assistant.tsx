import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "@/context/app-context";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  suggestions?: string[];
};

const MAX_MESSAGES = 50;

export default function AvaAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I'm Ava, your AI assistant for digital trade and finance. How can I help you today?",
      timestamp: new Date(),
      suggestions: [
        "How do I list a product?",
        "Explain trade finance",
        "What courses are available?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedLanguage, isOfflineMode } = useContext(AppContext);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent, suggestedText?: string) => {
    if (e) {
      e.preventDefault();
    }
    
    const messageText = suggestedText || inputValue;
    if (!messageText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let responseText = "";
      let suggestions: string[] = [];
      
      // Predefined responses based on user queries
      if (messageText.toLowerCase().includes("list a product") || messageText.toLowerCase().includes("sell product")) {
        responseText = "To list a product on our marketplace, follow these steps:\n" +
          "1. Go to the Marketplace section\n" +
          "2. Click on 'Sell Products' button\n" +
          "3. Fill out the product details form\n" +
          "4. Upload high-quality images\n" +
          "5. Set your pricing and shipping options\n" +
          "6. Submit for verification\n\n" +
          "Your listing will be reviewed and published within 24 hours.";
        suggestions = ["What fees are involved?", "How long does verification take?", "Can I edit my listing?"];
      } 
      else if (messageText.toLowerCase().includes("customs") || messageText.toLowerCase().includes("documentation")) {
        responseText = "Customs documentation typically includes:\n" +
          "• Commercial Invoice: Details of goods and transaction\n" +
          "• Packing List: Itemized packaging details\n" +
          "• Certificate of Origin: Confirms where products were manufactured\n" +
          "• Bill of Lading/Airway Bill: Transport document and receipt\n" +
          "• Customs Declaration Form: Official documentation for authorities\n\n" +
          "Our Training section has a full course on customs documentation if you'd like to learn more!";
        suggestions = ["Show me the customs course", "What is HS coding?", "Explain duties and taxes"];
      } 
      else if (messageText.toLowerCase().includes("trade finance") || messageText.toLowerCase().includes("financing")) {
        responseText = "Trade finance bridges the gap between exporters and importers by providing funding and risk mitigation. In DTFS, we offer:\n" +
          "• Invoice Financing: Get immediate funds against outstanding invoices\n" +
          "• Purchase Order Financing: Secure capital to fulfill large orders\n" +
          "• Supply Chain Financing: Optimize working capital throughout the supply chain\n\n" +
          "Would you like to apply for any specific type of financing?";
        suggestions = ["How does invoice financing work?", "What are the interest rates?", "Tell me about smart contracts"];
      }
      else if (messageText.toLowerCase().includes("courses") || messageText.toLowerCase().includes("training")) {
        responseText = "We offer several training courses to help you excel in international trade:\n" +
          "• Export Documentation Mastery (Beginner)\n" +
          "• International Payment Methods (Intermediate)\n" +
          "• Supply Chain Optimization (Advanced)\n" +
          "• Digital Trade Finance (Advanced)\n" +
          "• Marketplace Success Strategies (Beginner)\n\n" +
          "All courses include certificates upon completion and practical exercises.";
        suggestions = ["Are courses free?", "How long do courses take?", "Tell me about certificates"];
      }
      else {
        responseText = "I don't have specific information about that yet. Would you like to know about one of these topics?";
        suggestions = ["Listing products", "Trade finance options", "Available training courses", "Digital wallet features"];
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: "ai",
        text: responseText,
        timestamp: new Date(),
        suggestions
      };
      
      setMessages(prev => {
        // Limit the number of messages to prevent memory issues
        const updatedMessages = [...prev, aiMessage];
        if (updatedMessages.length > MAX_MESSAGES) {
          return updatedMessages.slice(updatedMessages.length - MAX_MESSAGES);
        }
        return updatedMessages;
      });
      
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(undefined, suggestion);
  };

  // Format timestamp to show time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-24 lg:bottom-8 right-4 md:right-8 z-50">
      <div className="flex flex-col items-end">
        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl mb-4 w-[320px] md:w-[380px] max-h-[550px] flex flex-col overflow-hidden transition-all duration-normal"
            >
              <div className="gradient-primary px-4 py-3 flex items-center justify-between text-white">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 shadow-sm">
                    <span className="material-icons">smart_toy</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Ava AI Assistant</h3>
                    <div className="flex items-center text-xs text-white/80">
                      {isOfflineMode ? (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-warning mr-1.5 animate-pulse"></span>
                          <span>Offline Mode</span>
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-success mr-1.5"></span>
                          <span>Online</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-normal"
                    onClick={() => {
                      // Reset chat
                      setMessages([{
                        id: "welcome",
                        sender: "ai",
                        text: "Hello! I'm Ava, your AI assistant for digital trade and finance. How can I help you today?",
                        timestamp: new Date(),
                        suggestions: [
                          "How do I list a product?",
                          "Explain trade finance",
                          "What courses are available?"
                        ]
                      }]);
                    }}
                  >
                    <span className="material-icons text-[20px]">refresh</span>
                  </button>
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-normal"
                    onClick={toggleChat}
                  >
                    <span className="material-icons text-[20px]">close</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-start gap-3 mb-1 max-w-[90%]">
                      {message.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0">
                          <span className="material-icons text-[16px]">smart_toy</span>
                        </div>
                      )}
                      
                      <div 
                        className={`${
                          message.sender === 'user' 
                            ? 'bg-primary text-white rounded-2xl rounded-tr-none' 
                            : 'bg-white border border-neutral-200 rounded-2xl rounded-tl-none shadow-sm'
                        } py-3 px-4 max-w-full`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 shadow-sm flex-shrink-0">
                          <span className="material-icons text-[16px]">person</span>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`text-[10px] text-neutral-500 px-3 ${
                        message.sender === 'user' ? 'pr-11 text-right' : 'pl-11'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="pl-11 mt-2 flex flex-wrap gap-2 max-w-[90%]">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="bg-white text-xs text-primary border border-primary/20 rounded-full px-3 py-1 hover:bg-primary-light transition-all duration-normal truncate max-w-[200px]"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm mr-3 flex-shrink-0">
                      <span className="material-icons text-[16px]">smart_toy</span>
                    </div>
                    <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-none shadow-sm py-3 px-4">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-neutral-300 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-neutral-300 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                        <div className="h-2 w-2 bg-neutral-300 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="border-t border-neutral-100 p-3 bg-white">
                <form className="flex items-center" onSubmit={handleSendMessage}>
                  <input 
                    type="text" 
                    className="flex-1 border border-neutral-200 bg-neutral-50 focus:bg-white rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-normal" 
                    placeholder="Type your question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isTyping}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="ml-2 bg-primary hover:bg-primary-dark text-white rounded-xl w-10 h-10 transition-all duration-normal"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <span className="material-icons text-[20px]">send</span>
                  </Button>
                </form>
                <div className="flex items-center justify-between mt-2 px-1">
                  <div className="flex items-center text-xs text-neutral-500">
                    <span className="material-icons text-xs mr-1">language</span>
                    <span>{selectedLanguage.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center text-xs text-neutral-500">
                    <span className="mr-1">Powered by</span>
                    <span className="font-medium">OpenAI</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Chat Bubble */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="gradient-primary hover:shadow-lg text-white w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-normal"
          onClick={toggleChat}
          aria-label="Chat with Ava AI Assistant"
        >
          <span className="material-icons">
            {isOpen ? "close" : "smart_toy"}
          </span>
          {!isOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
