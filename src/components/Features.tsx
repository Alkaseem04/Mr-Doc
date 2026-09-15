import React from 'react';
import { HeartPulse, Pill, Brain, Stethoscope, Activity, Calendar, Phone, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: <HeartPulse className="h-12 w-12 p-2 rounded-full bg-red-100 text-health-accent" />,
      title: "Advanced Symptom Analysis",
      description: "Our AI-powered system analyzes your symptoms and provides personalized insights based on medical knowledge."
    },
    {
      icon: <Pill className="h-12 w-12 p-2 rounded-full bg-blue-100 text-health-primary" />,
      title: "Medication Information",
      description: "Get detailed information about medications, including uses, side effects, and proper dosage guidelines."
    },
    {
      icon: <Stethoscope className="h-12 w-12 p-2 rounded-full bg-green-100 text-health-green" />,
      title: "Condition Database",
      description: "Access a comprehensive database of medical conditions with detailed explanations and treatment options."
    },
    {
      icon: <Brain className="h-12 w-12 p-2 rounded-full bg-purple-100 text-purple-500" />,
      title: "AI Health Assistant",
      description: "Chat with our AI health assistant for instant answers to your health-related questions, available 24/7."
    },
    {
      icon: <Activity className="h-12 w-12 p-2 rounded-full bg-orange-100 text-orange-500" />,
      title: "Health Tracking",
      description: "Monitor your health trends and patterns over time to gain insights into your overall wellbeing."
    },
    {
      icon: <Calendar className="h-12 w-12 p-2 rounded-full bg-indigo-100 text-indigo-500" />,
      title: "Medication Reminders",
      description: "Set up reminders to never miss a dose of your medications and maintain your treatment schedule."
    },
    {
      icon: <Phone className="h-12 w-12 p-2 rounded-full bg-red-100 text-red-500" />,
      title: "Emergency Services",
      description: "Immediate access to emergency contacts and nearest hospitals with one-click calling and map integration."
    }
  ];

  // Animation variants for arrows
  const arrowVariants = {
    animate: {
      x: [0, 5, 0],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="health-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our health assistant provides a comprehensive set of tools to help you manage your health with confidence.
          </p>
        </div>
        
        {/* Animated arrows pointing to features */}
        <div className="relative mb-8">
          <div className="hidden md:block absolute top-1/2 left-1/4 transform -translate-y-1/2 -translate-x-1/2">
            <motion.div
              variants={arrowVariants}
              animate="animate"
              className="flex items-center"
            >
              <ArrowRight className="h-6 w-6 text-primary" />
              <span className="ml-2 text-sm text-primary font-medium">Key Features</span>
            </motion.div>
          </div>
          <div className="hidden md:block absolute top-1/2 right-1/4 transform -translate-y-1/2 translate-x-1/2">
            <motion.div
              variants={arrowVariants}
              animate="animate"
              className="flex items-center"
            >
              <span className="mr-2 text-sm text-primary font-medium">Explore Features</span>
              <ArrowRight className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card key={index} className="border-border shadow-md hover:shadow-lg transition-shadow h-full">
                <CardHeader className="pb-2">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;