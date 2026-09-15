import React from 'react';
import Navbar from '../components/Navbar';
import HealthTracking from '../components/HealthTracking';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const HealthTrackingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Health Tracking - Monitor Your Vital Signs & Fitness Data | Mr.Doc"
        description="Track your health data from smartwatches and medical sensors. Monitor heart rate, blood pressure, oxygen levels, and steps."
        keywords={["health tracking", "smartwatch data", "medical sensors", "vital signs", "fitness tracking"]}
      />
      <Navbar />
      <div className="flex-grow">
        <HealthTracking />
      </div>
      <Footer />
    </div>
  );
};

export default HealthTrackingPage;