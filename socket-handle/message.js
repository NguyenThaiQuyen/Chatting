exports.eventMessage = (socket) => {
    socket.on('messages', (data, callback) => {
        try {
            const action = data.action;
            switch(action) {
                case "create": {
                    data.action = "receive";
                    socket.broadcast.emit('messages', data);
                    return callback(null, data);
                }
                case "typing": {
                    data.action = "typing";
                    socket.broadcast.emit('messages', data);
                    break;
                }
                case "stop-typing": {
                    data.action = "stop-typing";
                    socket.broadcast.emit('messages', data);
                    break;
                }
                case "seen": {
                    data.action = "seen";
                    socket.broadcast.emit('messages', data);
                    break;
                }
                case "disconnect": {
                    socket.on('disconnect', function (data) {
                        console.log('user disconnection');
                    });
                }
            }
        } catch(err) {
            console.log(err);
            return callback(err);
        }
    });
}