const mongoose = require('mongoose');

module.exports = {
    connectDB: () => {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        return mongoose.connect('mongodb://localhost:27017/Chatting');
    },
    mongoose
}