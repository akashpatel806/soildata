const express = require('express');
const SensorData = require('../models/SensorData');
const router = express.Router();

// POST /api/sensors - Receive data from ESP32
router.post('/sensors', async (req, res) => {
  try {
const { soil, soilMoisture, temperature, humidity, ph, deviceId } = req.body;
    
    // Map soil -> soilMoisture (0-4095 -> 0-100%)
    const moisture = soilMoisture || (soil ? Math.round((4095 - soil) / 4095 * 100) : 0);

    const sensorData = new SensorData({
      soilMoisture: moisture,
      temperature: temperature || 0,
      humidity: humidity || 0,
      deviceId: deviceId || 'esp32-unknown'
    });

    // Log incoming raw data
    console.log('📡 ESP32 data received:', req.body);

    await sensorData.save();
    console.log('💾 New sensor data saved:', sensorData);
    res.json({ success: true, message: 'Data stored', data: sensorData });
  } catch (error) {
    console.error('❌ Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// GET /api/sensors/latest - Get latest sensor data for dashboard
router.get('/sensors/latest', async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ timestamp: -1 });
    if (!latest) {
      return res.json({ message: 'No data yet', data: null });
    }
    res.json({ success: true, data: latest });
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// POST /api/data - General data endpoint handling saved to DB
router.post('/data', async (req, res) => {
    console.log("Received Data:", req.body);
    try {
        const { soil, temperature, humidity, deviceId } = req.body;
        const moisture = soil ? Math.round((4095 - soil) / 4095 * 100) : 0;
        const sensorData = new SensorData({
            soilMoisture: moisture,
            temperature: temperature || 0,
            humidity: humidity || 0,
            deviceId: deviceId || 'esp32'
        });
        await sensorData.save();
        console.log('💾 New sensor data saved from /api/data:', sensorData);
        res.json({
            status: "success",
            message: "Data received",
            data: sensorData  // ← returns the actual saved document from MongoDB
        });
    } catch (error) {
        console.error('❌ Error saving data:', error);
        res.status(500).json({ status: "error", message: "Failed to save data" });
    }
});

module.exports = router;

