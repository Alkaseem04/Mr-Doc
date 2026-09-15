import React from 'react';
import PatientProfile from '../components/PatientProfile';
import SEO from '../components/SEO';

const PatientProfilePage = () => {
  return (
    <>
      <SEO 
        title="Patient Profile - Health History & Medical Records | Mr.Doc"
        description="Manage your health history, medical records, and medication reminders in your personalized patient profile."
        keywords={["patient profile", "health history", "medical records", "medication reminders", "health tracking"]}
      />
      <PatientProfile />
    </>
  );
};

export default PatientProfilePage;