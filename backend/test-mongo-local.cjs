const mongoose = require('mongoose');

// Test local MongoDB connection
console.log('Testing local MongoDB connection...');
mongoose.connect('mongodb://localhost:27017/mrdoc', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => {
  console.log('✅ Local MongoDB Connected');
  mongoose.connection.close();
}).catch(e => {
  console.error('❌ Local MongoDB Error:', e.message);
});