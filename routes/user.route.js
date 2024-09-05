const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const Session = require('../models/Session.model');

// Route to login or register a user
router.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });

    // If the user does not exist, register a new user
    if (!user) {
      user = new User({ email, password: 'password' }); // Basic password for demo purposes
      await user.save();
    }

    // Respond with the user data
    res.json(user);
  } catch (error) {
    console.error('Error logging in or registering user:', error);
    res.status(500).send('Server error');
  }
});

// Route to get all users (for Admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).send('Server error');
  }
});
router.get('/:userId/sessions', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get sessions where the user is either the primary user or an attendee
    const sessions = await Session.find({ 
      $or: [
        { user: userId }, 
        { 'attendees.email': user.email } // Assuming email is used to identify attendees
      ],
      start: { $gte: new Date() } // Only future sessions
    }).sort({ start: 1 }); // Sort by start time

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
