const express = require('express');
const router = express.Router();
const Availability = require('../models/Available.model');

// Route to add availability
router.post('/', async (req, res) => {
  const { user, day, start, end, duration } = req.body;

  // Validate input fields
  if (!user || !day || !start || !end) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const availability = new Availability({ user, day, start, end, duration });
    await availability.save();
    res.json(availability);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Route to get availability by user ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const availability = await Availability.find({ user: userId });
    res.json(availability);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Route to update an availability slot by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { day, start, end, duration } = req.body;

    // Validate input fields
    if (!day || !start || !end) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const availability = await Availability.findByIdAndUpdate(id, { day, start, end, duration }, { new: true });

    if (!availability) {
      return res.status(404).json({ error: 'Availability slot not found' });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update availability slot.' });
  }
});

// Route to delete an availability slot by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const availability = await Availability.findByIdAndDelete(id);

    if (!availability) {
      return res.status(404).json({ error: 'Availability slot not found' });
    }

    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete availability slot.' });
  }
});

module.exports = router;
