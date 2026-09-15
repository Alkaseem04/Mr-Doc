import React from 'react';
import Navbar from '../components/Navbar';
import DietRecommendation from '../components/DietRecommendation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Diet = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Personalized Diet Plans - Food Recommendations for Health Conditions | Mr.Doc"
        description="Get personalized diet recommendations based on your health conditions. Learn what foods to eat and avoid for better health."
        keywords={["diet recommendations", "personalized nutrition", "health conditions", "food plans", "nutrition advice"]}
      />
      <Navbar />
      <div className="flex-grow">
        <DietRecommendation />
      </div>
      <Footer />
    </div>
  );
};

export default Diet;