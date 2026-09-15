import React, { useEffect } from 'react';
import { generateDiseaseSEOTags, updateMetaTags } from '../utils/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertTriangle, CheckCircle } from 'lucide-react';

// Example disease data
const diseaseData = {
  name: "Diabetes",
  description: "Diabetes is a chronic disease that occurs when your blood glucose, also called blood sugar, is too high. Blood glucose is your main source of energy and comes from the food you eat.",
  symptoms: [
    "Increased thirst",
    "Frequent urination",
    "Extreme fatigue",
    "Blurred vision",
    "Slow-healing sores",
    "Frequent infections",
    "Unintended weight loss"
  ],
  treatments: [
    "Blood sugar monitoring",
    "Healthy eating",
    "Physical activity",
    "Medication or insulin therapy",
    "Diabetes self-management education and support",
    "Regular checkups"
  ],
  foodsToAvoid: [
    "Sugar-sweetened beverages",
    "Trans fats",
    "White bread, rice, and pasta",
    "Fruit-flavored yogurt",
    "Sweetened breakfast cereals",
    "Flavored coffee drinks",
    "Honey, agave nectar, and maple syrup",
    "Dried fruit"
  ],
  recommendedFoods: [
    "Fatty fish like salmon and sardines",
    "Leafy greens",
    "Avocados",
    "Eggs",
    "Chia seeds",
    "Beans",
    "Greek yogurt",
    "Nuts"
  ]
};

const DiseaseDetail = () => {
  useEffect(() => {
    // Generate and update SEO tags when component mounts
    const seoTags = generateDiseaseSEOTags({
      name: diseaseData.name,
      description: diseaseData.description,
      symptoms: diseaseData.symptoms,
      treatments: diseaseData.treatments
    });
    
    updateMetaTags(seoTags);
  }, []);

  return (
    <div className="min-h-screen bg-health-gray py-12">
      <div className="health-container">
        <div className="mb-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Back to Diseases
          </Button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-health-primary mb-4">{diseaseData.name}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {diseaseData.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-health-primary">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Common Symptoms
              </CardTitle>
              <CardDescription>
                Recognize the signs of {diseaseData.name.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {diseaseData.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="mr-3 h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-health-primary">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Treatment Options
              </CardTitle>
              <CardDescription>
                Managing {diseaseData.name.toLowerCase()} effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {diseaseData.treatments.map((treatment, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{treatment}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-500">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Foods to Avoid
              </CardTitle>
              <CardDescription>
                Dietary restrictions for better health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {diseaseData.foodsToAvoid.map((food, index) => (
                  <Badge key={index} variant="destructive" className="py-2 px-3 justify-center">
                    {food}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-500">
                <Heart className="mr-2 h-5 w-5" />
                Recommended Foods
              </CardTitle>
              <CardDescription>
                Nutritious options for your diet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {diseaseData.recommendedFoods.map((food, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 py-2 px-3 justify-center">
                    {food}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <Button className="bg-health-primary hover:bg-blue-700 px-8 py-3 text-lg">
            Book Appointment with Specialist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetail;