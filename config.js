module.exports = {
    mediasoup: {
        worker: {
            rtcMinPort: 20000,
            rtcMaxPort: 20100,
            logLevel: 'debug',
            logTags: ['ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
        },
        router: {
            mediaCodecs: [
                {
                    kind: 'audio',
                    mimeType: 'audio/opus',
                    clockRate: 48000,
                    channels: 2,
                },
                {
                    kind: 'video',
                    mimeType: 'video/VP8',
                    clockRate: 90000,
                    parameters: {
                        'x-google-start-bitrate': 1000,
                    },
                },
            ],
        },
    },
};
