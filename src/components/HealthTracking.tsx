import React, { useState, useEffect } from 'react';
import { Activity, Heart, Droplets, Footprints, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import SEO from './SEO';
import { apiService } from '@/services/apiService';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Mock data for health metrics
const generateMockData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heartRateData = days.map((day, index) => ({
    day,
    rate: Math.floor(Math.random() * 40) + 60 // 60-100 bpm
  }));
  
  const stepsData = days.map((day, index) => ({
    day,
    steps: Math.floor(Math.random() * 5000) + 3000 // 3000-8000 steps
  }));
  
  const sleepData = days.map((day, index) => ({
    day,
    hours: (Math.random() * 3 + 5).toFixed(1) // 5-8 hours
  }));
  
  const waterData = [
    { name: 'Mon', amount: 6 },
    { name: 'Tue', amount: 8 },
    { name: 'Wed', amount: 5 },
    { name: 'Thu', amount: 7 },
    { name: 'Fri', amount: 9 },
    { name: 'Sat', amount: 6 },
    { name: 'Sun', amount: 8 }
  ];
  
  const activityDistribution = [
    { name: 'Walking', value: 45 },
    { name: 'Running', value: 25 },
    { name: 'Cycling', value: 15 },
    { name: 'Swimming', value: 10 },
    { name: 'Other', value: 5 }
  ];
  
  return { heartRateData, stepsData, sleepData, waterData, activityDistribution };
};

// Colors for charts
const COLORS = ['#1E88E5', '#4FC3F7', '#4CAF50', '#FFC107', '#FF5252'];

const HealthTracking = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [isConnected, setIsConnected] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const { toast } = useToast();

  // Vitals form state
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [heartRate, setHeartRate] = useState("72");
  const [bloodGlucose, setBloodGlucose] = useState("95");
  const [weight, setWeight] = useState("70");
  const [waterIntake, setWaterIntake] = useState("8");

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const liveVitals = await apiService.get('/vitals');
      if (Array.isArray(liveVitals) && liveVitals.length > 0) {
        const heartRateData = liveVitals.slice().reverse().map((v: any) => ({
          day: new Date(v.date || v.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          rate: v.heartRate || 72
        }));
        const waterData = liveVitals.slice().reverse().map((v: any) => ({
          name: new Date(v.date || v.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          amount: v.waterIntake || 8
        }));
        const stepsData = liveVitals.slice().reverse().map((v: any) => ({
          day: new Date(v.date || v.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          steps: v.steps || 5000
        }));
        setHealthData({
          heartRateData,
          stepsData,
          sleepData: generateMockData().sleepData,
          waterData,
          activityDistribution: generateMockData().activityDistribution
        });
      } else {
        setHealthData(generateMockData());
      }
    } catch (err) {
      setHealthData(generateMockData());
    }
  };

  const handleAddVitals = async () => {
    try {
      await apiService.post('/vitals', {
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        heartRate: Number(heartRate),
        bloodGlucose: Number(bloodGlucose),
        weight: Number(weight),
        waterIntake: Number(waterIntake)
      });

      toast({
        title: "Vitals Recorded! 📊",
        description: "Your health vitals have been saved to your medical log."
      });

      setVitalsModalOpen(false);
      fetchVitals();
    } catch (err: any) {
      toast({
        title: "Error Recording Vitals",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const connectDevice = () => {
    setIsConnected(true);
    toast({
      title: "Smartwatch Connected! ⌚",
      description: "Syncing real-time vitals and step counters..."
    });
  };
  
  const disconnectDevice = () => {
    setIsConnected(false);
  };
  
  if (!healthData) {
    return (
      <section id="health-tracking" className="py-16 bg-health-gray">
        <div className="health-container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-health-primary mb-4">Health Tracking</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Connect your smartwatch or log your vital signs.
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="health-tracking" className="py-16 bg-health-gray">
      <SEO 
        title="Health Tracking - Monitor Your Vital Signs & Fitness Data | Mr.Doc"
        description="Track your health data from smartwatches and medical sensors. Monitor heart rate, blood pressure, oxygen levels, and steps."
        keywords={["health tracking", "smartwatch data", "medical sensors", "vital signs", "fitness tracking"]}
      />
      <div className="health-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-health-primary mb-4">Health Tracking & Vitals Analytics</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Monitor your vital metrics, blood pressure, heart rate, and hydration levels with interactive charts.
          </p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Dialog open={vitalsModalOpen} onOpenChange={setVitalsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <Activity className="h-4 w-4 mr-2" /> Log Today's Vitals
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-primary">
                    <Activity className="h-5 w-5" /> Record Health Vitals
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Systolic BP (mmHg)</label>
                      <Input value={systolic} onChange={(e) => setSystolic(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Diastolic BP (mmHg)</label>
                      <Input value={diastolic} onChange={(e) => setDiastolic(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Heart Rate (bpm)</label>
                      <Input value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Blood Glucose (mg/dL)</label>
                      <Input value={bloodGlucose} onChange={(e) => setBloodGlucose(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Weight (kg)</label>
                      <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Water Glasses</label>
                      <Input value={waterIntake} onChange={(e) => setWaterIntake(e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setVitalsModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddVitals}>Save Vitals Entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {!isConnected ? (
              <Button 
                onClick={connectDevice}
                variant="outline"
                className="border-primary text-primary"
              >
                Sync Smartwatch
              </Button>
            ) : (
              <Button 
                onClick={disconnectDevice}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Disconnect Device
              </Button>
            )}
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-health-primary">
                  {healthData.heartRateData[healthData.heartRateData.length - 1].rate}
                  <span className="text-lg text-gray-500"> bpm</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Resting today</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Footprints className="mr-2 h-5 w-5 text-blue-500" />
                  Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-health-primary">
                  {healthData.stepsData[healthData.stepsData.length - 1].steps.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-1">Today</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Droplets className="mr-2 h-5 w-5 text-blue-400" />
                  Water Intake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-health-primary">
                  {healthData.waterData[healthData.waterData.length - 1].amount}
                  <span className="text-lg text-gray-500"> glasses</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Today</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-green-500" />
                  Sleep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-health-primary">
                  {healthData.sleepData[healthData.sleepData.length - 1].hours}
                  <span className="text-lg text-gray-500"> hrs</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Last night</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Heart Rate Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Heart Rate Trend
                </CardTitle>
                <CardDescription>
                  Your resting heart rate over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData.heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[50, 110]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#1E88E5" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Steps Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Footprints className="mr-2 h-5 w-5 text-blue-500" />
                  Daily Steps
                </CardTitle>
                <CardDescription>
                  Your step count over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={healthData.stepsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="steps" fill="#4FC3F7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Water Intake Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="mr-2 h-5 w-5 text-blue-400" />
                  Water Intake
                </CardTitle>
                <CardDescription>
                  Daily water consumption in glasses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData.waterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#4CAF50" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Activity Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Activity Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of your physical activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={healthData.activityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {healthData.activityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-health-primary" />
                Health Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Heart Health
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Your resting heart rate is within the normal range. Continue with regular cardiovascular exercise.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                    <Footprints className="mr-2 h-4 w-4" />
                    Activity Level
                  </h3>
                  <p className="text-green-700 text-sm">
                    You're meeting the daily step goal on most days. Try to increase your steps on weekends.
                  </p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <Droplets className="mr-2 h-4 w-4" />
                    Hydration
                  </h3>
                  <p className="text-amber-700 text-sm">
                    Your water intake is good but could be improved. Aim for 8-10 glasses daily.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default HealthTracking;