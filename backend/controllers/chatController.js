// AI Health Assistant Controller
const { generateChatResponse } = require('../services/aiService');

const medicalKnowledge = [
  {
    keywords: ["headache", "migraine", "head pain"],
    response: "Headaches can be caused by tension, dehydration, eye strain, or migraines. Recommend: Drink plenty of water, rest in a quiet dark room, and consider OTC relievers like paracetamol/ibuprofen if appropriate. Seek immediate care if accompanied by sudden onset, fever, or neck stiffness."
  },
  {
    keywords: ["fever", "temperature", "chills", "feverish"],
    response: "A fever indicates your body is fighting an infection. Stay hydrated, rest, and monitor your temperature. Use paracetamol if needed. Consult a doctor if fever stays above 102°F (38.9°C) or lasts more than 3 days."
  },
  {
    keywords: ["cough", "cold", "flu", "sore throat", "runny nose"],
    response: "For cold & flu symptoms: Rest, drink warm fluids, use saline gargles for sore throat, and stay warm. If breathing difficulty, chest tightness, or blood in phlegm occurs, visit an emergency clinic."
  },
  {
    keywords: ["stomach", "acidity", "gas", "nausea", "vomiting", "diarrhea"],
    response: "Digestive discomfort often improves with light foods (BRAT diet: Banana, Rice, Applesauce, Toast), ORS fluids, and avoiding spicy/fatty items. Seek urgent medical care if you experience severe abdominal pain, persistent vomiting, or dehydration."
  },
  {
    keywords: ["bp", "blood pressure", "hypertension", "high bp"],
    response: "Normal blood pressure is around 120/80 mmHg. For high BP: reduce sodium intake, engage in light walking, avoid stress, and take prescribed anti-hypertensives regularly. Seek immediate emergency care if BP exceeds 180/120."
  },
  {
    keywords: ["sugar", "diabetes", "glucose"],
    response: "Fasting blood sugar should ideally be between 70-99 mg/dL. Maintain a low-glycemic high-fiber diet, stay physically active, and monitor blood sugar levels as recommended by your endocrinologist."
  }
];

// @desc    Process health AI query
// @route   POST /api/chat
// @access  Public / Private
const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Please provide a valid text query' });
    }

    // Attempt Gemini AI Service call
    const aiResult = await generateChatResponse(message);
    if (aiResult && aiResult.reply) {
      return res.status(200).json({ reply: aiResult.reply });
    }

    // Knowledge base matching fallback
    const queryLower = message.toLowerCase();
    let matchedResponse = null;
    for (const item of medicalKnowledge) {
      if (item.keywords.some(kw => queryLower.includes(kw))) {
        matchedResponse = item.response;
        break;
      }
    }

    if (!matchedResponse) {
      matchedResponse = `Thank you for sharing your concern. While I can assist with general health information regarding symptoms, vitals, and wellness, please make sure to consult a licensed healthcare professional for precise diagnosis and treatment plans. Feel free to describe any specific symptoms like fever, headache, cold, or high blood pressure!`;
    }

    // Add disclaimer to fallback
    if (!matchedResponse.includes('Disclaimer') && !matchedResponse.includes('licensed healthcare professional')) {
      matchedResponse += '\n\n*Disclaimer: I am an AI health assistant. Consult a qualified doctor for clinical diagnosis.*';
    }

    return res.status(200).json({ reply: matchedResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  handleChat
};

