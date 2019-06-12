const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3009;
const models = require('./models'); // auto read file index.js
const userRoute = require('./apis/user.js');
const groupRoute = require('./apis/group.js');
const messageRoute = require('./apis/message.js');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketHandler = require('./socket-handle/init-connection.js');

app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors({
    "origin" : "*"
}));
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// app.get('/socket.io.js', function(req, res){
//     res.sendFile(__dirname + '/socket.io.js');
// });

// set static in folder public
app.use(express.static('public')); 

// connect server
models
.connectDB()
.then(console.log('Connect server successfully!'))
.catch((err) => {
    //console.error(err);
    process.exit(1);
});

// load apis
userRoute.load(app);
groupRoute.load(app);
messageRoute.load(app);

// handles return error
app.use((err, req, res, next) => {
    if (Array.isArray(err.errors)) {
        const messages = err.errors.map(item => {
            return item.messages;
        });
        return res.status(400).json({
            errors: messages
        });
    };
    return res.status(400).json({
        messages: err.message
    });
});

// socket implement
socketHandler.initConnection(io);

http.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})