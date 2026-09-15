import React from 'react';
import DoctorAppointment from '../components/DoctorAppointment';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DoctorsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Find Doctors - Mr.Doc Healthcare"
        description="Book appointments with qualified doctors for consultations and medical advice."
        keywords={["doctors", "medical appointments", "healthcare", "consultations"]}
      />
      <Navbar />
      <main className="flex-grow">
        <div className="py-8">
          <DoctorAppointment />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorsPage;