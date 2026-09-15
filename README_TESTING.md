# Mr. Doc Healthcare Platform - Testing Instructions

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Gmail account for email notifications (or SendGrid/other SMTP service)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mr-doc-healthcare
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` in both root and backend directories
   - Update the variables with your actual values:
     - `MONGODB_URI` - Your MongoDB connection string
     - `JWT_SECRET` - Secret key for JWT tokens
     - `EMAIL_USER` - Your Gmail address (or SMTP username)
     - `EMAIL_PASS` - Your Gmail app password (or SMTP password)
     - `CLIENT_URL` - Frontend URL (http://localhost:8081 for development)

4. **Start the application**
   ```bash
   # Start backend server (in backend directory)
   cd backend
   npm run dev
   
   # Start frontend (in root directory)
   cd ..
   npm run dev
   ```

## Testing Features

### 1. Navigation Buttons
- Visit the home page
- Click on "Symptom Checker", "Doctors", and "Emergency" in the navigation bar
- Verify they navigate to the correct pages

### 2. Signup and Email Verification
- Go to Auth page and click "Sign Up"
- Fill in user details (patient or doctor)
- Submit the form
- Check your email for verification link
- Click the verification link
- Try to login with verified account

### 3. Admin Dashboard
- Login as admin user
- Navigate to Admin → Users Management
- Verify new users appear automatically
- Check verification status and last login time
- Test filtering by role

### 4. Login Session Display
- Login as any user
- Verify user identity displays in header
- Test logout functionality

### 5. Patient Report Upload
- Login as patient
- Navigate to report upload section
- Upload a PDF, PNG, or JPG file
- Verify it appears in the uploaded reports list
- Test view and download functionality

### 6. Admin Email Notifications
- When a new user signs up, admin should receive email
- When a patient uploads a report, admin should receive email

### 7. Password Reset
- On login page, click "Forgot password?"
- Enter registered email
- Check email for reset link
- Click link and set new password
- Login with new password

### 8. Admin Two-Step Verification
- Login as admin
- After entering credentials, check email for OTP
- Enter OTP on verification page
- Verify access to admin dashboard

### 9. Security Logs
- Login as admin
- Navigate to Admin → Security Logs
- Verify all security events are recorded

### 10. Light/Dark Mode
- Toggle between light and dark modes
- Verify all components are visible and functional in both modes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/verify-otp` - Verify admin OTP

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)

### Reports
- `GET /api/reports` - Get user's reports
- `POST /api/reports` - Upload new report
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/:id/view` - View report
- `GET /api/reports/:id/download` - Download report

### Security Logs
- `GET /api/security-logs` - Get security logs (admin only)

## Troubleshooting

1. **Email not sending**
   - Verify EMAIL_USER and EMAIL_PASS in .env
   - For Gmail, use App Password instead of regular password
   - Check spam/junk folder

2. **Database connection issues**
   - Verify MONGODB_URI in backend/.env
   - Ensure MongoDB service is running

3. **File upload issues**
   - Check file size limits (max 10MB)
   - Verify file types (PDF, PNG, JPG only)

4. **Authentication problems**
   - Ensure JWT_SECRET is set
   - Check that user is verified before login (for non-admin users)