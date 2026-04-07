require("dotenv").config();
const dns = require("dns");
// Force Google DNS for SRV resolution to bypass local network issues
dns.setServers(["8.8.8.8"]);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/soilData";

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000,
  family: 4 // Force IPv4
}).then(() => console.log("Connected to MongoDB cluster."))
  .catch(err => {
    console.error("Database connection error Details:");
    console.error(`- Error Code: ${err.code}`);
    console.error(`- Hostname: ${err.hostname}`);
    console.error(`- System Call: ${err.syscall}`);
    console.error(`- IP Whitelist Check: https://cloud.mongodb.com/`);
    console.error("Try running 'node diagnose_db.js' if the error persists.");
  });

const schema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  soil: Number,
  ph: Number,
  time: { type: Date, default: Date.now }
});

const Data = mongoose.model("Data", schema);

// API endpoint to save new data (as provided by user)
app.post("/data", async (req, res) => {
  try {
    const d = new Data(req.body);
    await d.save();
    console.log("Data saved:", req.body);
    res.status(201).send("Saved");
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send("Error saving data");
  }
});

// ✅ API endpoint to retrieve data history (Frontend fetches this)
app.get("/api/data", async (req, res) => {
  try {
    const allData = await Data.find().sort({ time: -1 }).limit(10);
    res.json(allData);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
