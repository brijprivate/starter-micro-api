const express = require('express');
const router = express.Router();
const Rating = require('../models/ratingModel');
const Project = require('../models/projectModel');

// Endpoint to get the winners for each question and overall winner
router.get('/averageRatingPerQuestionAndOverall', async (req, res) => {
  try {
    const averageRatingPerQuestion = await Rating.aggregate([
      {
        $group: {
          _id: '$projectId',
          avgRatingQuestion1: { $avg: '$question1' },
          avgRatingQuestion2: { $avg: '$question2' },
          avgRatingQuestion3: { $avg: '$question3' },
          avgRatingOverall: {
            $avg: {
              $divide: [
                { $add: ['$question1', '$question2', '$question3'] },
                3, // Divide by the number of questions
              ],
            },
          },
        },
      },
      { $sort: { avgRatingOverall: -1 } },
    ]);

    if (averageRatingPerQuestion.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }

    const winners = {
      question1: null,
      question2: null,
      question3: null,
      overall: null,
    };

    // Find winners for each question and overall winner
    for (const averageRatingProject of averageRatingPerQuestion) {
      const projectDetails = await Project.findById(averageRatingProject._id);

      if (projectDetails) {
        // Update winners for each question
        if (!winners.question1 || averageRatingProject.avgRatingQuestion1 > winners.question1.avgRatingQuestion1) {
          winners.question1 = { projectDetails, ...averageRatingProject };
        }

        if (!winners.question2 || averageRatingProject.avgRatingQuestion2 > winners.question2.avgRatingQuestion2) {
          winners.question2 = { projectDetails, ...averageRatingProject };
        }

        if (!winners.question3 || averageRatingProject.avgRatingQuestion3 > winners.question3.avgRatingQuestion3) {
          winners.question3 = { projectDetails, ...averageRatingProject };
        }

        // Update overall winner
        if (!winners.overall || averageRatingProject.avgRatingOverall > winners.overall.avgRatingOverall) {
          winners.overall = { projectDetails, ...averageRatingProject };
        }
      } else {
        console.error(`Project details not found for project with ID ${averageRatingProject._id}`);
      }
    }

    res.json(winners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
