const dns = require('dns');
dns.setServers(['8.8.8.8']); // Force Google DNS for SRV resolution
const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://akashbhesaniya21_db_user:akash123@cluster0.4klbnja.mongodb.net/';

console.log('Attempting connection with forced Google DNS...');
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000,
}).then(() => {
  console.log('✅ Success! Forced Google DNS worked.');
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection failed even with Google DNS:', err.code);
  process.exit(1);
});
