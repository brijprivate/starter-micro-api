const express = require('express');
const router = express.Router();
const Rating = require('../models/ratingModel');
const Project = require('../models/projectModel');

// Endpoint to get the winners for each question and overall winner
router.get('/maxPointsPerQuestionAndOverall', async (req, res) => {
  try {
    const maxPointsPerQuestion = await Rating.aggregate([
      {
        $group: {
          _id: '$projectId',
          totalPointsQuestion1: { $sum: '$question1' },
          totalPointsQuestion2: { $sum: '$question2' },
          totalPointsQuestion3: { $sum: '$question3' },
          totalPointsOverall: { $sum: { $add: ['$question1', '$question2', '$question3'] } },
        },
      },
      { $sort: { totalPointsOverall: -1 } },
      { $limit: 3 },
    ]);

    if (maxPointsPerQuestion.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }

    const winners = {
      question1: null,
      question2: null,
      question3: null,
      overall: null,
    };

    // Find winners for each question and overall winner
    for (const maxPointsProject of maxPointsPerQuestion) {
      const projectDetails = await Project.findById(maxPointsProject._id);

      if (projectDetails) {
        // Update winners for each question
        if (!winners.question1 || maxPointsProject.totalPointsQuestion1 > winners.question1.totalPointsQuestion1) {
          winners.question1 = { projectDetails, ...maxPointsProject };
        }

        if (!winners.question2 || maxPointsProject.totalPointsQuestion2 > winners.question2.totalPointsQuestion2) {
          winners.question2 = { projectDetails, ...maxPointsProject };
        }

        if (!winners.question3 || maxPointsProject.totalPointsQuestion3 > winners.question3.totalPointsQuestion3) {
          winners.question3 = { projectDetails, ...maxPointsProject };
        }

        // Update overall winner
        if (!winners.overall || maxPointsProject.totalPointsOverall > winners.overall.totalPointsOverall) {
          winners.overall = { projectDetails, ...maxPointsProject };
        }
      } else {
        console.error(`Project details not found for project with ID ${maxPointsProject._id}`);
      }
    }

    res.json(winners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
