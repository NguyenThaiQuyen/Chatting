const { mongoose } = require('./index.js');

const message = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true,  
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    deleteAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', message);

module.exports = Message;