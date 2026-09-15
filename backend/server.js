const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

const path = require('path');

// Load environment variables relative to backend directory
dotenv.config({ path: path.join(__dirname, '.env.local') });
dotenv.config({ path: path.join(__dirname, '.env') });

// Create Express app
const app = express();

// Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Sanitize data to prevent MongoDB operator injection
app.use(mongoSanitize());

// Enable CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mrdoc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.log('Continuing to run server without database connection...');
});

// Database availability middleware for database-backed API endpoints
const checkDbAvailability = (req, res, next) => {
  // Allow health, root, and AI chat (which has fallback) even if DB is offline
  if (req.path === '/' || req.path === '/health' || req.path.startsWith('/chat')) {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is currently offline or unreachable. Please start MongoDB service or verify connection string.'
    });
  }
  next();
};

app.use('/api', checkDbAvailability);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/symptoms', require('./routes/symptoms'));
app.use('/api/diet', require('./routes/diet'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/security-logs', require('./routes/securityLogs'));
app.use('/api/vitals', require('./routes/vitals'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/chat', require('./routes/chat'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: messages
    });
  }
  
  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate Field Value Entered'
    });
  }
  
  // Handle mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Resource not found'
    });
  }
  
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;