const mediasoup = require('mediasoup');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config');

// Tạo server HTTP và WebSocket
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let worker, router;

const startMediasoup = async () => {
    // Tạo worker
    worker = await mediasoup.createWorker(config.mediasoup.worker);

    // Log trạng thái worker
    worker.on('died', () => {
        console.error('Mediasoup worker died, restarting...');
        process.exit(1);
    });

    // Tạo router
    router = await worker.createRouter({ mediaCodecs: config.mediasoup.router.mediaCodecs });
};

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('createTransport', async (callback) => {
        // Tạo WebRTC Transport
        const transport = await router.createWebRtcTransport({
            listenIps: [{ ip: '127.0.0.1', announcedIp: null }],
            enableUdp: true,
            enableTcp: true,
        });

        callback({
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
        });

        // Lưu thông tin transport (nếu cần)
        socket.transport = transport;
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Khởi động server
server.listen(3000, async () => {
    console.log('Server is running on http://localhost:3000');
    await startMediasoup();
});
