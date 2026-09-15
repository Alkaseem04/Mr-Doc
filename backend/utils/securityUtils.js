// Security utilities for MR.DOC Healthcare Platform

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate random token
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate random OTP
const generateOTP = (length = 6) => {
  return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
};

// Encrypt sensitive data
const encryptData = (data, secretKey) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(secretKey, 'GfG', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex')
  };
};

// Decrypt sensitive data
const decryptData = (encryptedData, iv, secretKey) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(secretKey, 'GfG', 32);
  
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  return input;
};

// Rate limiting middleware
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// API rate limiting for authentication endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
const securityHeaders = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  });
};

// Prevent HTTP Parameter Pollution
const preventHPP = () => {
  return hpp();
};

// XSS protection middleware
const xssProtection = () => {
  return xss();
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  const ObjectId = require('mongoose').Types.ObjectId;
  return ObjectId.isValid(id);
};

// Mask sensitive data for logging
const maskSensitiveData = (data) => {
  if (!data) return data;
  
  const maskedData = { ...data };
  
  // Mask common sensitive fields
  if (maskedData.password) {
    maskedData.password = '***MASKED***';
  }
  
  if (maskedData.email) {
    const [name, domain] = maskedData.email.split('@');
    maskedData.email = `${name.charAt(0)}***@${domain}`;
  }
  
  if (maskedData.phone) {
    maskedData.phone = maskedData.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  
  if (maskedData.token) {
    maskedData.token = '***MASKED***';
  }
  
  return maskedData;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  generateOTP,
  encryptData,
  decryptData,
  sanitizeInput,
  createRateLimiter,
  authRateLimiter,
  securityHeaders,
  preventHPP,
  xssProtection,
  isValidObjectId,
  maskSensitiveData
};