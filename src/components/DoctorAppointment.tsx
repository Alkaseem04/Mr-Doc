import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Search, ChevronDown, Clock, Phone, ShieldCheck, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SEO from './SEO';
import { apiService } from '@/services/apiService';

// Fallback sample doctor data
const FALLBACK_DOCTORS = [
  {
    _id: "doc1",
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    specialization: "General Practitioner",
    rating: 4.8,
    reviews: 127,
    distance: 0.8,
    availability: ["Today", "Tomorrow", "Wed"],
    image: "https://i.pravatar.cc/150?img=32",
    address: "123 Health St, Medical Center",
    verified: true
  },
  {
    _id: "doc2",
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    specialization: "Cardiologist",
    rating: 4.9,
    reviews: 214,
    distance: 1.3,
    availability: ["Tomorrow", "Thu", "Fri"],
    image: "https://i.pravatar.cc/150?img=68",
    address: "456 Wellness Ave, Heart Institute",
    verified: true
  },
  {
    _id: "doc3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    specialization: "Pediatrician",
    rating: 4.7,
    reviews: 95,
    distance: 2.1,
    availability: ["Today", "Thu", "Fri"],
    image: "https://i.pravatar.cc/150?img=26",
    address: "789 Care Lane, Children's Clinic",
    verified: false
  },
  {
    _id: "doc4",
    name: "Dr. James Wilson",
    specialty: "Dermatologist",
    specialization: "Dermatologist",
    rating: 4.6,
    reviews: 78,
    distance: 3.0,
    availability: ["Wed", "Thu", "Fri"],
    image: "https://i.pravatar.cc/150?img=51",
    address: "101 Skin Blvd, Dermatology Center",
    verified: true
  }
];

const specialties = [
  "All Specialties",
  "General Practitioner",
  "Cardiologist",
  "Pediatrician",
  "Dermatologist",
  "Neurologist",
  "Orthopedist"
];

const DoctorAppointment = () => {
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState(specialties[0]);
  const [doctorsList, setDoctorsList] = useState<any[]>(FALLBACK_DOCTORS);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingStep, setBookingStep] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await apiService.get('/doctors');
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((d: any) => ({
          _id: d._id,
          name: d.user?.name || 'Dr. Medical Specialist',
          specialty: d.specialization || 'General Physician',
          rating: d.rating || 4.8,
          reviews: d.totalReviews || 50,
          distance: 1.2,
          availability: ["Today", "Tomorrow"],
          image: d.user?.avatar || "https://i.pravatar.cc/150?img=32",
          address: d.hospital || "Main Health Clinic",
          verified: d.isVerified ?? true
        }));
        setDoctorsList(formatted);
      }
    } catch (err) {
      console.log('Using fallback doctor list:', err);
    }
  };

  const handleBookAppointment = async (docId: string) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        description: "You need to select both a date and time to book an appointment",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    
    try {
      const doctorObj = doctorsList.find(d => d._id === docId);
      await apiService.post('/appointments', {
        doctor: docId,
        date: selectedDate,
        time: selectedTime,
        reason: `Consultation for ${specialty !== "All Specialties" ? specialty : "General Care"}`,
        type: 'in-person'
      });
      
      toast({
        title: "Appointment Booked Successfully! 🎉",
        description: `Your appointment with ${doctorObj?.name} is scheduled for ${selectedDate} at ${selectedTime}`,
      });
      
      setSelectedDoctorId(null);
      setSelectedDate("");
      setSelectedTime("");
      setBookingStep(1);
    } catch (error: any) {
      toast({
        title: "Booking error",
        description: error.message || "Please login or try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
          toast({
            title: "Location detected",
            description: "Using your GPS coordinates to find nearby doctors",
          });
        },
        () => {
          setLocation("Current Location");
        }
      );
    } else {
      setLocation("Current Location");
    }
  };

  const handleSelectDoctor = (docId: string) => {
    setSelectedDoctorId(docId);
    setBookingStep(2);
  };

  const handleConfirmBooking = () => {
    if (selectedDoctorId) {
      handleBookAppointment(selectedDoctorId);
    }
  };

  const handleBackToDoctorSelection = () => {
    setBookingStep(1);
    setSelectedDate("");
    setSelectedTime("");
  };

  return (
    <section id="doctor-appointment" className="py-16 bg-background">
      <SEO 
        title="Find & Book Doctors Online - Mr.Doc Healthcare"
        description="Find verified doctors by specialty and book appointments online. Get video consultations with top healthcare professionals."
        keywords={["find doctors", "book appointments", "video consultation", "verified doctors", "healthcare"]}
      />
      <div className="health-container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Find Doctors Near You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Book appointments with the best doctors in your area. 
            We'll help you find specialists who match your needs and are available when you need them.
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-card p-6 rounded-lg shadow-md mb-8 border border-border">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="flex items-center border rounded-md px-3 py-2 border-input bg-background">
                <MapPin className="text-primary mr-2 h-5 w-5" />
                <input 
                  type="text" 
                  placeholder="Enter your location" 
                  className="flex-1 focus:outline-none bg-background text-foreground"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button 
                variant="link" 
                className="text-primary absolute right-2 top-2 text-sm"
                onClick={handleUseCurrentLocation}
              >
                Use current location
              </Button>
            </div>
            
            <div className="relative">
              <div className="flex items-center border rounded-md px-3 py-2 border-input bg-background">
                <Search className="text-primary mr-2 h-5 w-5" />
                <select 
                  className="flex-1 bg-background text-foreground focus:outline-none appearance-none"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <Button className="health-button">
              Find Doctors
            </Button>
          </div>
        </div>

        {/* Booking Flow */}
        {bookingStep === 1 && (
          <div className="grid md:grid-cols-2 gap-6">
            {doctorsList.map((doctor) => (
              <Card key={doctor._id} className="overflow-hidden transition-shadow duration-300 hover-card border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start">
                    <div className="mr-4">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        {doctor.verified && (
                          <ShieldCheck className="h-5 w-5 text-primary ml-2" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm ml-1 text-foreground">{doctor.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">({doctor.reviews} reviews)</span>
                        <div className="ml-auto flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {doctor.distance} miles away
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {doctor.address}
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 text-foreground">Next Available</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availability?.map((day: string, index: number) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    className="border-border text-foreground hover:bg-muted"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    className="health-button"
                    onClick={() => handleSelectDoctor(doctor._id)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {bookingStep === 2 && selectedDoctorId && (
          <Card className="max-w-2xl mx-auto border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Book Appointment
              </CardTitle>
              <CardDescription>
                Select date and time for your appointment with {doctorsList.find(d => d._id === selectedDoctorId)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 text-foreground">Select Date</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <Button
                        key={day}
                        variant={selectedDate === day ? "default" : "outline"}
                        className={`text-xs ${selectedDate === day ? 'bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-muted'}`}
                        onClick={() => setSelectedDate(day)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 text-foreground">Select Time</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'].map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`text-xs ${selectedTime === time ? 'bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-muted'}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    className="border-border text-foreground hover:bg-muted"
                    onClick={handleBackToDoctorSelection}
                  >
                    Back
                  </Button>
                  <Button 
                    className="health-button"
                    onClick={handleConfirmBooking}
                    disabled={!selectedDate || !selectedTime || isBooking}
                  >
                    {isBooking ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Booking...
                      </div>
                    ) : (
                      "Confirm Appointment"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default DoctorAppointment;