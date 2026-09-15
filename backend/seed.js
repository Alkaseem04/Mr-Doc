// Seed script for MR.DOC Healthcare Platform
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Hospital = require('./models/Hospital');
const Medicine = require('./models/Medicine');
const Symptom = require('./models/Symptom');
const Disease = require('./models/Disease');
const Diet = require('./models/Diet');

// Load environment variables
const result = dotenv.config({ path: '.env.local' });
if (result.error) {
  dotenv.config();
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mrdoc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@mrdoc.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'Dr. Smith',
    email: 'dr.smith@mrdoc.com',
    password: 'doctor123',
    role: 'doctor',
    isVerified: true
  },
  {
    name: 'John Doe',
    email: 'john.doe@mrdoc.com',
    password: 'patient123',
    role: 'patient',
    isVerified: true
  }
];

const doctors = [
  {
    user: null, // Will be populated after user creation
    specialization: 'Cardiology',
    licenseNumber: 'DOC123456',
    experience: 10,
    consultationFee: 500,
    availability: {
      monday: '10:00-17:00',
      tuesday: '10:00-17:00',
      wednesday: '10:00-17:00',
      thursday: '10:00-17:00',
      friday: '10:00-17:00',
      saturday: '10:00-14:00',
      sunday: 'Closed'
    },
    rating: 4.8,
    totalRatings: 120
  }
];

const patients = [
  {
    user: null, // Will be populated after user creation
    dateOfBirth: new Date('1990-05-15'),
    gender: 'Male',
    bloodGroup: 'O+',
    height: 175,
    weight: 70,
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+91 9876543210'
    }
  }
];

const hospitals = [
  {
    name: 'KEM Hospital',
    address: {
      street: 'Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400012',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [72.8296, 18.9961]
    },
    phone: '+91 22 2410 1111',
    emergencyPhone: '+91 22 2410 1111',
    website: 'https://www.kemhospitalmumbai.org',
    verified: true,
    placeId: 'ChIJf7Ou2xUDDTkRQKjUzVvXz7g',
    rating: 4.4,
    totalRatings: 85
  },
  {
    name: 'Saifee Hospital',
    address: {
      street: 'Opposite Chhabildas High School, Charni Road East, Opera House',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400007',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [72.8189, 18.9546]
    },
    phone: '+91 22 6657 3333',
    emergencyPhone: '+91 22 6657 3333',
    website: 'https://www.saifeehospital.com',
    verified: true,
    placeId: 'ChIJf7Ou2xUDDTkRQKjUzVvXz7e',
    rating: 4.2,
    totalRatings: 67
  }
];

const medicines = [
  {
    name: 'Lisinopril',
    brand: 'Prinivil',
    category: 'Cardiovascular',
    description: 'Used to treat high blood pressure and heart failure',
    uses: ['Hypertension', 'Heart failure'],
    sideEffects: ['Dizziness', 'Headache', 'Fatigue'],
    dosage: '5mg to 40mg once daily',
    precautions: ['Monitor kidney function', 'Avoid potassium supplements']
  },
  {
    name: 'Metformin',
    brand: 'Glucophage',
    category: 'Endocrinology',
    description: 'Used to treat type 2 diabetes',
    uses: ['Type 2 diabetes'],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
    dosage: '500mg to 2000mg daily',
    precautions: ['Avoid with kidney problems', 'Take with meals']
  }
];

const symptoms = [
  {
    name: 'Headache',
    bodyPart: 'Head',
    description: 'Pain in any region of the head',
    commonCauses: ['Stress', 'Dehydration', 'Eye strain'],
    severity: 'moderate'
  },
  {
    name: 'Fever',
    bodyPart: 'Whole Body',
    description: 'Elevated body temperature',
    commonCauses: ['Infection', 'Inflammation', 'Heat exposure'],
    severity: 'moderate'
  }
];

const diseases = [
  {
    name: 'Common Cold',
    description: 'A viral infection of your nose and throat',
    symptoms: ['runny nose', 'sore throat', 'cough', 'congestion'],
    treatment: ['Rest', 'Stay hydrated', 'Use saline nasal spray'],
    medication: ['Acetaminophen', 'Ibuprofen'],
    diet: ['Warm soups', 'Citrus fruits', 'Ginger tea'],
    urgency: 'self-care',
    tests: []
  },
  {
    name: 'Hypertension',
    description: 'A condition in which the force of the blood against your artery walls is too high',
    symptoms: ['headache', 'shortness of breath', 'nosebleeds'],
    treatment: ['Lifestyle changes', 'Medication management'],
    medication: ['Lisinopril', 'Amlodipine'],
    diet: ['Low sodium diet', 'Fruits and vegetables', 'Whole grains'],
    urgency: 'consult-doctor',
    tests: ['Blood pressure monitoring', 'Echocardiogram']
  }
];

const diets = [
  {
    condition: 'Diabetes',
    title: 'Low Glycemic Index Diet Plan',
    description: 'Nutritional plan tailored for blood sugar control and insulin management.',
    recommendations: [{ food: 'Oats & Vegetables', benefits: 'Sustained energy', portion: '1 bowl' }],
    foodsToAvoid: [{ food: 'Sugary Soda', reason: 'Spikes blood glucose' }],
    mealPlan: { breakfast: 'Oatmeal', lunch: 'Salad with Grilled Chicken', dinner: 'Steamed Fish & Veggies', snacks: 'Almonds' }
  },
  {
    condition: 'Hypertension',
    title: 'DASH Heart-Healthy Diet Plan',
    description: 'Dietary Approaches to Stop Hypertension with controlled sodium intake.',
    recommendations: [{ food: 'Spinach & Bananas', benefits: 'Rich in potassium', portion: '1 serving' }],
    foodsToAvoid: [{ food: 'Canned Soups', reason: 'High sodium content' }],
    mealPlan: { breakfast: 'Fruit Smoothie', lunch: 'Quinoa Bowl', dinner: 'Baked Salmon', snacks: 'Greek Yogurt' }
  }
];

// Seed function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Doctor.deleteMany();
    await Patient.deleteMany();
    await Hospital.deleteMany();
    await Medicine.deleteMany();
    await Symptom.deleteMany();
    await Disease.deleteMany();
    await Diet.deleteMany();
    
    console.log('Existing data cleared');
    
    // Create users
    const createdUsers = await User.create(users);
    console.log('Users created:', createdUsers.length);
    
    // Update doctor and patient with user IDs
    doctors[0].user = createdUsers[1]._id;
    patients[0].user = createdUsers[2]._id;
    
    // Create doctors
    const createdDoctors = await Doctor.create(doctors);
    console.log('Doctors created:', createdDoctors.length);
    
    // Create patients
    const createdPatients = await Patient.create(patients);
    console.log('Patients created:', createdPatients.length);
    
    // Create hospitals
    const createdHospitals = await Hospital.create(hospitals);
    console.log('Hospitals created:', createdHospitals.length);
    
    // Create medicines
    const createdMedicines = await Medicine.create(medicines);
    console.log('Medicines created:', createdMedicines.length);
    
    // Create symptoms
    const createdSymptoms = await Symptom.create(symptoms);
    console.log('Symptoms created:', createdSymptoms.length);
    
    // Create diseases
    const createdDiseases = await Disease.create(diseases);
    console.log('Diseases created:', createdDiseases.length);
    
    // Create diets
    const createdDiets = await Diet.create(diets);
    console.log('Diets created:', createdDiets.length);
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
if (process.argv[2] === '--import') {
  seedData();
}

// Delete data
if (process.argv[2] === '--delete') {
  const deleteData = async () => {
    try {
      await User.deleteMany();
      await Doctor.deleteMany();
      await Patient.deleteMany();
      await Hospital.deleteMany();
      await Medicine.deleteMany();
      await Symptom.deleteMany();
      await Disease.deleteMany();
      await Diet.deleteMany();
      
      console.log('Data deleted successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error deleting data:', error);
      process.exit(1);
    }
  };
  
  deleteData();
}