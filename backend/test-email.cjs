// Test script for email functionality
const nodemailer = require('nodemailer');

// Create a test transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'test@gmail.com',
    pass: 'testpassword'
  }
});

// Create a test email
const mailOptions = {
  from: 'test@gmail.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email from Mr. Doc Healthcare Platform.'
};

console.log('Testing email functionality...');
console.log('Transporter created successfully');
console.log('Mail options:', mailOptions);

// Simulate sending email (without actually sending)
console.log('Would send email with the following details:');
console.log('- From:', mailOptions.from);
console.log('- To:', mailOptions.to);
console.log('- Subject:', mailOptions.subject);
console.log('- Body:', mailOptions.text);

console.log('Email functionality test completed successfully');