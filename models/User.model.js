const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true // Basic password for demo purposes
  }
});

// Export the model
module.exports = mongoose.model('User', userSchema);
