import React from 'react';
import VideoConsultation from '../components/VideoConsultation';
import SEO from '../components/SEO';

const VideoConsultationPage = () => {
  return (
    <>
      <SEO 
        title="Video Consultation - Telemedicine with Doctors | Mr.Doc"
        description="Secure video calling between patients and doctors for remote consultations and medical advice."
        keywords={["video consultation", "telemedicine", "online doctor", "remote consultation", "virtual healthcare"]}
      />
      <VideoConsultation />
    </>
  );
};

export default VideoConsultationPage;