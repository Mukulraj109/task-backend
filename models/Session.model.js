const mongoose = require('mongoose');

// Define the session schema
const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  start: { 
    type: String, 
    required: [true, 'Start date is required'],
  },
  end: { 
    type: String, 
    required: [true, 'End date is required'],
  },
  attendees: [
    {
      name: { type: String, required: [true, 'Attendee name is required'] },
      email: { type: String, required: [true, 'Attendee email is required'], match: [/.+\@.+\..+/, 'Invalid email format'] }
    }
  ],
  type: { 
    type: String,
    enum: ['one-on-one', 'group'], 
    default: 'one-on-one',
    required: true
  }
});

// Export the model
module.exports = mongoose.model('Session', sessionSchema);
