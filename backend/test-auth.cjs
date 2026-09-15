// Test script for authentication flow
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simulate user registration
console.log('Testing user registration...');

// Simulate password hashing
const password = 'testpassword123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  
  console.log('Password hashed successfully');
  console.log('Hashed password:', hash);
  
  // Simulate password verification
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error('Error comparing passwords:', err);
      return;
    }
    
    console.log('Password verification result:', result);
    
    // Simulate JWT token generation
    const userId = 'test-user-id';
    const jwtSecret = 'test-secret-key';
    const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });
    
    console.log('JWT token generated:', token);
    
    // Simulate JWT token verification
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return;
      }
      
      console.log('Token verified successfully');
      console.log('Decoded token:', decoded);
    });
  });
});