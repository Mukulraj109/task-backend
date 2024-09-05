const mongoose = require('mongoose');

// Define the availability schema
const availabilitySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  day: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    required: true 
  },
  start: { 
    type: String, 
    required: true // Store start time as a string (HH:MM format)
  },
  end: { 
    type: String, 
    required: true // Store end time as a string (HH:MM format)
  },
  duration:{
    type: Number, 
    default: 30  
  }
});

module.exports = mongoose.model('Availability', availabilitySchema);
