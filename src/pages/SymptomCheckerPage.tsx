import React from 'react';
import SymptomChecker from '../components/SymptomChecker';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SymptomCheckerPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Symptom Checker - Mr.Doc Healthcare"
        description="Check your symptoms and get potential conditions, treatments, and medication recommendations."
        keywords={["symptom checker", "health diagnosis", "medical advice", "healthcare"]}
      />
      <Navbar />
      <main className="flex-grow">
        <div className="py-8">
          <SymptomChecker />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SymptomCheckerPage;