// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import dns from 'dns';

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

dotenv.config();
// dns.setDefaultResultOrder('ipv4first'); // IMPORTANT for Node 24+

const db2URI = process.env.MONGODB_URI;

const db2Connection = mongoose.createConnection(db2URI);

db2Connection.on('connected', () => {
    console.log('MongoDB chat is CONNECTED ✅');
});

db2Connection.on('error', (err) => {
    console.error('MongoDB chat connection ERROR ❌', err);
});

db2Connection.on('disconnected', () => {
    console.warn('MongoDB chat DISCONNECTED ⚠️');
});

export { db2Connection };