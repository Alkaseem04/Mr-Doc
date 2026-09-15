import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SymptomChecker from '../components/SymptomChecker';
import Features from '../components/Features';
import HealthResources from '../components/HealthResources';
import ChatAssistant from '../components/ChatAssistant';
import DoctorAppointment from '../components/DoctorAppointment';
import Emergency from '../components/Emergency';
import MedicineInfo from '../components/MedicineInfo';
import DietRecommendation from '../components/DietRecommendation';
import HealthTracking from '../components/HealthTracking';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Mr.Doc - Your Personal Health Assistant"
        description="Check your symptoms, find potential conditions, and get medication recommendations all in one place. Book doctor appointments and access emergency services."
        keywords={["health assistant", "symptom checker", "doctor appointments", "emergency services", "medicine information"]}
      />
      <Navbar />
      <main className="flex-grow">
        <div id="home" className="scroll-mt-16">
          <Hero />
        </div>
        <div id="features" className="scroll-mt-16">
          <Features />
        </div>
        <div id="doctor-appointment" className="scroll-mt-16">
          <DoctorAppointment />
        </div>
        <div id="symptom-checker" className="scroll-mt-16">
          <SymptomChecker />
        </div>
        <div id="medicine-info" className="scroll-mt-16">
          <MedicineInfo />
        </div>
        <div id="diet-recommendation" className="scroll-mt-16">
          <DietRecommendation />
        </div>
        <div id="health-tracking" className="scroll-mt-16">
          <HealthTracking />
        </div>
        <div id="resources" className="scroll-mt-16">
          <HealthResources />
        </div>
        <div id="chat-assistant" className="scroll-mt-16">
          <ChatAssistant />
        </div>
        <div id="emergency" className="scroll-mt-16">
          <Emergency />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;