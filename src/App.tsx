import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Resources from "./pages/Resources";
import Chat from "./pages/Chat";
import Medicine from "./pages/Medicine";
import Diet from "./pages/Diet";
import HealthTrackingPage from "./pages/HealthTracking";
import DoctorDashboardPage from "./pages/DoctorDashboard";
import VideoConsultationPage from "./pages/VideoConsultation";
import PatientProfilePage from "./pages/PatientProfile";
import AdminUsers from "./pages/AdminUsers";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import DoctorsPage from "./pages/DoctorsPage";
import EmergencyPage from "./pages/EmergencyPage";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChatAssistant from "./components/ChatAssistant";
import SEO from "./components/SEO";
import { defaultSEOTags } from "./utils/seo";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserProvider } from "./contexts/UserContext";
import ThemeTest from "./components/ThemeTest";

const queryClient = new QueryClient();

// Animated routes wrapper component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <SEO 
        title={defaultSEOTags.title}
        description={defaultSEOTags.description}
        keywords={defaultSEOTags.keywords}
        author={defaultSEOTags.author}
        image={defaultSEOTags.image}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:id" element={<Resources />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/medicine" element={<Medicine />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/health-tracking" element={<HealthTrackingPage />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
          <Route path="/video-consultation" element={<VideoConsultationPage />} />
          <Route path="/patient-profile" element={<PatientProfilePage />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <ThemeTest />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            <ChatAssistant />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;