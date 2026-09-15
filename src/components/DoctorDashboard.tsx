import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Video, Search, Bell, User, Settings, LogOut, CheckCircle, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SEO from './SEO';
import { apiService } from '@/services/apiService';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock data for doctor dashboard
const doctorData = {
  name: "Dr. Sarah Johnson",
  specialty: "General Practitioner",
  rating: 4.8,
  reviews: 127,
  image: "https://i.pravatar.cc/150?img=32",
  verified: true
};

const appointments = [
  {
    id: 1,
    patientName: "John Smith",
    patientAge: 35,
    patientGender: "Male",
    time: "09:00 AM",
    date: "Today",
    type: "Video Consultation",
    status: "confirmed",
    concern: "Common cold symptoms"
  },
  {
    id: 2,
    patientName: "Emily Davis",
    patientAge: 28,
    patientGender: "Female",
    time: "10:30 AM",
    date: "Today",
    type: "In-person",
    status: "confirmed",
    concern: "Annual checkup"
  },
  {
    id: 3,
    patientName: "Michael Brown",
    patientAge: 45,
    patientGender: "Male",
    time: "02:00 PM",
    date: "Today",
    type: "Video Consultation",
    status: "pending",
    concern: "Back pain"
  },
  {
    id: 4,
    patientName: "Lisa Wilson",
    patientAge: 52,
    patientGender: "Female",
    time: "04:00 PM",
    date: "Today",
    type: "Video Consultation",
    status: "confirmed",
    concern: "Medication follow-up"
  }
];

const patients = [
  {
    id: 1,
    name: "John Smith",
    age: 35,
    gender: "Male",
    lastVisit: "2023-06-15",
    conditions: ["Hypertension", "Diabetes"],
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 2,
    name: "Emily Davis",
    age: 28,
    gender: "Female",
    lastVisit: "2023-06-10",
    conditions: ["Anxiety", "Migraine"],
    avatar: "https://i.pravatar.cc/150?img=16"
  },
  {
    id: 3,
    name: "Michael Brown",
    age: 45,
    gender: "Male",
    lastVisit: "2023-06-05",
    conditions: ["High Cholesterol"],
    avatar: "https://i.pravatar.cc/150?img=31"
  },
  {
    id: 4,
    name: "Lisa Wilson",
    age: 52,
    gender: "Female",
    lastVisit: "2023-06-01",
    conditions: ["Arthritis", "Osteoporosis"],
    avatar: "https://i.pravatar.cc/150?img=45"
  }
];

const recentActivities = [
  {
    id: 1,
    patient: "John Smith",
    action: "Prescription updated",
    time: "2 hours ago",
    type: "prescription"
  },
  {
    id: 2,
    patient: "Emily Davis",
    action: "Lab results reviewed",
    time: "4 hours ago",
    type: "lab"
  },
  {
    id: 3,
    patient: "Michael Brown",
    action: "Appointment rescheduled",
    time: "1 day ago",
    type: "appointment"
  },
  {
    id: 4,
    patient: "Lisa Wilson",
    action: "Treatment plan updated",
    time: "2 days ago",
    type: "treatment"
  }
];

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [searchTerm, setSearchTerm] = useState("");
  const [liveAppointments, setLiveAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Prescription modal state
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [selectedApptForRx, setSelectedApptForRx] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [instructions, setInstructions] = useState("");
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.get('/appointments/my');
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((a: any) => ({
          id: a._id,
          patientName: a.patient?.name || 'Patient',
          patientEmail: a.patient?.email || 'N/A',
          patientAge: 30,
          patientGender: "Unspecified",
          time: a.time || "10:00 AM",
          date: a.date ? new Date(a.date).toLocaleDateString() : "Today",
          type: a.type === 'video' ? "Video Consultation" : "In-person",
          status: a.status || "pending",
          concern: a.reason || "General Checkup",
          patientId: a.patient?._id
        }));
        setLiveAppointments(formatted);
      } else {
        setLiveAppointments(appointments); // fallback mock data
      }
    } catch (err) {
      console.log('Falling back to mock appointments:', err);
      setLiveAppointments(appointments);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiService.put(`/appointments/${id}`, { status: newStatus });
      setLiveAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      toast({
        title: "Status Updated",
        description: `Appointment marked as ${newStatus}`
      });
    } catch (err: any) {
      toast({
        title: "Error updating status",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleCreatePrescription = async () => {
    if (!diagnosis || !medicineName || !dosage) {
      toast({
        title: "Missing Fields",
        description: "Please fill diagnosis, medicine name, and dosage.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newRx = await apiService.post('/prescriptions', {
        patient: selectedApptForRx?.patientId || selectedApptForRx?.id,
        appointment: selectedApptForRx?.id,
        diagnosis,
        medicines: [{
          name: medicineName,
          dosage,
          frequency,
          duration: "5 days",
          instructions
        }],
        advice
      });

      toast({
        title: "Digital Prescription Issued & PDF Generated! 📄",
        description: `Prescription created for ${selectedApptForRx?.patientName}`
      });

      if (selectedApptForRx?.id) {
        handleUpdateStatus(selectedApptForRx.id, 'completed');
      }

      if (newRx && newRx._id) {
        apiService.viewPrescriptionPdf(newRx._id);
      }

      setPrescriptionOpen(false);
      setDiagnosis("");
      setMedicineName("");
      setDosage("");
      setInstructions("");
      setAdvice("");
    } catch (err: any) {
      toast({
        title: "Prescription Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Filter appointments based on search term
  const filteredAppointments = liveAppointments.filter(appointment => 
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.concern.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.conditions.some(condition => condition.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video Consultation":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "In-person":
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Doctor Dashboard - Manage Appointments & Patient Records | Mr.Doc"
        description="Manage your appointments, patient records, and health data with our comprehensive doctor dashboard."
        keywords={["doctor dashboard", "appointment management", "patient records", "health data", "telemedicine"]}
      />
      {/* Header */}
      <header className="bg-white shadow">
        <div className="health-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-health-primary">Doctor Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-500" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-health-accent rounded-full"></span>
              </Button>
              
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={doctorData.image} alt={doctorData.name} />
                  <AvatarFallback className="bg-health-secondary text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="ml-2 hidden md:block">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-700">{doctorData.name}</p>
                    {doctorData.verified && (
                      <ShieldCheck className="h-4 w-4 text-blue-500 ml-1" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{doctorData.specialty}</p>
                </div>
              </div>
              
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-gray-500" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="health-container py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-health-primary">
                {appointments.filter(a => a.date === "Today").length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Scheduled for today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-500" />
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-health-primary">
                {patients.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">In your practice</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-health-primary">
                12
              </div>
              <p className="text-sm text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-purple-500" />
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-health-primary">
                {doctorData.rating}
              </div>
              <p className="text-sm text-gray-500 mt-1">{doctorData.reviews} reviews</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Tabs */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search appointments, patients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Tab Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="appointments" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>
                  Manage your upcoming appointments and patient consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4">
                        <div className="flex items-center">
                          <div className="mr-4">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gray-200 font-bold text-primary">
                                {appointment.patientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patientName}</h3>
                            <p className="text-sm text-gray-500">{appointment.concern}</p>
                            <div className="flex items-center mt-1 gap-2">
                              <span className="text-xs text-gray-500">{appointment.date}</span>
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                          <div className="text-right mr-4 hidden md:block">
                            <p className="font-medium">{appointment.time}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              {getTypeIcon(appointment.type)}
                              <span className="ml-1">{appointment.type}</span>
                            </div>
                          </div>

                          {appointment.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}>
                                <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}>
                                <XCircle className="h-4 w-4 mr-1" /> Cancel
                              </Button>
                            </>
                          )}

                          {appointment.status === 'confirmed' && (
                            <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => { setSelectedApptForRx(appointment); setPrescriptionOpen(true); }}>
                              <FileText className="h-4 w-4 mr-1" /> Write Rx
                            </Button>
                          )}

                          {appointment.status === 'completed' && appointment.prescription && (
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50" onClick={() => apiService.viewPrescriptionPdf(appointment.prescription)}>
                              <FileText className="h-4 w-4 mr-1" /> View Rx PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
                      <p className="mt-1 text-sm text-gray-500">No appointments match your filter criteria.</p>
                    </div>
                  )}
                </div>

                {/* Digital Prescription Dialog */}
                <Dialog open={prescriptionOpen} onOpenChange={setPrescriptionOpen}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5" /> Digital Prescription for {selectedApptForRx?.patientName}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div>
                        <label className="text-xs font-semibold text-gray-600">Diagnosis</label>
                        <Input 
                          placeholder="e.g. Acute Upper Respiratory Infection"
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-semibold text-gray-600">Medicine Name</label>
                          <Input 
                            placeholder="e.g. Paracetamol 650mg"
                            value={medicineName}
                            onChange={(e) => setMedicineName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600">Dosage</label>
                          <Input 
                            placeholder="e.g. 1 Tablet"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600">Frequency</label>
                        <select 
                          className="w-full border rounded-md p-2 text-sm bg-background"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                        >
                          <option value="Once daily">Once daily (OD)</option>
                          <option value="Twice daily">Twice daily (BD)</option>
                          <option value="Thrice daily">Thrice daily (TDS)</option>
                          <option value="As needed">As needed (PRN)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600">Special Instructions</label>
                        <Textarea 
                          placeholder="e.g. Take after meals with warm water"
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600">Doctor Advice</label>
                        <Input 
                          placeholder="e.g. Drink plenty of fluids and rest 3 days"
                          value={advice}
                          onChange={(e) => setAdvice(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPrescriptionOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreatePrescription}>Issue Prescription</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patients" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>
                  View and manage your patient information and medical history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <Card key={patient.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={patient.avatar} alt={patient.name} />
                              <AvatarFallback className="bg-gray-200">
                                {patient.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <h3 className="font-medium">{patient.name}</h3>
                              <p className="text-sm text-gray-500">{patient.age}y, {patient.gender}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">Conditions:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {patient.conditions.map((condition, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search to find what you're looking for.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Track your recent actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                        <div className="mr-3 mt-1">
                          {activity.type === "prescription" && <FileText className="h-5 w-5 text-blue-500" />}
                          {activity.type === "lab" && <FileText className="h-5 w-5 text-green-500" />}
                          {activity.type === "appointment" && <Calendar className="h-5 w-5 text-purple-500" />}
                          {activity.type === "treatment" && <FileText className="h-5 w-5 text-amber-500" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{activity.patient}</h3>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                      <p className="mt-1 text-sm text-gray-500">There's no recent activity to show.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;