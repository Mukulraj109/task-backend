const express = require('express');
const router = express.Router();
const Session = require('../models/Session.model');

// Schedule a session
router.post('/', async (req, res) => {
  const { user, start, end, attendees, type } = req.body;

  // Check for missing required fields
  if (!user || !start || !end || !attendees || !type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Validate that 'start' and 'end' are proper date strings
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format for start or end' });
    }

    // Create new session
    const session = new Session({ user, start: startDate.toISOString(), end: endDate.toISOString(), attendees, type });

    // Save session to the database
    const savedSession = await session.save();

    // Respond with the saved session in the desired format
    res.status(201).json({
      user: savedSession.user,
      start: savedSession.start,
      end: savedSession.end,
      attendees: savedSession.attendees,
      type: savedSession.type,
    });
  } catch (error) {
    console.error('Error scheduling session:', error);

    // Detailed error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


// Get all sessions for a user
router.get('/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.params.userId }).populate('user', '-password'); // Populating user details while excluding the password
    res.json(sessions);
  } catch (error) {
    console.error('Error retrieving sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { user: req.params.userId },
        { 'attendees.email': req.params.userId } // Adjust based on how user identification is stored
      ]
    });
    res.json(sessions);
  } catch (error) {
    console.error('Error retrieving sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({}).populate('user', '-password'); // Adjust the populate field as needed
    res.json(sessions);
  } catch (error) {
    console.error('Error retrieving sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
