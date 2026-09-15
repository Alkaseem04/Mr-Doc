# MR.DOC Healthcare Platform - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [File Storage Configuration](#file-storage-configuration)
6. [Production Deployment](#production-deployment)
7. [API Documentation](#api-documentation)
8. [Testing](#testing)
9. [Security Considerations](#security-considerations)

## Prerequisites

### System Requirements
- Node.js v16+ (Recommended: v18 LTS)
- MongoDB v4.4+ (or MongoDB Atlas account)
- npm v8+ or yarn v1.22+

### Required Accounts
- MongoDB Atlas (for production database)
- Twilio (for SMS notifications)
- Email service (Gmail, SendGrid, etc.)
- Cloudinary (for media storage - optional)

## Local Development Setup

### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd fitfolio(Mr.Doc)

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```

The frontend will be available at `http://localhost:8081` by default.

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Start backend development server
npm run dev
```

The backend API will be available at `http://localhost:5000` by default.

## Environment Variables

### Frontend (.env)
Create a `.env` file in the root directory:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google Maps API (for hospital locations)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Speech Recognition (for voice input)
VITE_SPEECH_RECOGNITION_ENABLED=true
```

### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/mrdoc

# JWT Secret (change this in production)
JWT_SECRET=mysecretkey

# Email Configuration (for development, using Ethereal)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_ethereal_user
EMAIL_PASS=your_ethereal_password

# Twilio Configuration (for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Google Maps API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key

# Cloudinary (for media uploads)
CLOUDINARY_URL=your_cloudinary_url

# Server Configuration
NODE_ENV=development
PORT=5000
```

## Database Setup

### Local MongoDB Installation
1. Install MongoDB Community Server: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service:
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

### MongoDB Atlas (Recommended for Production)
1. Create a MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Add database user with read/write permissions
4. Add your IP address to the whitelist (or allow access from anywhere for development)
5. Copy the connection string and update `MONGODB_URI` in your `.env` file

### Seeding Initial Data
```bash
# Navigate to backend directory
cd backend

# Import seed data
npm run seed:import

# Delete seed data (if needed)
npm run seed:delete
```

## File Storage Configuration

### Local Storage (Development)
Files are stored in the `backend/uploads` directory by default.

### Cloud Storage (Production - Recommended)
1. Sign up for Cloudinary: https://cloudinary.com/
2. Get your Cloudinary URL from the dashboard
3. Update the `CLOUDINARY_URL` in your backend `.env` file

### AWS S3 (Alternative)
To use AWS S3 for file storage:
1. Create an S3 bucket
2. Create IAM user with S3 permissions
3. Update the file upload logic in `backend/controllers/reportsController.js` to use AWS SDK

## Production Deployment

### Deploying to Vercel (Frontend)
1. Sign up for Vercel: https://vercel.com/
2. Install Vercel CLI: `npm install -g vercel`
3. Deploy:
   ```bash
   # From the root directory
   vercel --prod
   ```

### Deploying to Heroku (Backend)
1. Sign up for Heroku: https://heroku.com/
2. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Create a new Heroku app:
   ```bash
   # From the backend directory
   heroku create your-app-name
   ```
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   # Add other environment variables as needed
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

### Deploying to DigitalOcean (Full Stack)
1. Create a DigitalOcean account: https://www.digitalocean.com/
2. Create a Droplet with Ubuntu
3. SSH into your Droplet
4. Install Node.js, MongoDB, and nginx
5. Clone your repository
6. Set up environment variables
7. Configure nginx as a reverse proxy
8. Use PM2 to run your applications

## API Documentation

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user profile

### Users
- GET `/api/users` - Get all users (Admin only)
- GET `/api/users/:id` - Get user by ID (Admin only)
- PUT `/api/users/:id` - Update user (Admin only)
- DELETE `/api/users/:id` - Delete user (Admin only)

### Doctors
- GET `/api/doctors` - Get all doctors
- GET `/api/doctors/:id` - Get doctor by ID
- POST `/api/doctors` - Create doctor profile
- PUT `/api/doctors/:id` - Update doctor profile
- DELETE `/api/doctors/:id` - Delete doctor profile

### Patients
- GET `/api/patients` - Get all patients
- GET `/api/patients/:id` - Get patient by ID
- POST `/api/patients` - Create patient profile
- PUT `/api/patients/:id` - Update patient profile
- DELETE `/api/patients/:id` - Delete patient profile

### Appointments
- GET `/api/appointments` - Get all appointments
- GET `/api/appointments/:id` - Get appointment by ID
- POST `/api/appointments` - Create appointment
- PUT `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Delete appointment

### Reports
- GET `/api/reports` - Get all reports for current user
- GET `/api/reports/:id` - Get report by ID
- POST `/api/reports` - Upload new report
- PUT `/api/reports/:id` - Update report
- DELETE `/api/reports/:id` - Delete report
- GET `/api/reports/admin/all` - Get all reports (Admin only)

## Testing

### Frontend Testing
```bash
# Run frontend tests
npm test
```

### Backend Testing
```bash
# Navigate to backend directory
cd backend

# Run backend tests
npm test
```

### Manual Testing Checklist
1. Theme toggle works across all pages
2. Navigation links route correctly
3. Symptom voice input works in all three languages (English, Hindi, Marathi)
4. Signup/Login flows work for both Patient and Doctor roles
5. Book Appointment flow completes end-to-end
6. File upload, preview, and download work
7. Hospital links open external sites in new tabs
8. Admin Users page lists and can disable users
9. Mobile responsiveness works on all pages
10. Cross-browser compatibility (Chrome, Firefox, Safari on iOS)

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with 12 rounds
- Minimum password length is 6 characters
- Password strength validation is implemented

### Authentication
- JWT tokens are used for authentication
- Tokens expire after 30 days
- Tokens are stored in httpOnly cookies for web clients

### Data Protection
- All data is transmitted over HTTPS in production
- CORS is properly configured
- Input validation is implemented on both frontend and backend
- MongoDB injection prevention is in place

### File Upload Security
- File type validation (PDF, PNG, JPG only)
- File size limit (10MB maximum)
- Files are stored outside the web root
- Unique filenames are generated for uploads

### Rate Limiting
- API rate limiting is implemented (100 requests per 15 minutes)
- Authentication endpoints have stricter rate limiting (5 attempts per 15 minutes)

### Error Handling
- Detailed error messages are only shown in development
- Sensitive information is masked in logs
- Proper HTTP status codes are returned for all responses