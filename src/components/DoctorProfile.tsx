import React, { useEffect } from 'react';
import { generateDoctorSEOTags, updateMetaTags } from '../utils/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Phone, Mail, Star, Award, GraduationCap, ShieldCheck } from 'lucide-react';

// Example doctor data
const doctorData = {
  name: "Michael Chen",
  specialty: "Cardiologist",
  experience: "15 years",
  rating: 4.9,
  reviews: 142,
  location: "San Francisco, CA",
  address: "123 Medical Center Drive, Suite 400",
  phone: "+1 (415) 555-0123",
  email: "dr.chen@mrdoc.com",
  education: [
    "MD, Stanford University School of Medicine",
    "Residency, Johns Hopkins Hospital",
    "Fellowship, Mayo Clinic"
  ],
  certifications: [
    "American Board of Internal Medicine",
    "American Board of Cardiovascular Disease",
    "Advanced Cardiac Life Support (ACLS)"
  ],
  languages: ["English", "Mandarin", "Spanish"],
  availability: ["Mon, Wed, Fri: 9:00 AM - 5:00 PM", "Tue, Thu: 1:00 PM - 9:00 PM"],
  image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
};

const DoctorProfile = () => {
  useEffect(() => {
    // Generate and update SEO tags when component mounts
    const seoTags = generateDoctorSEOTags({
      name: doctorData.name,
      specialty: doctorData.specialty,
      experience: doctorData.experience,
      location: doctorData.location
    });
    
    updateMetaTags(seoTags);
  }, []);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="health-container">
        <div className="mb-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Back to Doctors
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="mr-6 mb-4 md:mb-0">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={doctorData.image} alt={doctorData.name} />
                  <AvatarFallback className="bg-health-secondary text-white text-2xl">
                    {doctorData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div className="flex items-center justify-center md:justify-start mb-2 md:mb-0">
                    <h1 className="text-3xl font-bold text-health-primary mr-2">{doctorData.name}, MD</h1>
                    <ShieldCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="ml-1 font-semibold">{doctorData.rating}</span>
                    <span className="text-gray-500 ml-1">({doctorData.reviews} reviews)</span>
                  </div>
                </div>
                
                <p className="text-xl text-gray-600 mb-4">{doctorData.specialty}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-health-primary mr-2" />
                    <span>{doctorData.experience} experience</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-health-primary mr-2" />
                    <span>{doctorData.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {doctorData.languages.map((language, index) => (
                    <Badge key={index} variant="secondary">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 md:mt-0">
                <Button className="bg-health-primary hover:bg-blue-700 px-6 py-3 text-lg w-full">
                  Book Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-health-primary">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Education & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Education</h3>
                    <ul className="space-y-2">
                      {doctorData.education.map((edu, index) => (
                        <li key={index} className="flex items-start">
                          <Award className="mr-3 h-5 w-5 text-health-primary mt-0.5 flex-shrink-0" />
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Certifications</h3>
                    <ul className="space-y-2">
                      {doctorData.certifications.map((cert, index) => (
                        <li key={index} className="flex items-start">
                          <ShieldCheck className="mr-3 h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-health-primary">
                  <Calendar className="mr-2 h-5 w-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {doctorData.availability.map((slot, index) => (
                    <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="mr-3 h-5 w-5 text-health-primary flex-shrink-0" />
                      <span>{slot}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6">
                  <Button className="w-full bg-health-primary hover:bg-blue-700">
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center text-health-primary">
                  <MapPin className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-health-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">{doctorData.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-health-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{doctorData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-health-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">{doctorData.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button className="w-full" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;