import React from 'react';
import Emergency from '../components/Emergency';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EmergencyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Emergency Services - Mr.Doc Healthcare"
        description="Immediate access to emergency contacts and nearest hospitals with one-click calling and map integration."
        keywords={["emergency", "hospitals", "urgent care", "healthcare"]}
      />
      <Navbar />
      <main className="flex-grow">
        <div className="py-8">
          <Emergency />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmergencyPage;