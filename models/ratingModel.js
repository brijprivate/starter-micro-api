const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  question1: { type: Number, required: true },
  question2: { type: Number, required: true },
  question3: { type: Number, required: true },
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
