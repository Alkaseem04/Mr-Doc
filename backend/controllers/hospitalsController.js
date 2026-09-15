const Hospital = require('../models/Hospital');
const { google } = require('googleapis');

// Initialize Google Places API client
const placesClient = google.places('v1');

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get hospital by ID
// @route   GET /api/hospitals/:id
// @access  Public
const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json(hospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Search hospitals using Google Places API
// @route   GET /api/hospitals/search
// @access  Public
const searchHospitals = async (req, res) => {
  try {
    const { location, radius = 5000, keyword = 'hospital' } = req.query;
    
    // Check if Google Places API key is configured
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ message: 'Google Places API key not configured' });
    }

    // Initialize Google Places client with API key
    const client = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/places'],
      credentials: {
        private_key: process.env.GOOGLE_PLACES_API_KEY,
        client_email: 'places-api@developer.gserviceaccount.com'
      }
    });

    // For now, we'll use the Places Text Search API
    // In a production environment, you would use the actual Google Places API
    const mockHospitals = [
      {
        name: "Kokilaben Dhirubhai Ambani Hospital",
        address: "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai",
        phone: "+91 22 4000 4000",
        website: "https://www.kokilabenhospital.com",
        rating: 4.5,
        location: {
          lat: 19.1245,
          lng: 72.8247
        },
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7c"
      },
      {
        name: "Jaslok Hospital",
        address: "15, Pedder Street, IT Colony, Tardeo, Mumbai",
        phone: "+91 22 6657 3333",
        website: "https://www.jaslokhospital.net",
        rating: 4.3,
        location: {
          lat: 18.9596,
          lng: 72.8049
        },
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7d"
      },
      {
        name: "Saifee Hospital",
        address: "Opposite Chhabildas High School, Charni Road East, Opera House, Mumbai",
        phone: "+91 22 6657 3333",
        website: "https://www.saifeehospital.com",
        rating: 4.2,
        location: {
          lat: 18.9546,
          lng: 72.8189
        },
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7e"
      },
      {
        name: "City Hospital & Research Centre",
        address: "Central Avenue Road, Near Railway Station, Kurla West, Mumbai",
        phone: "+91 22 2575 1111",
        website: "https://www.cityhospitalmumbai.com",
        rating: 4.0,
        location: {
          lat: 19.0610,
          lng: 72.8620
        },
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7f"
      },
      {
        name: "KEM Hospital",
        address: "Parel, Mumbai, Maharashtra",
        phone: "+91 22 2410 1111",
        website: "https://www.kemhospitalmumbai.org",
        rating: 4.4,
        location: {
          lat: 18.9961,
          lng: 72.8296
        },
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7g"
      }
    ];

    res.status(200).json(mockHospitals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get nearby hospitals using Google Places API
// @route   GET /api/hospitals/nearby
// @access  Public
const getNearbyHospitals = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    // Check if Google Places API key is configured
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ message: 'Google Places API key not configured' });
    }

    // For now, we'll use mock data
    // In a production environment, you would use the actual Google Places API
    const mockNearbyHospitals = [
      {
        name: "Nearby Hospital 1",
        address: "123 Medical Street, City",
        phone: "+91 1234567890",
        website: "https://hospital1.com",
        rating: 4.2,
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        },
        distance: "1.2 km",
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7h"
      },
      {
        name: "Nearby Hospital 2",
        address: "456 Health Avenue, City",
        phone: "+91 0987654321",
        website: "https://hospital2.com",
        rating: 4.0,
        location: {
          lat: parseFloat(lat) + 0.01,
          lng: parseFloat(lng) + 0.01
        },
        distance: "2.5 km",
        placeId: "ChIJf7Ou2xUDDTkRQKjUzVvXz7i"
      }
    ];

    res.status(200).json(mockNearbyHospitals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Verify hospital using Google Places API
// @route   POST /api/hospitals/verify
// @access  Private/Admin
const verifyHospital = async (req, res) => {
  try {
    const { placeId } = req.body;
    
    // Check if Google Places API key is configured
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ message: 'Google Places API key not configured' });
    }

    // For now, we'll use mock data
    // In a production environment, you would use the actual Google Places API
    const mockVerifiedHospital = {
      name: "Verified Hospital",
      address: "123 Verified Street, City",
      phone: "+91 1234567890",
      website: "https://verifiedhospital.com",
      rating: 4.5,
      location: {
        lat: 19.0760,
        lng: 72.8777
      },
      placeId: placeId,
      verified: true,
      verifiedAt: new Date()
    };

    res.status(200).json(mockVerifiedHospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getHospitals,
  getHospitalById,
  searchHospitals,
  getNearbyHospitals,
  verifyHospital
};