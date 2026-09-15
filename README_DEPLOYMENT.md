# MR.DOC Healthcare Platform - Deployment Guide

This guide provides detailed instructions for deploying the MR.DOC healthcare platform, a full-featured medical web application with AI-powered symptom analysis, multilingual support, and comprehensive healthcare services.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Frontend Deployment](#frontend-deployment)
5. [Backend Deployment](#backend-deployment)
6. [Database Setup](#database-setup)
7. [API Configuration](#api-configuration)
8. [Deployment Options](#deployment-options)
9. [Security Considerations](#security-considerations)
10. [Monitoring and Maintenance](#monitoring-and-maintenance)

## System Architecture

The MR.DOC platform follows a modern web application architecture:

```
Frontend (React/Vite) ←→ Backend API (Node.js/Express) ←→ MongoDB
                              ↓
                    Third-party Services (Twilio, Google APIs, etc.)
```

### Key Components:
- **Frontend**: React with TypeScript, TailwindCSS, ShadCN/UI
- **Backend**: Node.js with Express, MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **Real-time Features**: Socket.io for notifications and chat
- **Video Consultations**: WebRTC integration
- **External Services**: Google Maps, Twilio, Nodemailer

## Prerequisites

### Development Environment:
- Node.js v16+ (LTS recommended)
- npm v8+ or yarn v1.22+
- MongoDB v4.4+ (local or Atlas)
- Git v2.30+

### External Services:
- Google Maps API Key
- Google Places API Key
- Twilio Account (for SMS notifications)
- Email Service (SMTP configuration for Nodemailer)
- MongoDB Atlas (for production database)

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mr-doc-healthcare
```

### 2. Environment Variables

Create `.env` files in both frontend and backend directories based on the provided examples:

**Frontend (.env):**
```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Twilio (for SMS notifications)
VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

**Backend (.env):**
```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Google APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration (Nodemailer)
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password

# Cloudinary (for media uploads)
CLOUDINARY_URL=your_cloudinary_url
```

## Frontend Deployment

### Development Mode:
```bash
cd mr-doc-healthcare
npm install
npm run dev
```

### Production Build:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

## Backend Deployment

### Development Mode:
```bash
cd backend
npm install
npm run dev
```

### Production Mode:
```bash
npm start
```

### Using PM2 (Recommended for Production):
```bash
npm install -g pm2
pm2 start server.js --name "mrdoc-backend"
pm2 startup
pm2 save
```

## Database Setup

### Local MongoDB:
1. Install MongoDB Community Server
2. Start MongoDB service
3. Update `MONGODB_URI` in `.env` to `mongodb://localhost:27017/mrdoc`

### MongoDB Atlas (Recommended for Production):
1. Create MongoDB Atlas account
2. Create a new cluster
3. Configure database user and network access
4. Get connection string and update `MONGODB_URI` in `.env`

### Seeding Initial Data:
```bash
cd backend
node seed.js
```

## API Configuration

### Google Maps JavaScript API:
1. Enable Google Maps JavaScript API in Google Cloud Console
2. Create API key with Maps JavaScript API enabled
3. Add to `.env` files

### Google Places API:
1. Enable Google Places API in Google Cloud Console
2. Create API key with Places API enabled
3. Add to `.env` files

### Twilio Setup:
1. Create Twilio account
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Add credentials to `.env` files

### Email Configuration:
Configure SMTP settings in `.env`:
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Deployment Options

### Option 1: Vercel + Render (Recommended)

**Frontend (Vercel):**
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

**Backend (Render):**
1. Create new Web Service on Render
2. Connect to GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard

### Option 2: Heroku

**Frontend:**
```bash
heroku create mrdoc-frontend
heroku config:set VITE_API_URL=https://your-backend-url.herokuapp.com/api
git push heroku main
```

**Backend:**
```bash
heroku create mrdoc-backend
heroku addons:create mongolab:sandbox
heroku config:set JWT_SECRET=your_secret_key
git push heroku main
```

### Option 3: AWS (EC2 + S3)

**Frontend (S3 + CloudFront):**
1. Build frontend: `npm run build`
2. Upload `dist` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain and SSL

**Backend (EC2):**
1. Launch EC2 instance (Ubuntu recommended)
2. Install Node.js and MongoDB
3. Deploy application using PM2
4. Configure Nginx as reverse proxy
5. Set up SSL with Let's Encrypt

### Option 4: Docker Deployment

**Docker Compose Setup:**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/mrdoc
    depends_on:
      - mongo
  
  mongo:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## Security Considerations

### 1. Environment Variables:
- Never commit `.env` files to version control
- Use different secrets for development and production
- Rotate secrets regularly

### 2. HTTPS:
- Always use HTTPS in production
- Obtain SSL certificates (Let's Encrypt is free)
- Redirect HTTP to HTTPS

### 3. CORS Configuration:
```javascript
const corsOptions = {
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### 4. Rate Limiting:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

### 5. Input Validation:
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

## Monitoring and Maintenance

### 1. Logging:
```bash
# Frontend logging
npm run build -- --log-level info

# Backend logging
npm install winston
```

### 2. Health Checks:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 3. Backup Strategy:
- Database backups (MongoDB Atlas provides automatic backups)
- Code backups (Git repository)
- Environment configuration backups

### 4. Performance Monitoring:
- Use tools like New Relic or DataDog
- Monitor API response times
- Track database query performance

### 5. Error Tracking:
- Implement Sentry or Rollbar for error tracking
- Set up alerts for critical errors
- Monitor frontend and backend errors separately

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check origin configuration in backend
   - Ensure frontend and backend URLs match

2. **Database Connection Issues:**
   - Verify MongoDB URI
   - Check network connectivity
   - Ensure MongoDB service is running

3. **API Key Errors:**
   - Verify all API keys in `.env` files
   - Check API key restrictions in Google Cloud Console
   - Ensure Twilio credentials are correct

4. **Build Failures:**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall dependencies
   - Check for TypeScript compilation errors

### Support:
For issues not covered in this guide, please:
1. Check the GitHub issues
2. Contact the development team
3. Refer to official documentation for integrated services

---

*This deployment guide is part of the MR.DOC Healthcare Platform documentation. Last updated: November 2025*