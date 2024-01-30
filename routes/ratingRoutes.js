// ratingRoutes.js
const express = require('express');
const router = express.Router();
const Rating = require('../models/ratingModel');

// Submit rating
router.post('/', async (req, res) => {
  const { projectId, name, mobile,description,question1, question2, question3 } = req.body;

  try {
    const existingRating = await Rating.findOne({ projectId, name });

    if (existingRating) {
      return res.status(400).json({ message: 'Rating already submitted for this project and name combination' });
    }

    const newRating = new Rating({
      projectId,
      name,
      mobile,
      description,
      question1,
      question2,
      question3,
      
    });

    await newRating.save();

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get all rating
router.get('/', async (req, res) => {
  try {
    const rating = await Rating.find().populate('projectId');
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
