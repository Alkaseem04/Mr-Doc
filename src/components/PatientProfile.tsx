import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  Activity, 
  FileText, 
  Upload,
  Edit,
  Save,
  X,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ReportUpload from './ReportUpload';
import { apiService } from '@/services/apiService';

interface HealthMetric {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
}

interface MedicalHistory {
  id: string;
  condition: string;
  diagnosedDate: string;
  status: string;
  notes: string;
}

const PatientProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  const [patientData, setPatientData] = useState({
    name: "John Doe",
    email: "patient@mrdoc.com",
    phone: "+91 9876543210",
    dateOfBirth: "1995-05-15",
    gender: "Male",
    address: "Mumbai, Maharashtra",
    bloodType: "O+",
    height: "175",
    weight: "70"
  });

  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const rxList = await apiService.get('/prescriptions');
      if (Array.isArray(rxList)) {
        setPrescriptions(rxList);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    }
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.get('/patients/me');
      if (data) {
        setPatientData({
          name: data.user?.name || "John Doe",
          email: data.user?.email || "patient@mrdoc.com",
          phone: data.user?.phone || "+91 9876543210",
          dateOfBirth: data.user?.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : "1995-05-15",
          gender: data.user?.gender || "Male",
          address: typeof data.user?.address === 'string' ? data.user.address : (data.user?.address?.street || "Mumbai, Maharashtra"),
          bloodType: data.bloodType || "O+",
          height: data.height ? String(data.height) : "175",
          weight: data.weight ? String(data.weight) : "70"
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await apiService.put('/patients/me', {
        user: {
          name: patientData.name,
          email: patientData.email,
          phone: patientData.phone,
          dateOfBirth: patientData.dateOfBirth,
          gender: patientData.gender,
          address: patientData.address
        },
        bloodType: patientData.bloodType,
        height: Number(patientData.height),
        weight: Number(patientData.weight)
      });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your health and profile details have been saved to database.",
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message || "Could not save profile.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="health-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Patient Profile</h1>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="border-border text-foreground hover:bg-muted">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="health-button">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="health-button">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="health">Health Metrics</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your personal and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={patientData.name}
                          onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-foreground">{patientData.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={patientData.email}
                          onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-foreground">{patientData.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={patientData.phone}
                          onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-foreground">{patientData.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dob"
                          type="date"
                          value={patientData.dateOfBirth}
                          onChange={(e) => setPatientData({...patientData, dateOfBirth: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-foreground">{new Date(patientData.dateOfBirth).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      {isEditing ? (
                        <Input
                          id="gender"
                          value={patientData.gender}
                          onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-foreground">{patientData.gender}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Textarea
                          id="address"
                          value={patientData.address}
                          onChange={(e) => setPatientData({...patientData, address: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-foreground">{patientData.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bloodType">Blood Type</Label>
                        {isEditing ? (
                          <Input
                            id="bloodType"
                            value={patientData.bloodType}
                            onChange={(e) => setPatientData({...patientData, bloodType: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-foreground">{patientData.bloodType}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="height">Height</Label>
                        {isEditing ? (
                          <Input
                            id="height"
                            value={patientData.height}
                            onChange={(e) => setPatientData({...patientData, height: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-foreground">{patientData.height}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="weight">Weight</Label>
                        {isEditing ? (
                          <Input
                            id="weight"
                            value={patientData.weight}
                            onChange={(e) => setPatientData({...patientData, weight: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-foreground">{patientData.weight}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Digital Prescriptions & Medical PDF Downloads
                </CardTitle>
                <CardDescription>
                  View, download, or print official digital prescriptions issued by your doctors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptions.map((rx) => (
                      <div key={rx._id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg text-foreground">
                              Dr. {rx.doctor?.name || 'Practitioner'}
                            </h3>
                            <span className="text-xs px-2.5 py-0.5 bg-primary/10 text-primary font-medium rounded-full">
                              {rx.doctor?.specialization || 'General Physician'}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-primary mt-1">
                            Diagnosis: {rx.diagnosis}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Date: {new Date(rx.createdAt).toLocaleDateString()} | Medicines Count: {rx.medicines?.length || 0}
                          </p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto justify-end">
                          <Button variant="outline" size="sm" onClick={() => apiService.viewPrescriptionPdf(rx._id)}>
                            View PDF
                          </Button>
                          <Button size="sm" className="health-button" onClick={() => apiService.downloadPrescriptionPdf(rx._id)}>
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">No prescriptions found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Digital prescriptions issued during consultations will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Health Metrics
                </CardTitle>
                <CardDescription>
                  Track your vital signs and health measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {healthMetrics.map((metric) => (
                    <Card key={metric.id} className="border-border hover-card">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-foreground">{metric.name}</h3>
                            <p className="text-2xl font-bold text-primary mt-1">
                              {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            metric.trend === 'up' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                            metric.trend === 'down' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(metric.date).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Medical History
                </CardTitle>
                <CardDescription>
                  Your diagnosed conditions and health history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalHistory.map((history) => (
                    <div key={history.id} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-foreground">{history.condition}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          history.status === 'Active' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                          history.status === 'Managed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {history.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Diagnosed: {new Date(history.diagnosedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-foreground mt-2">
                        {history.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Medical Reports
                </CardTitle>
                <CardDescription>
                  Upload and manage your medical reports and documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Button className="health-button">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Report
                  </Button>
                </div>
                <ReportUpload />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientProfile;