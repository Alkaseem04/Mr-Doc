import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Ambulance, Hospital, Stethoscope, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SEO from './SEO';
import { apiService } from '@/services/apiService';

// Define types for our data
interface EmergencyContact {
  service: string;
  number: string;
  description: string;
}

interface HospitalData {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  placeId?: string;
  location?: {
    lat: number;
    lng: number;
  };
  verified?: boolean;
  emergencyPhone?: string;
}

const Emergency = () => {
  const [selectedLocation, setSelectedLocation] = useState("Mumbai");
  const [hospitals, setHospitals] = useState<Record<string, HospitalData[]>>({});
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState("All Zones");

  // Emergency contact numbers by location
  const emergencyContacts: Record<string, EmergencyContact[]> = {
    "Mumbai": [
      { service: "Ambulance", number: "102", description: "Emergency Medical Services" },
      { service: "Police", number: "100", description: "Police Emergency" },
      { service: "Fire", number: "101", description: "Fire Emergency" },
      { service: "Poison Control", number: "1066", description: "National Poison Information Centre" },
      { service: "Disaster Management", number: "1078", description: "State Disaster Management Authority" }
    ],
    "Delhi": [
      { service: "Ambulance", number: "102", description: "Emergency Medical Services" },
      { service: "Police", number: "100", description: "Police Emergency" },
      { service: "Fire", number: "101", description: "Fire Emergency" },
      { service: "Women Helpline", number: "1091", description: "Women's Emergency Helpline" },
      { service: "Child Helpline", number: "1098", description: "Childline Emergency" }
    ],
    "Bangalore": [
      { service: "Ambulance", number: "102", description: "Emergency Medical Services" },
      { service: "Police", number: "100", description: "Police Emergency" },
      { service: "Fire", number: "101", description: "Fire Emergency" },
      { service: "Traffic Police", number: "1073", description: "Traffic Emergency" },
      { service: "Senior Citizen Helpline", number: "14567", description: "Elderly Care Emergency" }
    ]
  };

  // Mumbai zones for filtering
  const mumbaiZones = ["All Zones", "Wadala", "Kurla", "Nagpada", "Sion", "Mumbai Central"];

  // Updated hospital data with the exact information provided
  const initialHospitals: Record<string, HospitalData[]> = {
    "Mumbai": [
      { 
        name: "K E M Hospital", 
        address: "Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012",
        phone: "24107000",
        emergencyPhone: "24107000",
        website: "http://www.kem.edu",
        rating: 4.4,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7g",
        location: {
          lat: 18.9961,
          lng: 72.8296
        },
        verified: true
      },
      { 
        name: "Saifee Hospital", 
        address: "15/17, Maharshi Karve Marg, Charni Road, Mumbai, Maharashtra",
        phone: "022-6757-0111",
        emergencyPhone: "022-6757-0111",
        website: "https://saifeehospital.com/",
        rating: 4.2,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7e",
        location: {
          lat: 18.9546,
          lng: 72.8189
        },
        verified: true
      },
      { 
        name: "City Hospital & Research Centre", 
        address: "Kurla, Mumbai, Maharashtra",
        phone: "+91-75065-14832",
        emergencyPhone: "+91-75065-14832",
        website: "https://www.hexahealth.com/mumbai/hospital/city-hospital-and-research-centre",
        rating: 4.0,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7f",
        location: {
          lat: 19.0610,
          lng: 72.8620
        },
        verified: true
      },
      { 
        name: "Lilavati Hospital", 
        address: "A-791, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050",
        phone: "+91 22 4000 4000",
        emergencyPhone: "+91 22 4000 4000",
        website: "https://www.lilavatihospital.com/",
        rating: 4.4,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7a",
        location: {
          lat: 19.1245,
          lng: 72.8247
        },
        verified: true
      },
      { 
        name: "Jaslok Hospital", 
        address: "15, Pedder Street, IT Colony, Tardeo, Mumbai, Maharashtra 400026",
        phone: "9930192000",
        emergencyPhone: "9930192000",
        website: "https://www.jaslokhospital.net/",
        rating: 4.3,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7b",
        location: {
          lat: 18.9596,
          lng: 72.8049
        },
        verified: true
      },
      { 
        name: "M.H. Saboo Siddique Maternity & General Hospital", 
        address: "Imam Wada Road, Dongri, (near Mogul Masjid), Dongri, Mumbai",
        phone: "+91 22 2377 3355",
        emergencyPhone: "+91 22 2377 3355",
        website: "https://www.practo.com/mumbai/hospital/saboo-siddique-hospital-dongri",
        rating: 4.1,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7h",
        location: {
          lat: 18.9597,
          lng: 72.8364
        },
        verified: true
      }
    ],
    "Delhi": [
      { 
        name: "All India Institute of Medical Sciences", 
        address: "Ansari Nagar, Ring Road, New Delhi, Delhi 110029",
        phone: "+91 11 2658 8500",
        emergencyPhone: "+91 11 2658 8500",
        website: "https://www.aiims.edu",
        rating: 4.7,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7c",
        location: {
          lat: 28.5672,
          lng: 77.2100
        },
        verified: true
      },
      { 
        name: "Sir Ganga Ram Hospital", 
        address: "Rajinder Nagar, New Delhi, Delhi 110060",
        phone: "+91 11 2575 0000",
        emergencyPhone: "+91 11 2575 0000",
        website: "https://www.sgrh.com",
        rating: 4.3,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7d",
        location: {
          lat: 28.6389,
          lng: 77.1927
        },
        verified: true
      }
    ],
    "Bangalore": [
      { 
        name: "Manipal Hospital", 
        address: "98, HAL Airport Road, Kodihalli, Bangalore, Karnataka 560017",
        phone: "+91 80 2502 5555",
        emergencyPhone: "+91 80 2502 5555",
        website: "https://www.manipalhospitals.com",
        rating: 4.4,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7e",
        location: {
          lat: 12.9500,
          lng: 77.6500
        },
        verified: true
      },
      { 
        name: "Apollo Hospital", 
        address: "154/11, Opp. Mekhri Circle, Indiranagar, Bangalore, Karnataka 560038",
        phone: "+91 80 2630 4050",
        emergencyPhone: "+91 80 2630 4050",
        website: "https://www.apollohospitals.com",
        rating: 4.3,
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7f",
        location: {
          lat: 12.9800,
          lng: 77.6300
        },
        verified: true
      }
    ]
  };

  useEffect(() => {
    fetchLiveHospitals();
  }, []);

  const fetchLiveHospitals = async () => {
    try {
      const data = await apiService.get('/hospitals');
      if (Array.isArray(data) && data.length > 0) {
        const formatted: HospitalData[] = data.map((h: any) => ({
          name: h.name,
          address: typeof h.address === 'string' ? h.address : `${h.address?.street || ''}, ${h.address?.city || 'Mumbai'}`,
          phone: h.phone,
          emergencyPhone: h.emergencyPhone || h.phone,
          website: h.website,
          rating: h.rating || 4.5,
          verified: h.verified ?? true,
          location: {
            lat: h.location?.coordinates?.[1] || 18.9961,
            lng: h.location?.coordinates?.[0] || 72.8296
          }
        }));
        setHospitals({ "Mumbai": formatted });
      } else {
        setHospitals(initialHospitals);
      }
    } catch (err) {
      setHospitals(initialHospitals);
    }
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleDirections = (hospital: HospitalData) => {
    if (hospital.location) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Emergency Services - Mr.Doc"
        description="Access emergency medical services and contact information for hospitals in your area."
        keywords={["emergency", "hospital", "ambulance", "medical emergency", "healthcare"]}
      />
      
      {/* Hero Section */}
      <section className="glass-effect py-16 md:py-24">
        <div className="health-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Emergency Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Immediate access to emergency medical services and hospital contact information
            </p>
          </motion.div>
        </div>
      </section>

      <div className="health-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emergency Contacts */}
          <div className="lg:col-span-1">
            <Card className="glass-effect border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>
                  Immediate contact numbers for emergency services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyContacts[selectedLocation]?.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold">{contact.service}</h3>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                      </div>
                      <Button 
                        onClick={() => handleCall(contact.number)}
                        className="health-button"
                      >
                        {contact.number}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hospital List */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hospital className="h-5 w-5 text-primary" />
                  Nearest Hospitals
                </CardTitle>
                <CardDescription>
                  Verified hospitals in your area with contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hospitals[selectedLocation]?.map((hospital, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-6 rounded-lg border border-border bg-card hover:bg-card/80 transition-all duration-300 hover-card"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <Hospital className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              {/* Hospital name as clickable link */}
                              <a 
                                href={hospital.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-lg font-semibold hover:text-primary transition-colors"
                              >
                                {hospital.name}
                              </a>
                              {hospital.verified && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{hospital.address}</span>
                            </div>
                            {hospital.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{hospital.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          {hospital.emergencyPhone && (
                            <Button 
                              onClick={() => handleCall(hospital.emergencyPhone!)}
                              className="health-button flex items-center gap-2"
                            >
                              <Phone className="h-4 w-4" />
                              Call
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleDirections(hospital)}
                            variant="outline"
                            className="flex items-center gap-2 border-border text-foreground hover:bg-muted"
                          >
                            <Navigation className="h-4 w-4" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;