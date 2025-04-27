import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "@/context/app-context";
import { AnimatePresence, motion } from "framer-motion";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
};

const MAX_MESSAGES = 50;

export default function AvaAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I'm Ava, your AI assistant. How can I help you with trade finance or marketplace questions today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedLanguage } = useContext(AppContext);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        "How do I list a product on the marketplace?": 
          "To list a product on our marketplace, follow these steps:\n" +
          "1. Go to the Marketplace section\n" +
          "2. Click on 'Sell Products' button\n" +
          "3. Fill out the product details form\n" +
          "4. Upload high-quality images\n" +
          "5. Set your pricing and shipping options\n" +
          "6. Submit for verification\n\n" +
          "Your listing will be reviewed and published within 24 hours. Anything else you'd like to know?",
        
        "Explain customs docs": 
          "Customs documentation typically includes:\n" +
          "• Commercial Invoice: Details of goods and transaction\n" +
          "• Packing List: Itemized packaging details\n" +
          "• Certificate of Origin: Confirms where products were manufactured\n" +
          "• Bill of Lading/Airway Bill: Transport document and receipt\n" +
          "• Customs Declaration Form: Official documentation for authorities\n\n" +
          "Our Training section has a full course on customs documentation if you'd like to learn more!",
        
        "How does trade finance work?":
          "Trade finance bridges the gap between exporters and importers by providing funding and risk mitigation. In DTFS, we offer:\n" +
          "• Invoice Financing: Get immediate funds against outstanding invoices\n" +
          "• Purchase Order Financing: Secure capital to fulfill large orders\n" +
          "• Supply Chain Financing: Optimize working capital throughout the supply chain\n\n" +
          "Would you like to apply for any specific type of financing?"
      };
      
      let responseText = aiResponses[userMessage.text] || 
        "I don't have specific information about that yet. Would you like to know about listing products, customs documentation, or how trade finance works?";
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: "ai",
        text: responseText,
        timestamp: new Date()
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

  return (
    <div className="fixed bottom-24 lg:bottom-8 right-8 z-50">
      <div className="flex flex-col items-end">
        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-lg mb-4 w-80 max-h-96 overflow-hidden transition-all duration-300 ease-in-out"
            >
              <div className="bg-primary-500 px-4 py-3 flex items-center justify-between text-white">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="material-icons">smart_toy</span>
                  </div>
                  <h3 className="font-medium">Ava AI Assistant</h3>
                </div>
                <button 
                  className="text-white/80 hover:text-white"
                  onClick={toggleChat}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
              
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex items-start ${message.sender === 'user' ? 'justify-end' : 'mb-4'}`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 mr-3 flex-shrink-0">
                        <span className="material-icons text-sm">smart_toy</span>
                      </div>
                    )}
                    
                    <div 
                      className={`${
                        message.sender === 'user' 
                          ? 'bg-primary-500 text-white rounded-lg rounded-tr-none' 
                          : 'bg-neutral-100 rounded-lg rounded-tl-none'
                      } p-3 max-w-[80%]`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center ml-3 flex-shrink-0">
                        <span className="material-icons text-sm text-neutral-500">person</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 mr-3 flex-shrink-0">
                      <span className="material-icons text-sm">smart_toy</span>
                    </div>
                    <div className="bg-neutral-100 rounded-lg rounded-tl-none p-3">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="border-t border-neutral-200 p-3">
                <form className="flex items-center" onSubmit={handleSendMessage}>
                  <input 
                    type="text" 
                    className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                    placeholder="Type your question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isTyping}
                  />
                  <button 
                    type="submit" 
                    className="ml-2 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <span className="material-icons">send</span>
                  </button>
                </form>
                <div className="flex items-center justify-between mt-2 px-1">
                  <div className="flex items-center text-xs text-neutral-500">
                    <span className="material-icons text-xs mr-1">language</span>
                    <span>{selectedLanguage.toUpperCase()}</span>
                    <span className="material-icons text-xs mx-1">expand_more</span>
                  </div>
                  <p className="text-xs text-neutral-500">Powered by OpenAI</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Chat Bubble */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-500 hover:bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
          onClick={toggleChat}
        >
          <span className="material-icons">
            {isOpen ? "close" : "smart_toy"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
