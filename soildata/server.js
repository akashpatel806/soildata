require('dotenv').config();
require('dns').setServers(['8.8.8.8']); // Fixes ECONNREFUSED on querySrv
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', apiRoutes);

// Root redirect to dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard.html');
});

// Connect to MongoDB FIRST, then start server
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/soildata', {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

