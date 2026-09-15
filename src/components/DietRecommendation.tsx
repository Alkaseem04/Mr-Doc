import React, { useState } from 'react';
import { Apple, Search, Heart, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import SEO from './SEO';

// Diet recommendations database
const dietDatabase = {
  "Common Cold": {
    name: "Common Cold Diet",
    description: "Foods that can help boost your immune system and ease cold symptoms",
    recommendations: [
      "Warm chicken soup or broth",
      "Hot herbal teas with honey and lemon",
      "Vitamin C-rich foods (oranges, strawberries, kiwi)",
      "Garlic and onions for natural antiviral properties",
      "Stay hydrated with plenty of water"
    ],
    foodsToAvoid: [
      "Dairy products (may increase mucus production)",
      "Alcoholic beverages",
      "Caffeinated drinks",
      "Sugary snacks and drinks"
    ]
  },
  "Migraine": {
    name: "Migraine Diet",
    description: "Foods that may help prevent migraines and reduce their severity",
    recommendations: [
      "Magnesium-rich foods (dark leafy greens, nuts, seeds)",
      "Omega-3 fatty acids (salmon, flaxseeds)",
      "Stay hydrated and avoid alcohol",
      "Small, frequent meals to maintain blood sugar",
      "Ginger tea for nausea relief"
    ],
    foodsToAvoid: [
      "Aged cheeses (blue cheese, cheddar, parmesan)",
      "Processed meats (hot dogs, deli meats)",
      "Chocolate and cocoa",
      "Monosodium glutamate (MSG)",
      "Alcoholic beverages, especially red wine"
    ]
  },
  "Diabetes": {
    name: "Diabetes Diet",
    description: "Foods that help manage blood sugar levels and support overall health",
    recommendations: [
      "High-fiber foods (vegetables, legumes, whole grains)",
      "Lean proteins (fish, poultry, tofu)",
      "Healthy fats (avocados, nuts, olive oil)",
      "Low-glycemic fruits (berries, apples, citrus)",
      "Non-starchy vegetables (broccoli, spinach, peppers)"
    ],
    foodsToAvoid: [
      "Sugary drinks and sodas",
      "Refined grains (white bread, white rice)",
      "Processed snacks and sweets",
      "Trans fats and fried foods",
      "Excessive portions of high-carb foods"
    ]
  },
  "Hypertension": {
    name: "Hypertension Diet",
    description: "Foods that can help lower blood pressure and support heart health",
    recommendations: [
      "Leafy greens (spinach, kale, collards)",
      "Berries (blueberries, strawberries)",
      "Red beets for natural nitrates",
      "Skim or low-fat dairy products",
      "Oats and other whole grains"
    ],
    foodsToAvoid: [
      "High-sodium processed foods",
      "Canned soups and vegetables",
      "Pickled foods",
      "Fast food and restaurant meals",
      "Excess salt and salty snacks"
    ]
  },
  "Heart Disease": {
    name: "Heart-Healthy Diet",
    description: "Foods that support cardiovascular health and reduce heart disease risk",
    recommendations: [
      "Fatty fish (salmon, mackerel, sardines)",
      "Nuts and seeds (almonds, walnuts, flaxseeds)",
      "Olive oil as primary fat source",
      "Colorful fruits and vegetables",
      "Whole grains (oats, quinoa, brown rice)"
    ],
    foodsToAvoid: [
      "Trans fats and partially hydrogenated oils",
      "Saturated fats (butter, fatty meats)",
      "Processed and cured meats",
      "Sugary drinks and desserts",
      "Excessive alcohol consumption"
    ]
  },
  "Weight Loss": {
    name: "Weight Loss Diet",
    description: "Foods that support healthy weight management and satiety",
    recommendations: [
      "High-protein foods (eggs, lean meats, legumes)",
      "Fiber-rich vegetables and fruits",
      "Water-rich foods (cucumbers, watermelon)",
      "Healthy fats in moderation (avocados, nuts)",
      "Low-fat dairy products"
    ],
    foodsToAvoid: [
      "High-calorie processed snacks",
      "Sugary drinks and fruit juices",
      "Refined carbohydrates (white bread, pastries)",
      "Fried foods and fast food",
      "Large portion sizes"
    ]
  },
  "Osteoporosis": {
    name: "Bone Health Diet",
    description: "Foods that support bone density and reduce fracture risk",
    recommendations: [
      "Dairy products (milk, yogurt, cheese)",
      "Leafy greens (kale, collard greens)",
      "Canned fish with bones (sardines, salmon)",
      "Fortified plant-based milk alternatives",
      "Nuts and seeds (almonds, sesame seeds)"
    ],
    foodsToAvoid: [
      "Excessive caffeine (more than 3 cups daily)",
      "High-sodium foods",
      "Excessive alcohol consumption",
      "High-phosphorus processed foods",
      "Very high-protein diets without adequate calcium"
    ]
  },
  "Acid Reflux": {
    name: "GERD Diet",
    description: "Foods that help manage acid reflux and reduce heartburn",
    recommendations: [
      "Non-citrus fruits (bananas, melons, apples)",
      "Vegetables (broccoli, green beans, asparagus)",
      "Lean proteins (chicken, fish, tofu)",
      "Whole grains (oatmeal, brown rice)",
      "Healthy fats (avocados, walnuts)"
    ],
    foodsToAvoid: [
      "Citrus fruits and juices",
      "Tomatoes and tomato-based products",
      "Spicy foods and hot peppers",
      "Chocolate and cocoa products",
      "Carbonated beverages"
    ]
  }
};

const DietRecommendation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState(null);

  // Filter conditions based on search term
  const filteredConditions = Object.keys(dietDatabase).filter(condition => 
    condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dietDatabase[condition].name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConditionSelect = (condition) => {
    setSelectedCondition(condition);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="diet-recommendation" className="py-16 bg-background">
      <SEO 
        title="Personalized Diet Plans - Food Recommendations for Health Conditions | Mr.Doc"
        description="Get personalized diet recommendations based on your health conditions. Learn what foods to eat and avoid for better health."
        keywords={["diet recommendations", "personalized nutrition", "health conditions", "food plans", "nutrition advice"]}
      />
      <div className="health-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Personalized Diet Recommendations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get customized food and nutrition plans based on your health conditions to support your wellbeing.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for conditions (e.g., diabetes, hypertension)..."
              className="pl-10 py-6 text-lg rounded-full border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {selectedCondition ? (
          // Diet Detail View
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-6 border-border">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center text-foreground">
                      <Apple className="mr-2 h-6 w-6 text-primary" />
                      {dietDatabase[selectedCondition].name}
                    </CardTitle>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {selectedCondition}
                  </Badge>
                </div>
                <CardDescription className="text-base mt-3 text-muted-foreground">
                  {dietDatabase[selectedCondition].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                      Recommended Foods
                    </h3>
                    <ul className="space-y-3">
                      {dietDatabase[selectedCondition].recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                      Foods to Avoid
                    </h3>
                    <ul className="space-y-3">
                      {dietDatabase[selectedCondition].foodsToAvoid.map((food, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="mr-3 h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{food}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-foreground flex items-center mb-2">
                    <Heart className="mr-2 h-5 w-5 text-primary" />
                    Important Note
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    These dietary recommendations are for informational purposes only and should not replace professional medical advice. 
                    Always consult with a healthcare provider or registered dietitian for personalized nutrition guidance.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <button 
                onClick={() => setSelectedCondition(null)}
                className="health-button"
              >
                Back to Search
              </button>
            </div>
          </motion.div>
        ) : (
          // Diet List View
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {filteredConditions.map((condition, index) => (
              <motion.div
                key={condition}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover-card border-border"
                  onClick={() => handleConditionSelect(condition)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-foreground">
                      <Apple className="mr-2 h-5 w-5 text-primary" />
                      {dietDatabase[condition].name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {dietDatabase[condition].description}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className="bg-muted text-muted-foreground"
                    >
                      {condition}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DietRecommendation;