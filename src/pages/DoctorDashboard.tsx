import React from 'react';
import DoctorDashboard from '../components/DoctorDashboard';
import SEO from '../components/SEO';

const DoctorDashboardPage = () => {
  return (
    <>
      <SEO 
        title="Doctor Dashboard - Manage Appointments & Patient Records | Mr.Doc"
        description="Manage your appointments, patient records, and health data with our comprehensive doctor dashboard."
        keywords={["doctor dashboard", "appointment management", "patient records", "health data", "telemedicine"]}
      />
      <DoctorDashboard />
    </>
  );
};

export default DoctorDashboardPage;