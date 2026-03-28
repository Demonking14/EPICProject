import 'dotenv/config';
import http from 'http';
import { setupSocket } from './socket.js';
import mongoose from 'mongoose';

console.log('Checking JWT_SECRET...');
if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is missing!');
} else {
    console.log('JWT_SECRET is present.');
}

console.log('Initializing HTTP server...');
const httpServer = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('ok');
});

console.log('Setting up Socket.io...');
try {
    setupSocket(httpServer);
    console.log('Socket.io setup successful.');
} catch (err) {
    console.error('ERROR in setupSocket:', err);
}

const PORT = 5003;
httpServer.listen(PORT, () => {
    console.log(`Debug server listening on port ${PORT}`);
   
    setTimeout(() => {
        console.log('Closing debug server...');
        httpServer.close(() => {
            console.log('Closed.');
            process.exit(0);
        });
    }, 2000);
});
