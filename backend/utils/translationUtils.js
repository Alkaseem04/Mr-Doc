// Translation utilities for multilingual support
const translations = {
  'en': {
    // Navigation
    'home': 'Home',
    'symptom_checker': 'Symptom Checker',
    'doctors': 'Doctors',
    'appointments': 'Appointments',
    'emergency': 'Emergency',
    'medicine': 'Medicine',
    'diet': 'Diet',
    'chat': 'Chat',
    'profile': 'Profile',
    
    // Common terms
    'search': 'Search',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View',
    'call': 'Call',
    'email': 'Email',
    'whatsapp': 'WhatsApp',
    
    // Symptom Checker
    'symptom_checker_title': 'Symptom Checker',
    'describe_symptoms': 'Describe your symptoms',
    'enter_symptoms': 'Enter your symptoms...',
    'check_symptoms': 'Check Symptoms',
    'possible_conditions': 'Possible Conditions',
    'condition': 'Condition',
    'confidence': 'Confidence',
    'urgency': 'Urgency',
    'treatment': 'Treatment',
    'medication': 'Medication',
    'diet_plan': 'Diet Plan',
    
    // Emergency
    'emergency_services': 'Emergency Services',
    'emergency_contacts': 'Emergency Contacts',
    'nearest_hospitals': 'Nearest Hospitals',
    'directions': 'Directions',
    'verified': 'Verified',
    
    // Medicine
    'medicine_info': 'Medicine Information',
    'medicine_name': 'Medicine Name',
    'uses': 'Uses',
    'side_effects': 'Side Effects',
    'dosage': 'Dosage',
    
    // Diet
    'diet_recommendations': 'Diet Recommendations',
    'personalized_diet': 'Personalized Diet Plan',
    'based_on_condition': 'Based on your condition',
    
    // Chat
    'chat_with_doctor': 'Chat with Doctor',
    'ai_assistant': 'AI Assistant',
    'type_message': 'Type your message...',
    'send': 'Send',
    
    // Profile
    'patient_profile': 'Patient Profile',
    'health_history': 'Health History',
    'reports': 'Reports',
    'sensor_stats': 'Sensor Stats',
    
    // Authentication
    'login': 'Login',
    'register': 'Register',
    'logout': 'Logout',
    'username': 'Username',
    'password': 'Password',
    'email': 'Email',
    'phone': 'Phone',
    
    // Notifications
    'notifications': 'Notifications',
    'medicine_reminders': 'Medicine Reminders',
    'appointment_reminders': 'Appointment Reminders',
    
    // Errors
    'error_occurred': 'An error occurred',
    'try_again': 'Please try again',
    
    // Success
    'success': 'Success',
    'operation_completed': 'Operation completed successfully'
  },
  'hi': {
    // Navigation
    'home': 'होम',
    'symptom_checker': 'लक्षण चेकर',
    'doctors': 'डॉक्टर',
    'appointments': 'अपॉइंटमेंट',
    'emergency': 'आपातकालीन',
    'medicine': 'दवा',
    'diet': 'आहार',
    'chat': 'चैट',
    'profile': 'प्रोफ़ाइल',
    
    // Common terms
    'search': 'खोज',
    'submit': 'जमा करें',
    'cancel': 'रद्द करें',
    'save': 'सहेजें',
    'delete': 'हटाएँ',
    'edit': 'संपादित करें',
    'view': 'देखें',
    'call': 'कॉल करें',
    'email': 'ईमेल',
    'whatsapp': 'व्हाट्सएप',
    
    // Symptom Checker
    'symptom_checker_title': 'लक्षण चेकर',
    'describe_symptoms': 'अपने लक्षणों का वर्णन करें',
    'enter_symptoms': 'अपने लक्षण दर्ज करें...',
    'check_symptoms': 'लक्षण जांचें',
    'possible_conditions': 'संभावित स्थितियाँ',
    'condition': 'स्थिति',
    'confidence': 'आत्मविश्वास',
    'urgency': 'तत्परता',
    'treatment': 'उपचार',
    'medication': 'दवा',
    'diet_plan': 'आहार योजना',
    
    // Emergency
    'emergency_services': 'आपातकालीन सेवाएँ',
    'emergency_contacts': 'आपातकालीन संपर्क',
    'nearest_hospitals': 'निकटतम अस्पताल',
    'directions': 'दिशाएँ',
    'verified': 'सत्यापित',
    
    // Medicine
    'medicine_info': 'दवा जानकारी',
    'medicine_name': 'दवा का नाम',
    'uses': 'उपयोग',
    'side_effects': 'साइड इफेक्ट्स',
    'dosage': 'खुराक',
    
    // Diet
    'diet_recommendations': 'आहार की सिफारिशें',
    'personalized_diet': 'व्यक्तिगत आहार योजना',
    'based_on_condition': 'आपकी स्थिति के आधार पर',
    
    // Chat
    'chat_with_doctor': 'डॉक्टर से चैट करें',
    'ai_assistant': 'एआई सहायक',
    'type_message': 'अपना संदेश टाइप करें...',
    'send': 'भेजें',
    
    // Profile
    'patient_profile': 'रोगी प्रोफ़ाइल',
    'health_history': 'स्वास्थ्य इतिहास',
    'reports': 'रिपोर्ट्स',
    'sensor_stats': 'सेंसर आँकड़े',
    
    // Authentication
    'login': 'लॉग इन करें',
    'register': 'रजिस्टर करें',
    'logout': 'लॉग आउट',
    'username': 'उपयोगकर्ता नाम',
    'password': 'पासवर्ड',
    'email': 'ईमेल',
    'phone': 'फ़ोन',
    
    // Notifications
    'notifications': 'सूचनाएँ',
    'medicine_reminders': 'दवा अनुस्मारक',
    'appointment_reminders': 'अपॉइंटमेंट अनुस्मारक',
    
    // Errors
    'error_occurred': 'एक त्रुटि हुई',
    'try_again': 'कृपया पुनः प्रयास करें',
    
    // Success
    'success': 'सफलता',
    'operation_completed': 'ऑपरेशन सफलतापूर्वक पूरा हुआ'
  },
  'mr': {
    // Navigation
    'home': 'होम',
    'symptom_checker': 'लक्षण तपासणारा',
    'doctors': 'डॉक्टर',
    'appointments': 'अपॉइंटमेंट',
    'emergency': 'आणीबाणी',
    'medicine': 'औषध',
    'diet': 'आहार',
    'chat': 'गप्पा',
    'profile': 'प्रोफाइल',
    
    // Common terms
    'search': 'शोधा',
    'submit': 'सबमिट करा',
    'cancel': 'रद्द करा',
    'save': 'जतन करा',
    'delete': 'हटवा',
    'edit': 'संपादित करा',
    'view': 'पहा',
    'call': 'कॉल करा',
    'email': 'ईमेल',
    'whatsapp': 'व्हॉट्सॲप',
    
    // Symptom Checker
    'symptom_checker_title': 'लक्षण तपासणारा',
    'describe_symptoms': 'तुमच्या लक्षणांचे वर्णन करा',
    'enter_symptoms': 'तुमची लक्षणे प्रविष्ट करा...',
    'check_symptoms': 'लक्षणे तपासा',
    'possible_conditions': 'संभाव्य परिस्थिती',
    'condition': 'परिस्थिती',
    'confidence': 'आत्मविश्वास',
    'urgency': 'तातडी',
    'treatment': 'उपचार',
    'medication': 'औषध',
    'diet_plan': 'आहार योजना',
    
    // Emergency
    'emergency_services': 'आणीबाणी सेवा',
    'emergency_contacts': 'आणीबाणी संपर्क',
    'nearest_hospitals': 'जवळचे रुग्णालय',
    'directions': 'दिशा',
    'verified': 'सत्यापित',
    
    // Medicine
    'medicine_info': 'औषध माहिती',
    'medicine_name': 'औषधाचे नाव',
    'uses': 'वापर',
    'side_effects': 'बाजूचे परिणाम',
    'dosage': 'खुराक',
    
    // Diet
    'diet_recommendations': 'आहार शिफारसी',
    'personalized_diet': 'वैयक्तिकृत आहार योजना',
    'based_on_condition': 'तुमच्या परिस्थितीवर आधारित',
    
    // Chat
    'chat_with_doctor': 'डॉक्टरांशी गप्पा मारा',
    'ai_assistant': 'एआय सहाय्यक',
    'type_message': 'तुमचा संदेश टाइप करा...',
    'send': 'पाठवा',
    
    // Profile
    'patient_profile': 'रुग्ण प्रोफाइल',
    'health_history': 'आरोग्य इतिहास',
    'reports': 'अहवाल',
    'sensor_stats': 'सेन्सर आकडेवारी',
    
    // Authentication
    'login': 'लॉग इन करा',
    'register': 'नोंदणी करा',
    'logout': 'लॉग आउट',
    'username': 'वापरकर्तानाव',
    'password': 'पासवर्ड',
    'email': 'ईमेल',
    'phone': 'फोन',
    
    // Notifications
    'notifications': 'सूचना',
    'medicine_reminders': 'औषध आठवण',
    'appointment_reminders': 'अपॉइंटमेंट आठवण',
    
    // Errors
    'error_occurred': 'एक त्रुटी आली',
    'try_again': 'कृपया पुन्हा प्रयत्न करा',
    
    // Success
    'success': 'यश',
    'operation_completed': 'ऑपरेशन यशस्वीरित्या पूर्ण झाले'
  }
};

// Function to detect language (simplified version)
const detectLanguage = (text) => {
  // This is a simplified version - in production, you would use a proper language detection library
  // or Google Translate API for language detection
  
  // Check for Hindi characters
  const hindiRegex = /[\u0900-\u097F]/;
  // Check for Marathi characters
  const marathiRegex = /[\u0900-\u097F]/; // Marathi uses similar script to Hindi
  
  if (hindiRegex.test(text)) {
    // Further check to distinguish between Hindi and Marathi
    // This is a simplified approach - in reality, you'd need more sophisticated detection
    return 'hi';
  }
  
  // Default to English
  return 'en';
};

// Function to translate text
const translateText = (text, targetLanguage, sourceLanguage = null) => {
  // If source language is not provided, detect it
  if (!sourceLanguage) {
    sourceLanguage = detectLanguage(text);
  }
  
  // If source and target languages are the same, return original text
  if (sourceLanguage === targetLanguage) {
    return text;
  }
  
  // Get translation from dictionary
  const translation = translations[targetLanguage]?.[text.toLowerCase()];
  
  // Return translated text or original if not found
  return translation || text;
};

// Function to translate an object with multiple fields
const translateObject = (obj, targetLanguage, sourceLanguage = null) => {
  const translatedObj = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      translatedObj[key] = translateText(obj[key], targetLanguage, sourceLanguage);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      translatedObj[key] = translateObject(obj[key], targetLanguage, sourceLanguage);
    } else {
      translatedObj[key] = obj[key];
    }
  }
  
  return translatedObj;
};

module.exports = {
  translations,
  detectLanguage,
  translateText,
  translateObject
};