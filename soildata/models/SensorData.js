const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  soilMoisture: { type: Number, min: 0, max: 100 }, // percentage 0-100
  temperature: { type: Number }, // Celsius
  humidity: { type: Number, min: 0, max: 100 }, // percentage 0-100
  ph: { type: Number, min: 0, max: 14 }, // pH 0-14
  deviceId: { type: String, default: 'esp32-unknown' },
  rawSoil: { type: Number } // raw ADC 0-4095
}, {
  timestamps: true
});

module.exports = mongoose.model('SensorData', sensorDataSchema);

