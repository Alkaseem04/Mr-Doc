import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  onLanguageDetected?: (language: string) => void;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, onLanguageDetected, className }) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(prev => prev + transcript + ' ');
          // Detect language from final transcript
          detectLanguage(transcript);
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: "Voice input error",
        description: `Error: ${event.error}`,
        variant: "destructive"
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const detectLanguage = (text: string) => {
    // Simple language detection based on character sets
    const hindiRegex = /[\u0900-\u097F]/;
    const marathiRegex = /[\u0900-\u097F]/; // Marathi uses Devanagari script like Hindi
    
    if (hindiRegex.test(text)) {
      setLanguage('hi-IN');
      if (onLanguageDetected) onLanguageDetected('hi');
    } else {
      setLanguage('en-US');
      if (onLanguageDetected) onLanguageDetected('en');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
      
      // Auto-stop after 10 seconds
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
    } catch (error) {
      console.error('Error starting speech recognition', error);
      toast({
        title: "Voice input error",
        description: "Failed to start voice input. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Send final transcript
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
    } catch (error) {
      console.error('Error stopping speech recognition', error);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    onTranscript('');
  };

  if (!isSupported) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={toggleListening}
          className="flex items-center gap-2"
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Voice Input
            </>
          )}
        </Button>
        
        {transcript && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetTranscript}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
      
      {transcript && (
        <div className="mt-2 p-3 bg-muted rounded-md">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
      
      {isListening && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span>Listening...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;