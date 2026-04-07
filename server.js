require('dotenv').config();
require('dns').setServers(['8.8.8.8']); // Fixes ECONNREFUSED on querySrv
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SensorData = require('./models/SensorData');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection with better error handling & bufferCommands=false
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/soildata', {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});


// Routes
app.use('/api', apiRoutes);

// Root redirect to dashboard ✓
app.get('/', (req, res) => {
  res.redirect('/dashboard.html');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

