const dns = require('dns').promises;
const net = require('net');

async function checkDns() {
  const hostname = 'cluster0.4klbnja.mongodb.net';
  const srvHostname = `_mongodb._tcp.${hostname}`;

  console.log(`Checking DNS for: ${srvHostname}...`);
  try {
    const srvRecords = await dns.resolveSrv(srvHostname);
    console.log('✅ SRV Record found:', JSON.stringify(srvRecords, null, 2));
    
    for (const record of srvRecords) {
        console.log(`Checking connectivity to ${record.name}:${record.port}...`);
        const socket = new net.Socket();
        socket.setTimeout(2000);
        socket.on('connect', () => {
            console.log(`✅ Successfully connected to ${record.name}:${record.port}`);
            socket.destroy();
        }).on('timeout', () => {
            console.log(`❌ Timeout connecting to ${record.name}:${record.port}`);
            socket.destroy();
        }).on('error', (err) => {
            console.log(`❌ Error connecting to ${record.name}:${record.port}: ${err.message}`);
        }).connect(record.port, record.name);
    }
  } catch (err) {
    console.error('❌ DNS SRV Resolution failed:', err.message);
    console.log('\nPossible fixes:');
    console.log('1. Use Google DNS (8.8.8.8) or Cloudflare (1.1.1.1)');
    console.log('2. Check if a VPN or firewall is blocking SRV records');
    console.log('3. Switch to the non-SRV connection string (legacy format)');
  }
}

checkDns();
