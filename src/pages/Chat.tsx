
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
  },
  {
    keywords: ["back", "pain", "spine", "muscle", "joint"],
    response: "Your back pain could be related to muscle strain, poor posture, or underlying conditions affecting the spine or joints. For relief, try rest, gentle stretching, over-the-counter pain relievers like ibuprofen, and applying heat or ice to the affected area. Maintain good posture and consider ergonomic adjustments to your workspace. If pain is severe, radiates down your legs, or is accompanied by numbness or weakness, please seek medical attention promptly as these could indicate more serious issues."
  },
  {
    keywords: ["diet", "nutrition", "food", "healthy", "weight"],
    response: "For a balanced diet, focus on whole foods including plenty of fruits, vegetables, lean proteins, whole grains, and healthy fats. Stay hydrated with water and limit processed foods, added sugars, and excessive sodium. Consider portion control if weight management is your goal. For personalized nutrition advice, especially if you have specific health concerns or dietary restrictions, consulting with a registered dietitian would be beneficial to create a plan tailored to your individual needs."
  },
  {
    keywords: ["exercise", "workout", "fitness", "active", "training"],
    response: "A well-rounded fitness program should include cardiovascular exercise, strength training, and flexibility work. Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, plus muscle-strengthening activities twice weekly. Start gradually if you're new to exercise, and consider working with a fitness professional to create a safe, effective program. Remember to include proper warm-up and cool-down periods, and listen to your body to prevent injury. Stay hydrated and ensure adequate nutrition to support your activity level."
  },
  {
    keywords: ["mental health", "depression", "mood", "therapy", "psychiatrist"],
    response: "Mental health is just as important as physical health. If you're experiencing persistent low mood, loss of interest in activities, changes in sleep or appetite, or thoughts of self-harm, please reach out to a mental health professional. Treatment options include therapy, medication, lifestyle changes, and support groups. Many resources are available, including crisis hotlines for immediate support. Remember that seeking help is a sign of strength, and recovery is possible with appropriate treatment and support."
  },
  {
    keywords: ["allergies", "seasonal", "pollen", "dust", "pets"],
    response: "For allergy management, try to identify and avoid triggers when possible. Keep windows closed during high pollen seasons, use air purifiers with HEPA filters, and regularly clean dust-prone areas. Over-the-counter antihistamines, nasal sprays, and eye drops can provide symptom relief. For pet allergies, frequent handwashing after contact and keeping pets out of sleeping areas can help. If allergies significantly impact your quality of life despite these measures, consider seeing an allergist for possible immunotherapy options or prescription medications."
  },
  {
    keywords: ["vaccine", "immunization", "shot", "booster", "prevention"],
    response: "Vaccines are an important preventive health measure across the lifespan. They work by helping your immune system recognize and fight specific infectious diseases. Follow recommended immunization schedules for yourself and your family members, including annual flu vaccines and appropriate boosters throughout adulthood. If you're unsure about which vaccines you need, or have concerns about specific vaccines, discuss with your healthcare provider who can provide information based on your age, health conditions, and risk factors."
  },
  {
    keywords: ["pregnancy", "pregnant", "baby", "trimester", "prenatal"],
    response: "During pregnancy, focus on regular prenatal care, a nutritious diet rich in folate, iron, calcium and protein, and appropriate exercise as approved by your healthcare provider. Avoid alcohol, tobacco, and limit caffeine. Take prescribed prenatal vitamins and avoid medications without medical approval. Watch for warning signs like severe headache, vision changes, or vaginal bleeding which require immediate medical attention. Each pregnancy is unique, so personalized guidance from your healthcare provider is essential for your specific needs."
  },
  {
    keywords: ["diabetes", "blood sugar", "glucose", "insulin", "hyperglycemia"],
    response: "Diabetes management involves monitoring blood glucose levels, following a balanced diet, regular physical activity, and taking medications as prescribed. Work with your healthcare team to develop a personalized plan. Watch for symptoms of high blood sugar (excessive thirst, frequent urination, blurred vision) or low blood sugar (shakiness, confusion, sweating) and know how to address them. Regular check-ups are important to monitor for and prevent complications. Diabetes education programs can provide valuable support and information to help you effectively manage your condition."
  },
  {
    keywords: ["heart", "cardiac", "blood pressure", "cholesterol", "cardiovascular"],
    response: "For heart health, focus on a diet low in saturated fats, trans fats, sodium, and added sugars, while rich in fruits, vegetables, whole grains, and lean proteins. Regular exercise, stress management, adequate sleep, and avoiding tobacco are equally important. Monitor and control blood pressure, cholesterol, and blood sugar with the guidance of your healthcare provider. Know the warning signs of heart attack (chest pain/pressure, shortness of breath, pain in arms/back/jaw) and seek immediate emergency care if these occur. Regular check-ups are essential for early detection and management of cardiovascular risk factors."
  },
  {
    keywords: ["cancer", "tumor", "oncology", "screening", "chemotherapy"],
    response: "Cancer prevention includes maintaining a healthy lifestyle (balanced diet, regular exercise, limited alcohol, no tobacco), getting recommended screenings for early detection, and avoiding excessive sun exposure. Be aware of potential warning signs such as unexplained weight loss, persistent pain, unusual bleeding, or changes in skin moles. If you have concerns about specific symptoms or your cancer risk, please consult with a healthcare provider. If you've been diagnosed with cancer, work closely with your oncology team to understand your treatment options and available support resources."
  }
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your health assistant. I can answer questions about symptoms, medications, mental health, preventive care, and general wellness. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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
      // Fallback keyword search
      const userInput = userQuery.toLowerCase();
      let bestResponse = "Thank you for reaching out. Please consult a licensed medical doctor for personal health diagnosis.";
      for (const responseItem of healthResponses) {
        if (responseItem.keywords.some(keyword => userInput.includes(keyword))) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="24/7 AI Health Assistant - Medical Chat Support | Mr.Doc"
        description="Chat with our 24/7 AI health assistant for medical queries, guidance, and health information. Get instant support for your health concerns."
        keywords={["health chat", "AI assistant", "medical queries", "health guidance", "24/7 support"]}
      />
      <Navbar />
      
      <div className="flex-grow bg-health-gray">
        <motion.div 
          className="health-container max-w-4xl mx-auto py-8 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-health-primary mb-2">Health Assistant Chat</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ask any health-related questions and get instant responses from our AI health assistant.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 mr-3 bg-health-primary">
                <AvatarFallback>
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-health-primary">Health Assistant</h2>
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <div className="ml-auto flex items-center bg-blue-50 text-health-primary rounded-full px-3 py-1 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>AI Powered</span>
              </div>
            </div>
            
            <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 space-y-4 mb-4 rounded-lg bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 transition-all duration-300",
                      message.sender === 'user'
                        ? "bg-health-primary text-white hover:bg-blue-700"
                        : "bg-white border border-gray-200 text-gray-800 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'assistant' && (
                        <Avatar className="h-6 w-6 mt-0.5">
                          <AvatarFallback className="bg-health-secondary text-white">
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <Avatar className="h-6 w-6 mt-0.5">
                          <AvatarFallback className="bg-health-secondary text-white">
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200 text-gray-800">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your health question..."
                className="flex-1 min-h-[50px] resize-none transition-all duration-300 focus:border-health-primary"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button
                className="bg-health-primary hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center text-sm text-gray-500">
            <p>Note: This health assistant provides general information and is not a substitute for professional medical advice.</p>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Chat;