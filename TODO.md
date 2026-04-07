# Soil Sensor Project TODO - All files created ✅

## Status:
- [x] 1. Create package.json
- [x] 2. npm install dependencies  
- [x] 3. Create .env.example
- [x] 4. Create server.js (Express app, DB connect)
- [x] 5. Create models/SensorData.js (Mongoose schema)
- [x] 6. Create routes/api.js (POST /api/sensors, GET /api/sensors/latest)
- [x] 7. Create public/dashboard.html
- [x] 8. Create public/dashboard.css

## Next Steps (Setup & Test):
1. Copy `.env.example` → `.env`
2. Set `MONGO_URI` in `.env` (use MongoDB Atlas free tier):
   ```
   PORT=3000
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/soildata?retryWrites=true&w=majority
   ```
3. Get free Atlas URI: mongodb.com/atlas → New Cluster → Connect → Drivers
4. `Ctrl+C` stop current server, then `npm run dev`
5. Test API: 
   ```
   curl -X POST http://localhost:3000/api/sensors -H "Content-Type: application/json" -d "{\"soilMoisture\":45,\"temperature\":25.5,\"humidity\":60,\"deviceId\":\"esp32-01\"}"
   ```
6. View dashboard: http://localhost:3000/dashboard.html (auto-refreshes)
7. ESP32 code sends POST to `http://localhost:3000/api/sensors`

**Project complete! Server ready for ESP32 data. Dashboard shows live soil moisture gauge, temp, humidity.**
