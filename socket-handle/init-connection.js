const message = require('../socket-handle/message.js');
const { verifyData } = require ('../middlewares/authentication-middleware.js');

exports.initConnection = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.query.token;
            if (!token) {
                return next(new Error('AUTHENTICATION_FAILED'));
            }
            const verifiedData = verifyData(token);
            if (!verifiedData) {
                return next(new Error('JWT_INVALID_FORMAT'));
            } 
            socket.user = verifiedData;
            return next();
        } catch(e) {
            return next(e);
        }
    })
    io.on('connection', (socket) => {
        console.log('user connection');
        message.eventMessage(socket);
    });
}