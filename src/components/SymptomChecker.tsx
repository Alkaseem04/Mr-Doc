import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Clock, Stethoscope, Pill, Apple, TestTube, Zap, Mic, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import SEO from './SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceInput from './VoiceInput';

interface Symptom {
  id: string;
  name: string;
  description: string;
}

interface DiseaseResult {
  condition: string;
  confidence: number;
  description: string;
  symptoms: string[];
  treatment: string[];
  medication: string[];
  diet: string[];
  urgency: 'self-care' | 'consult-doctor' | 'emergency';
  tests: string[];
}

interface SymptomCorrection {
  original: string;
  corrected: string;
  similarity: number;
  needsConfirmation: boolean;
}

import { apiService } from '@/services/apiService';

const SymptomChecker = () => {
  const { t, language } = useLanguage();
  const [symptoms, setSymptoms] = useState<string>('');
  const [results, setResults] = useState<DiseaseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SymptomCorrection[]>([]);
  const [confirmedSymptoms, setConfirmedSymptoms] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('en');
  const [emergencyAlert, setEmergencyAlert] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);

  const executeAnalysis = async (symptomList: string[]) => {
    setLoading(true);
    setError(null);
    setEmergencyAlert(false);
    setEmergencyMessage(null);

    try {
      const data = await apiService.post('/symptoms/analyze', {
        symptoms: symptomList,
        language: detectedLanguage || language
      });

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setConfirmedSymptoms(data.confirmedSymptoms || []);
        setShowSuggestions(true);
        setLoading(false);
        return;
      }

      if (data.results) {
        setResults(data.results);
        setEmergencyAlert(data.emergencyAlert || false);
        setEmergencyMessage(data.emergencyMessage || null);
        if (data.disclaimer) setDisclaimer(data.disclaimer);
        setShowSuggestions(false);
      }
    } catch (err: any) {
      setError(err.message || t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError(t('describe_symptoms'));
      return;
    }

    const symptomList = symptoms.split(/[,;\n]/).map(s => s.trim()).filter(s => s.length > 0);
    await executeAnalysis(symptomList);
  };

  const confirmSuggestions = async () => {
    const allSymptoms = [
      ...confirmedSymptoms,
      ...suggestions.map(s => s.corrected)
    ];
    await executeAnalysis(allSymptoms);
  };

  const rejectSuggestions = async () => {
    const originalSymptoms = suggestions.map(s => s.original);
    const allSymptoms = [...confirmedSymptoms, ...originalSymptoms];
    await executeAnalysis(allSymptoms);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setSymptoms(transcript);
  };

  const handleLanguageDetected = (lang: string) => {
    setDetectedLanguage(lang);
  };

  const getUrgencyColor = (urgency: DiseaseResult['urgency']) => {
    switch (urgency) {
      case 'emergency': return 'bg-destructive text-destructive-foreground';
      case 'consult-doctor': return 'bg-yellow-500 text-yellow-900';
      case 'self-care': return 'bg-green-500 text-green-900';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyIcon = (urgency: DiseaseResult['urgency']) => {
    switch (urgency) {
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'consult-doctor': return <Clock className="h-4 w-4" />;
      case 'self-care': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getUrgencyText = (urgency: DiseaseResult['urgency']) => {
    switch (urgency) {
      case 'emergency': return 'Emergency';
      case 'consult-doctor': return 'Consult Doctor';
      case 'self-care': return 'Self Care';
      default: return '';
    }
  };

  return (
    <div id="symptom-checker" className="py-16 bg-background">
      <SEO 
        title={t('symptom_checker_title')}
        description="Check your symptoms and get potential conditions, treatments, and medication recommendations."
        keywords={["symptom checker", "health diagnosis", "medical advice", "healthcare"]}
      />
      
      <div className="health-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('symptom_checker_title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('describe_symptoms')}
          </p>
        </motion.div>

        {showSuggestions ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <Card className="glass-effect border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Symptom Corrections
                </CardTitle>
                <CardDescription>
                  We found some potential corrections for your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                      <div>
                        <p className="font-medium">
                          <span className="line-through text-muted-foreground">{suggestion.original}</span>
                          <span className="ml-2">→</span>
                          <span className="ml-2 font-semibold">{suggestion.corrected}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {Math.round(suggestion.similarity * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={confirmSuggestions} className="health-button flex-1">
                    Accept All
                  </Button>
                  <Button onClick={rejectSuggestions} variant="outline" className="flex-1 border-border text-foreground hover:bg-muted">
                    Use Original
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <Card className="glass-effect border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Describe Your Symptoms
                </CardTitle>
                <CardDescription>
                  Enter your symptoms separated by commas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder={t('enter_symptoms')}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-[120px] form-input"
                  />
                  <VoiceInput 
                    onTranscript={handleVoiceTranscript}
                    onLanguageDetected={handleLanguageDetected}
                  />
                  {detectedLanguage !== 'en' && (
                    <div className="text-sm text-muted-foreground">
                      Detected language: {detectedLanguage === 'hi' ? 'Hindi' : 'Marathi'}
                    </div>
                  )}
                  {error && (
                    <p className="text-destructive text-sm">{error}</p>
                  )}
                  <Button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="health-button w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        {t('check_symptoms')}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {emergencyAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto mb-8 p-4 bg-destructive/15 border-2 border-destructive rounded-xl text-destructive dark:text-red-400 flex items-start gap-4 shadow-lg"
          >
            <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">EMERGENCY ALERT: Immediate Attention Required</h4>
              <p className="text-sm font-medium mb-3">
                {emergencyMessage || "One or more described symptoms indicate a potentially serious emergency condition. Please seek immediate emergency medical care or call 108 immediately."}
              </p>
              <div className="flex gap-3">
                <Button variant="destructive" size="sm" onClick={() => window.location.href = 'tel:108'}>
                  Call Emergency (108)
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/emergency'}>
                  View Nearby Hospitals
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('possible_conditions')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-effect border-border hover-card h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{result.condition}</CardTitle>
                        <Badge className={getUrgencyColor(result.urgency)}>
                          <div className="flex items-center gap-1">
                            {getUrgencyIcon(result.urgency)}
                            {getUrgencyText(result.urgency)}
                          </div>
                        </Badge>
                      </div>
                      <CardDescription>
                        Confidence: {result.confidence}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground mb-4">{result.description}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-primary" />
                            {t('symptoms')}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.symptoms.map((symptom, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-muted text-muted-foreground">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Pill className="h-4 w-4 text-primary" />
                            {t('treatment')}
                          </h4>
                          <ul className="space-y-1">
                            {result.treatment.map((treatment, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                <span className="mr-2">•</span>
                                <span>{treatment}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Apple className="h-4 w-4 text-primary" />
                            {t('medication')}
                          </h4>
                          <ul className="space-y-1">
                            {result.medication.map((med, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                <span className="mr-2">•</span>
                                <span>{med}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {result.diet.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Apple className="h-4 w-4 text-primary" />
                              {t('diet_plan')}
                            </h4>
                            <ul className="space-y-1">
                              {result.diet.map((diet, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{diet}</span>
                                </li>
                              ))}
                            </ul>
                            <Button variant="link" className="mt-2 p-0 h-auto text-sm">
                              <BookOpen className="h-3 w-3 mr-1" />
                              View detailed diet guide
                            </Button>
                          </div>
                        )}
                        
                        {result.tests.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <TestTube className="h-4 w-4 text-primary" />
                              Recommended Tests
                            </h4>
                            <ul className="space-y-1">
                              {result.tests.map((test, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{test}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <Button className="health-button w-full">
                        Book Appointment
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-muted/60 text-center text-xs text-muted-foreground max-w-3xl mx-auto border border-border">
              <p className="font-semibold mb-1 text-foreground">Medical Disclaimer</p>
              <p>{disclaimer || "This symptom assessment is generated by AI for informational and educational purposes only. It is not a clinical diagnosis or medical advice. Always consult a licensed doctor for accurate diagnosis and personalized treatment."}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;