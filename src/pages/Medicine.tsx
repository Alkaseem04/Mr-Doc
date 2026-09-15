import React from 'react';
import Navbar from '../components/Navbar';
import MedicineInfo from '../components/MedicineInfo';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Medicine = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Medicine Information Database - Uses, Side Effects & Dosage | Mr.Doc"
        description="Comprehensive database of medicines with detailed information about uses, dosage, side effects, and precautions."
        keywords={["medicine information", "drug database", "medication uses", "side effects", "dosage information"]}
      />
      <Navbar />
      <div className="flex-grow">
        <MedicineInfo />
      </div>
      <Footer />
    </div>
  );
};

export default Medicine;