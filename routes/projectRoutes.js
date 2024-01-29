// projectRoutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');


// Get all projects
router.post('/', async (req, res) => {
  const { name, id } = req.body;
  try {
    const newProject = new Project({
      name,
      id,
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
