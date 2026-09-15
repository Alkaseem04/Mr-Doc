import React, { useState } from 'react';
import { Search, Pill, Info, AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import SEO from './SEO';

// Medicine database
const medicineDatabase = [
  {
    id: 1,
    name: "Paracetamol",
    brand: "Crocin",
    category: "Pain Reliever",
    uses: ["Fever", "Headache", "Muscle pain", "Toothache"],
    dosage: "500mg - 1000mg every 4-6 hours",
    sideEffects: ["Nausea", "Stomach pain", "Allergic reactions (rare)"],
    precautions: ["Do not exceed 4g per day", "Avoid alcohol", "Consult doctor if pregnant"],
    description: "A common painkiller used to treat aches and pains and to reduce high temperature (fever)."
  },
  {
    id: 2,
    name: "Ibuprofen",
    brand: "Brufen",
    category: "NSAID",
    uses: ["Inflammation", "Joint pain", "Period pain", "Fever"],
    dosage: "200mg - 400mg every 6-8 hours",
    sideEffects: ["Stomach upset", "Heartburn", "Dizziness", "Skin rash"],
    precautions: ["Take with food", "Not for long-term use", "Avoid if asthmatic"],
    description: "A non-steroidal anti-inflammatory drug (NSAID) used to reduce pain, fever, and inflammation."
  },
  {
    id: 3,
    name: "Amoxicillin",
    brand: "Amoxil",
    category: "Antibiotic",
    uses: ["Bacterial infections", "Respiratory infections", "Urinary tract infections"],
    dosage: "250mg - 500mg every 8 hours",
    sideEffects: ["Diarrhea", "Nausea", "Vomiting", "Rash"],
    precautions: ["Complete full course", "Inform about allergies", "May cause yeast infections"],
    description: "A penicillin antibiotic used to treat bacterial infections such as chest infections, dental abscesses, and urinary tract infections."
  },
  {
    id: 4,
    name: "Lisinopril",
    brand: "Zestril",
    category: "ACE Inhibitor",
    uses: ["High blood pressure", "Heart failure", "Kidney problems"],
    dosage: "5mg - 40mg once daily",
    sideEffects: ["Dizziness", "Headache", "Dry cough", "Fatigue"],
    precautions: ["Monitor blood pressure", "Avoid potassium supplements", "Not during pregnancy"],
    description: "An ACE inhibitor used to treat high blood pressure and heart failure, and to improve survival after a heart attack."
  },
  {
    id: 5,
    name: "Atorvastatin",
    brand: "Lipitor",
    category: "Statin",
    uses: ["High cholesterol", "Heart disease prevention"],
    dosage: "10mg - 80mg once daily",
    sideEffects: ["Muscle pain", "Joint pain", "Nausea", "Constipation"],
    precautions: ["Regular liver function tests", "Avoid grapefruit juice", "Report muscle pain"],
    description: "A statin used to lower cholesterol and reduce the risk of heart disease and stroke."
  },
  {
    id: 6,
    name: "Metformin",
    brand: "Glucophage",
    category: "Antidiabetic",
    uses: ["Type 2 diabetes", "PCOS"],
    dosage: "500mg - 1000mg twice daily",
    sideEffects: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
    precautions: ["Take with meals", "Monitor blood sugar", "Risk of lactic acidosis (rare)"],
    description: "Used to improve blood sugar control in adults with type 2 diabetes along with diet and exercise."
  },
  {
    id: 7,
    name: "Omeprazole",
    brand: "Prilosec",
    category: "Proton Pump Inhibitor",
    uses: ["Acid reflux", "Heartburn", "Stomach ulcers"],
    dosage: "10mg - 40mg once daily",
    sideEffects: ["Headache", "Nausea", "Diarrhea", "Abdominal pain"],
    precautions: ["Long-term use risks", "May interact with other drugs", "Take before meals"],
    description: "Used to treat conditions caused by too much acid in the stomach, such as gastroesophageal reflux disease (GERD)."
  },
  {
    id: 8,
    name: "Levothyroxine",
    brand: "Synthroid",
    category: "Thyroid Hormone",
    uses: ["Hypothyroidism", "Goiter"],
    dosage: "25mcg - 300mcg once daily",
    sideEffects: ["Weight changes", "Nervousness", "Insomnia", "Fast heartbeat"],
    precautions: ["Take on empty stomach", "Consistent timing", "Regular blood tests"],
    description: "A synthetic form of the thyroid hormone thyroxine used to treat hypothyroidism and thyroid cancer."
  }
];

const MedicineInfo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Filter medicines based on search term
  const filteredMedicines = medicineDatabase.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.uses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMedicineSelect = (medicine) => {
    setSelectedMedicine(medicine);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Pain Reliever":
        return "bg-red-500/10 text-red-500";
      case "NSAID":
        return "bg-orange-500/10 text-orange-500";
      case "Antibiotic":
        return "bg-blue-500/10 text-blue-500";
      case "ACE Inhibitor":
        return "bg-purple-500/10 text-purple-500";
      case "Statin":
        return "bg-green-500/10 text-green-500";
      case "Antidiabetic":
        return "bg-yellow-500/10 text-yellow-500";
      case "Proton Pump Inhibitor":
        return "bg-indigo-500/10 text-indigo-500";
      case "Thyroid Hormone":
        return "bg-pink-500/10 text-pink-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="medicine-info" className="py-16 bg-background">
      <SEO 
        title="Medicine Information Database - Uses, Side Effects & Dosage | Mr.Doc"
        description="Comprehensive database of medicines with detailed information about uses, dosage, side effects, and precautions."
        keywords={["medicine information", "drug database", "medication uses", "side effects", "dosage information"]}
      />
      <div className="health-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Medicine Information
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive database of medicines with detailed information about uses, dosage, side effects, and precautions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for medicines, brands, conditions..."
              className="pl-10 py-6 text-lg rounded-full border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {selectedMedicine ? (
          // Medicine Detail View
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
                      <Pill className="mr-2 h-6 w-6 text-primary" />
                      {selectedMedicine.name}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">Brand: {selectedMedicine.brand}</p>
                  </div>
                  <Badge className={getCategoryColor(selectedMedicine.category)}>
                    {selectedMedicine.category}
                  </Badge>
                </div>
                <CardDescription className="text-base mt-3 text-muted-foreground">
                  {selectedMedicine.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center">
                      <Info className="mr-2 h-5 w-5 text-primary" />
                      {`Uses`}
                    </h3>
                    <ul className="space-y-2">
                      {selectedMedicine.uses.map((use, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span className="text-muted-foreground">{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
                      {`Side Effects`}
                    </h3>
                    <ul className="space-y-2">
                      {selectedMedicine.sideEffects.map((effect, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span className="text-muted-foreground">{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground">
                      {`Dosage`}
                    </h3>
                    <p className="text-muted-foreground bg-muted p-3 rounded-md">
                      {selectedMedicine.dosage}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-primary" />
                      {`Precautions`}
                    </h3>
                    <ul className="space-y-2">
                      {selectedMedicine.precautions.map((precaution, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span className="text-muted-foreground">{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setSelectedMedicine(null)}
                className="health-button"
              >
                Back to Search
              </button>
              <button className="health-button-outline">
                Save Medicine
              </button>
            </div>
          </motion.div>
        ) : (
          // Medicine List View
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {filteredMedicines.map((medicine, index) => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover-card border-border"
                  onClick={() => handleMedicineSelect(medicine)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center text-foreground">
                        <Pill className="mr-2 h-5 w-5 text-primary" />
                        {medicine.name}
                      </CardTitle>
                      <Badge className={getCategoryColor(medicine.category)}>
                        {medicine.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      Brand: {medicine.brand}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {medicine.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {medicine.uses.slice(0, 3).map((use, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-muted text-muted-foreground text-xs">
                          {use}
                        </Badge>
                      ))}
                      {medicine.uses.length > 3 && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                          +{medicine.uses.length - 3} more
                        </Badge>
                      )}
                    </div>
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

export default MedicineInfo;