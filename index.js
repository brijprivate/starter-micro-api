// var http = require('http');
// http.createServer(function (req, res) {
//     console.log(`Just got a request at ${req.url}!`)
//     res.write('Yo!');
//     res.end();
// }).listen(process.env.PORT || 3000);


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
// Connect to MongoDB (replace 'your-mongodb-url' with your actual MongoDB connection string)
mongoose.connect('mongodb+srv://evaluation:qwerty555@cluster0.wvibmim.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// API Routes
const projectRoutes = require('./routes/projectRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const winner = require('./routes/adminRoutes');

app.use('//projects', projectRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/winner', winner);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

