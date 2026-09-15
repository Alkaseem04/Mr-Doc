
import React from 'react';
import { ExternalLink, FileText, BookOpen, Video, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { healthArticles } from '../data/healthArticles';

const HealthResources = () => {
  // Only show first 6 articles in the home section
  const displayedResources = healthArticles.slice(0, 6);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Article":
        return "bg-blue-100 text-blue-600";
      case "Guide":
        return "bg-green-100 text-green-600";
      case "Video":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Article":
        return <FileText className="h-5 w-5" />;
      case "Guide":
        return <BookOpen className="h-5 w-5" />;
      case "Video":
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <section id="resources" className="py-16 bg-health-gray">
      <div className="health-container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-health-primary mb-4">Health Resources</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of trusted health resources to help you better understand various health topics.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayedResources.map((resource, index) => (
            <motion.div key={resource.id} variants={itemVariants}>
              <Link to={`/resources/${resource.id}`} className="block h-full">
                <Card className="overflow-hidden hover:shadow-md transition-shadow h-full transform transition duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <Badge className={getCategoryColor(resource.category)}>
                        <span className="flex items-center">
                          {getCategoryIcon(resource.category)}
                          <span className="ml-1">{resource.category}</span>
                        </span>
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base">
                      {resource.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full group" asChild>
                      <span className="flex items-center justify-center">
                        <span>Read More</span>
                        <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            className="bg-health-primary hover:bg-blue-700 group"
            asChild
          >
            <Link to="/resources">
              View All Resources
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HealthResources;
