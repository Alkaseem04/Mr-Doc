import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X, MinusCircle, Maximize2, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from '@/services/apiService';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

// Enhanced responses for the health assistant
const healthResponses = [
  {
    keywords: ["headache", "head", "pain", "migraine"],
    response: "Based on your description of headache symptoms, this could be due to several causes including tension, migraine, or sinus issues. Try resting in a dark, quiet room, stay hydrated, and consider over-the-counter pain relievers like ibuprofen or acetaminophen. If headaches are severe, persistent, or accompanied by other symptoms like fever or stiff neck, please consult a healthcare provider."
  },
  {
    keywords: ["cold", "flu", "fever", "cough", "sore throat"],
    response: "Your symptoms sound like they could be due to a common cold or flu. Rest, hydration, and over-the-counter medications for symptom relief are recommended. For cold and flu: drink plenty of fluids, use saline nasal sprays, and take acetaminophen or ibuprofen for fever and pain. If symptoms worsen or persist beyond a week, or if you develop difficulty breathing, please seek medical attention."
  },
  {
    keywords: ["stomach", "nausea", "vomit", "diarrhea", "food"],
    response: "Your digestive symptoms could be related to gastroenteritis, food poisoning, or other gastrointestinal issues. I recommend staying hydrated with clear liquids, trying the BRAT diet (bananas, rice, applesauce, toast), and avoiding dairy, spicy, or fatty foods temporarily. If you notice blood in stool or vomit, severe abdominal pain, or symptoms persisting beyond 48 hours, please consult a healthcare professional immediately."
  },
  {
    keywords: ["skin", "rash", "itchy", "allergy", "hives"],
    response: "The skin symptoms you're describing could be related to an allergic reaction, contact dermatitis, or other skin conditions. For temporary relief, try a cool compress, over-the-counter antihistamines, or hydrocortisone cream for itching. Avoid potential allergens and irritants. If the rash is spreading rapidly, accompanied by difficulty breathing, or if you develop fever or blisters, seek immediate medical attention as these could indicate a more serious condition."
  },
  {
    keywords: ["tired", "fatigue", "exhausted", "energy", "sleep"],
    response: "Persistent fatigue can be caused by many factors including poor sleep, stress, vitamin deficiencies, or underlying medical conditions. Try improving sleep hygiene, managing stress, ensuring adequate hydration, and eating a balanced diet rich in iron, B vitamins, and protein. If fatigue persists despite lifestyle changes, or is accompanied by other symptoms like unexplained weight loss or fever, please consult with a healthcare provider for a thorough evaluation."
  },
  {
    keywords: ["anxiety", "stress", "panic", "worry", "nervous"],
    response: "What you're describing sounds like symptoms of anxiety or stress. Try relaxation techniques such as deep breathing, meditation, or progressive muscle relaxation. Regular exercise, adequate sleep, and limiting caffeine and alcohol can also help manage anxiety. If your symptoms are severe, interfere with daily functioning, or include panic attacks, please consider speaking with a mental health professional who can provide appropriate treatment options including therapy or medication if needed."
  }
];

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your health assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userQuery = inputMessage;
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: userQuery,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const data = await apiService.post('/chat', { message: userQuery });
      const assistantMessage: Message = {
        id: Date.now(),
        text: data.reply || "For specific medical concerns, please consult a physician.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Fallback matching
      let bestResponse = "Thank you for reaching out. Please consult a licensed medical doctor for personal health diagnosis.";
      for (const responseItem of healthResponses) {
        if (responseItem.keywords.some(keyword => userQuery.toLowerCase().includes(keyword))) {
          bestResponse = responseItem.response;
          break;
        }
      }
      setMessages((prev) => [...prev, {
        id: Date.now(),
        text: bestResponse,
        sender: 'assistant',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  const buttonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 15 } },
    hover: { scale: 1.1, backgroundColor: "hsl(var(--primary))", boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" },
    tap: { scale: 0.95 }
  };

  const chatWindowVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 20, stiffness: 300 } },
    exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }
  };

  const minimizedVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 300 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <>
      {/* Chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            onClick={toggleChat}
            className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            exit={{ scale: 0, opacity: 0 }}
          >
            <MessageSquare className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Chat widget */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed right-6 bottom-6 z-50">
            <AnimatePresence mode="wait">
              {isMinimized ? (
                <motion.div 
                  key="minimized"
                  className="w-72"
                  variants={minimizedVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="w-full shadow-xl border-primary border-t-4 bg-card">
                    <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-card">
                      <div className="flex items-center">
                        <span className="font-semibold text-primary">Health Assistant</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={maximizeChat} className="hover:bg-muted">
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleChat} className="hover:bg-muted">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ) : (
                <motion.div 
                  key="chat"
                  className="w-full max-w-md"
                  variants={chatWindowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="h-[500px] flex flex-col shadow-xl border-border bg-card">
                    <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-card">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>HA</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground">Health Assistant</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={minimizeChat} className="hover:bg-muted">
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleChat} className="hover:bg-muted">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 overflow-y-auto p-4 bg-background">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "flex",
                              message.sender === 'user' ? "justify-end" : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg p-3",
                                message.sender === 'user'
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              )}
                            >
                              <div className="flex items-start">
                                {message.sender === 'assistant' && (
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>HA</AvatarFallback>
                                  </Avatar>
                                )}
                                <p className="text-sm">{message.text}</p>
                                {message.sender === 'user' && (
                                  <Avatar className="h-6 w-6 ml-2">
                                    <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                        
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="bg-muted text-foreground rounded-lg p-3">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>HA</AvatarFallback>
                                </Avatar>
                                <div className="flex space-x-1">
                                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 border-t bg-card">
                      <div className="flex w-full items-end space-x-2">
                        <Textarea
                          placeholder="Type your health question..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="min-h-[40px] max-h-[120px] resize-none border-input bg-background text-foreground"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isTyping}
                          className="health-button p-3"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;