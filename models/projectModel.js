// projectModel.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: String,
  id: String
  // other project details
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
