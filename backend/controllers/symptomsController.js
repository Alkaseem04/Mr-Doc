const Symptom = require('../models/Symptom');
const Disease = require('../models/Disease');
const { levenshteinDistance, normalizeText, findBestMatch, generateSuggestions } = require('../utils/textUtils');
const medicalDictionary = require('../utils/medicalDictionary');
const { analyzeSymptomsWithAI } = require('../services/aiService');

// @desc    Analyze symptoms and provide possible conditions
// @route   POST /api/symptoms/analyze
// @access  Public
const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, language = 'en' } = req.body;
    
    if (!symptoms || (Array.isArray(symptoms) && symptoms.length === 0)) {
      return res.status(400).json({ message: 'Please provide symptoms' });
    }

    const symptomArray = Array.isArray(symptoms) 
      ? symptoms 
      : symptoms.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
    
    // Normalize and correct spelling for each symptom
    const correctedSymptoms = symptomArray.map(symptom => {
      const normalized = normalizeText(symptom);
      
      // Find best match in medical dictionary
      const bestMatch = findBestMatch(normalized, medicalDictionary);
      
      // If similarity is high enough, suggest correction
      if (bestMatch && bestMatch.similarity > 0.7) {
        return {
          original: symptom,
          corrected: bestMatch.option,
          similarity: bestMatch.similarity,
          needsConfirmation: bestMatch.similarity < 0.85 // Ask confirmation if not high confidence
        };
      }
      
      return {
        original: symptom,
        corrected: normalized,
        similarity: 1.0,
        needsConfirmation: false
      };
    });
    
    // Filter out symptoms that need confirmation
    const confirmedSymptoms = correctedSymptoms
      .filter(s => !s.needsConfirmation)
      .map(s => s.corrected);
    
    // For symptoms that need confirmation, return suggestions
    const suggestions = correctedSymptoms.filter(s => s.needsConfirmation);
    
    if (suggestions.length > 0) {
      return res.status(200).json({
        message: 'Please confirm the following symptom corrections',
        suggestions,
        confirmedSymptoms
      });
    }
    
    // Query diseases matching confirmed symptoms from MongoDB
    const diseases = await Disease.find({
      symptoms: { $in: confirmedSymptoms }
    }).limit(10);

    // Call Real AI Service (grounded with MongoDB Diseases)
    const aiAnalysis = await analyzeSymptomsWithAI(confirmedSymptoms, language, diseases);

    if (aiAnalysis && aiAnalysis.results && aiAnalysis.results.length > 0) {
      return res.status(200).json({
        results: aiAnalysis.results,
        emergencyAlert: aiAnalysis.emergencyAlert || false,
        emergencyMessage: aiAnalysis.emergencyMessage || null,
        disclaimer: aiAnalysis.disclaimer,
        correctedSymptoms
      });
    }
    
    // Database-only fallback
    const results = diseases.map(disease => {
      const matchingSymptoms = disease.symptoms.filter(s => confirmedSymptoms.includes(s));
      const confidence = Math.min(100, Math.round((matchingSymptoms.length / disease.symptoms.length) * 100));
      
      return {
        condition: disease.name,
        confidence,
        description: disease.description,
        symptoms: matchingSymptoms,
        treatment: disease.treatment,
        medication: disease.medication,
        diet: disease.diet,
        urgency: disease.urgency,
        tests: disease.tests
      };
    }).sort((a, b) => b.confidence - a.confidence);
    
    res.status(200).json({
      results,
      correctedSymptoms,
      disclaimer: "This symptom assessment is generated for informational purposes only. Please consult a qualified doctor for professional evaluation."
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// @desc    Get all symptoms
// @route   GET /api/symptoms
// @access  Public
const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.find();
    res.status(200).json(symptoms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get symptom by ID
// @route   GET /api/symptoms/:id
// @access  Public
const getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    
    if (!symptom) {
      return res.status(404).json({ message: 'Symptom not found' });
    }
    
    res.status(200).json(symptom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Search symptoms with fuzzy matching
// @route   GET /api/symptoms/search
// @access  Public
const searchSymptoms = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }
    
    // Get all symptoms from database
    const symptoms = await Symptom.find();
    
    // Perform fuzzy matching
    const matches = symptoms
      .map(symptom => {
        const distance = levenshteinDistance(query.toLowerCase(), symptom.name.toLowerCase());
        const similarity = 1 - (distance / Math.max(query.length, symptom.name.length));
        return { ...symptom._doc, similarity, distance };
      })
      .filter(item => item.similarity > 0.3) // Only return matches with >30% similarity
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity
      .slice(0, 10); // Return top 10 matches
    
    res.status(200).json(matches);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get spell suggestions for a symptom
// @route   GET /api/symptoms/suggestions
// @access  Public
const getSpellSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Please provide a query' });
    }
    
    // Generate suggestions using medical dictionary
    const suggestions = generateSuggestions(query, medicalDictionary, 5);
    
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  analyzeSymptoms,
  getSymptoms,
  getSymptomById,
  searchSymptoms,
  getSpellSuggestions
};