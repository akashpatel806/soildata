const express = require('express');
const SensorData = require('../models/SensorData');
const router = express.Router();

function normalizeSoilData(body = {}) {
  const rawSoil = [body.soil, body.soilRaw, body.soil_raw, body.rawSoil, body.raw_soil]
    .find(value => value !== undefined && value !== null);
  const percentValue = [body.soilMoisture, body.soil_moisture, body.moisture]
    .find(value => value !== undefined && value !== null);

  const rawNumber = rawSoil !== undefined ? Number(rawSoil) : undefined;
  const percentNumber = percentValue !== undefined ? Number(percentValue) : undefined;

  const soilMoisture = Number.isFinite(percentNumber)
    ? Math.max(0, Math.min(100, percentNumber))
    : (Number.isFinite(rawNumber)
      ? Math.round(Math.max(0, Math.min(100, (rawNumber / 4095) * 100)))
      : 0);

  return {
    soilMoisture,
    rawSoil: Number.isFinite(rawNumber) ? rawNumber : undefined,
    source: Number.isFinite(percentNumber) ? 'percent' : Number.isFinite(rawNumber) ? 'raw' : 'none'
  };
}

// POST /api/sensors - Receive data from ESP32
router.post('/sensors', async (req, res) => {
  try {
    const body = req.body || {};
    const normalized = normalizeSoilData(body);

    const sensorData = new SensorData({
      soilMoisture: normalized.soilMoisture,
      rawSoil: normalized.rawSoil,
      temperature: Number(body.temperature) || 0,
      humidity: Number(body.humidity) || 0,
      deviceId: body.deviceId || 'esp32-unknown'
    });

    // Log incoming raw data and normalized values
    console.log('📡 ESP32 data received:', body);
    console.log('🔧 Soil normalization:', normalized);

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
    const body = req.body || {};
    console.log('Received Data:', body);
    try {
        const normalized = normalizeSoilData(body);
        const sensorData = new SensorData({
            soilMoisture: normalized.soilMoisture,
            rawSoil: normalized.rawSoil,
            temperature: Number(body.temperature) || 0,
            humidity: Number(body.humidity) || 0,
            deviceId: body.deviceId || 'esp32'
        });
        await sensorData.save();
        console.log('🔧 Soil normalization:', normalized);
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

