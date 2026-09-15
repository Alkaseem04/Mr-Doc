import React, { useState, useRef } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, User, Calendar, Clock, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SEO from './SEO';

// Mock data for video consultation
const consultationData = {
  doctor: {
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    image: "https://i.pravatar.cc/150?img=32"
  },
  patient: {
    name: "John Smith",
    age: 35,
    gender: "Male",
    image: "https://i.pravatar.cc/150?img=12"
  },
  appointment: {
    date: "Today",
    time: "10:30 AM",
    concern: "Follow-up on medication"
  }
};

const VideoConsultation = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "doctor", text: "Hello John, how are you feeling today?", time: "10:30 AM" },
    { id: 2, sender: "patient", text: "Hi Dr. Johnson, I'm feeling much better. The medication is working well.", time: "10:31 AM" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const videoRef = useRef(null);

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const endCall = () => {
    // In a real app, this would end the video call
    alert("Call ended");
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const message = {
      id: chatMessages.length + 1,
      sender: "patient",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Video Consultation - Telemedicine with Doctors | Mr.Doc"
        description="Secure video calling between patients and doctors for remote consultations and medical advice."
        keywords={["video consultation", "telemedicine", "online doctor", "remote consultation", "virtual healthcare"]}
      />
      {/* Header */}
      <header className="bg-white shadow">
        <div className="health-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Video className="h-6 w-6 text-health-primary mr-2" />
              <h1 className="text-xl font-bold text-health-primary">Video Consultation</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{consultationData.appointment.date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{consultationData.appointment.time}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="health-container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Consultation Room</CardTitle>
                <CardDescription>
                  Video consultation with {consultationData.doctor.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {/* Doctor's video feed */}
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={consultationData.doctor.image} alt={consultationData.doctor.name} />
                        <AvatarFallback className="bg-health-secondary text-white text-2xl">
                          {consultationData.doctor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-white text-xl font-medium">{consultationData.doctor.name}</h3>
                      <p className="text-gray-300">{consultationData.doctor.specialty}</p>
                    </div>
                  </div>
                  
                  {/* Patient's video feed (small overlay) */}
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
                    {isVideoOn ? (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={consultationData.patient.image} alt={consultationData.patient.name} />
                          <AvatarFallback className="bg-health-primary text-white">
                            {consultationData.patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <VideoOff className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Call controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                    <Button 
                      size="icon" 
                      variant={isAudioOn ? "secondary" : "destructive"}
                      onClick={toggleAudio}
                      className="rounded-full h-12 w-12"
                    >
                      {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant={isVideoOn ? "secondary" : "destructive"}
                      onClick={toggleVideo}
                      className="rounded-full h-12 w-12"
                    >
                      {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant="destructive"
                      onClick={endCall}
                      className="rounded-full h-12 w-12"
                    >
                      <PhoneOff className="h-5 w-5" />
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant="secondary"
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className="rounded-full h-12 w-12"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="rounded-full h-12 w-12"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Consultation details */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Patient</p>
                      <p className="font-medium">{consultationData.patient.name}</p>
                      <p className="text-sm text-gray-500">{consultationData.patient.age}y, {consultationData.patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Concern</p>
                      <p className="font-medium">{consultationData.appointment.concern}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Doctor</p>
                      <p className="font-medium">{consultationData.doctor.name}</p>
                      <p className="text-sm text-gray-500">{consultationData.doctor.specialty}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Panel */}
          <div className={`lg:col-span-1 ${isChatOpen ? 'block' : 'hidden lg:block'}`}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat
                </CardTitle>
                <CardDescription>
                  Send messages during your consultation
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="flex-grow mb-4 overflow-y-auto space-y-4 max-h-96">
                  {chatMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "patient" 
                            ? "bg-health-primary text-white" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === "patient" ? "text-blue-100" : "text-gray-500"}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-health-primary"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    onClick={sendMessage}
                    className="rounded-l-none"
                  >
                    Send
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

export default VideoConsultation;